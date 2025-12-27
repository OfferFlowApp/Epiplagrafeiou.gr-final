
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Globe, CheckCircle2, AlertCircle, FileCode, Copy, Terminal, Database, Trash2, Info, Loader2, Clock, Check, Package, Download, Settings, Server, Zap, Upload, FileUp, Save, Share } from 'lucide-react';
import { Product, MarkupTier } from '../types';
import { saveProducts, clearAllProducts, loadProducts } from '../services/dbService';

interface AdminPanelProps {
  onImportProducts: (products: Product[]) => void;
}

interface SyncJobStatus {
  id: string;
  phase: 'IDLE' | 'READING' | 'CLEANING' | 'PARSING' | 'MAPPING' | 'SAVING' | 'COMPLETED' | 'FAILED';
  progress: number;
  logs: { type: 'info' | 'success' | 'error' | 'warning'; text: string; time: string }[];
  errorDetails?: string;
  stats?: { total: number; skipped: number };
}

const DEFAULT_TIERS: MarkupTier[] = [
  { threshold: 0, percentage: 55 },
  { threshold: 50.01, percentage: 33 },
  { threshold: 100.01, percentage: 22 },
  { threshold: 250.01, percentage: 15 },
  { threshold: 500.01, percentage: 10 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onImportProducts }) => {
  const [xmlUrl, setXmlUrl] = useState('https://www.megapap.com/?route=extension/feed/csxml_feed&token=NzM5TFAzNDY=&lang=el');
  const [importMode, setImportMode] = useState<'url' | 'file' | 'backup'>('url');
  const [manualXml, setManualXml] = useState('');
  const [tiers, setTiers] = useState<MarkupTier[]>(DEFAULT_TIERS);
  const [localProductCount, setLocalProductCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  
  const [job, setJob] = useState<SyncJobStatus>({
    id: '',
    phase: 'IDLE',
    progress: 0,
    logs: []
  });

  useEffect(() => {
    const hydrateCount = async () => {
      const stored = await loadProducts();
      if (stored) setLocalProductCount(stored.length);
    };
    hydrateCount();
  }, []);

  const pushLog = (type: 'info' | 'success' | 'error' | 'warning', text: string) => {
    setJob(prev => ({
      ...prev,
      logs: [{ type, text, time: new Date().toLocaleTimeString() }, ...prev.logs].slice(0, 50)
    }));
  };

  const calculatePrice = (basePrice: number) => {
    const tier = [...tiers]
      .sort((a, b) => b.threshold - a.threshold)
      .find(t => basePrice >= t.threshold) || tiers[0];
    return basePrice * (1 + tier.percentage / 100);
  };

  const sanitizeXml = (str: string) => {
    if (!str) return '';
    let clean = str.trim();
    const startIdx = clean.indexOf('<');
    const endIdx = clean.lastIndexOf('>');
    if (startIdx !== -1 && endIdx !== -1) clean = clean.substring(startIdx, endIdx + 1);
    return clean.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, "").trim();
  };

  const processXmlData = async (xmlString: string) => {
    setJob(prev => ({ ...prev, phase: 'CLEANING', progress: 15 }));
    pushLog('info', 'Cleaning XML payload...');
    
    const cleanXml = sanitizeXml(xmlString);
    setJob(prev => ({ ...prev, phase: 'PARSING', progress: 30 }));

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanXml, 'text/xml');
      
      let rawItems = doc.getElementsByTagName('product');
      if (rawItems.length === 0) rawItems = doc.getElementsByTagName('item');

      if (rawItems.length === 0) throw new Error('No products found in XML.');

      setJob(prev => ({ ...prev, phase: 'MAPPING', progress: 50 }));
      pushLog('info', `Mapping ${rawItems.length} products to database...`);

      const products: Product[] = [];
      
      for (let i = 0; i < rawItems.length; i++) {
        const item = rawItems[i];
        const getVal = (tag: string) => item.getElementsByTagName(tag)[0]?.textContent?.trim() || '';

        const supplierPrice = parseFloat(getVal('retail_price_with_vat') || getVal('price') || '0');
        if (isNaN(supplierPrice) || supplierPrice <= 0) continue;

        const finalPrice = calculatePrice(supplierPrice);
        
        products.push({
          id: getVal('id') || getVal('sku') || `p-${i}`,
          sku: getVal('sku') || getVal('model') || '',
          model: getVal('model') || '',
          name: getVal('name') || getVal('title') || '',
          description: getVal('description') || '',
          supplierPrice,
          price: finalPrice,
          originalPrice: finalPrice * 1.3,
          category: getVal('category') || 'Uncategorized',
          image: getVal('main_image') || getVal('image') || '',
          gallery: Array.from(item.getElementsByTagName('image')).map(img => img.textContent?.trim() || '').filter(u => u),
          stock: parseInt(getVal('quantity') || '0'),
          availability: getVal('availability') || 'Check stock',
          rewardPoints: Math.floor(finalPrice * 2),
          seoKeywords: [],
          attributes: Array.from(item.getElementsByTagName('attribute')).map(attr => ({
            name: attr.getElementsByTagName('name')[0]?.textContent || '',
            value: attr.getElementsByTagName('value')[0]?.textContent || ''
          }))
        });
      }

      setJob(prev => ({ ...prev, phase: 'SAVING', progress: 90 }));
      await saveProducts(products);
      onImportProducts(products);
      setLocalProductCount(products.length);
      
      setJob(prev => ({ ...prev, phase: 'COMPLETED', progress: 100 }));
      pushLog('success', `Synchronized ${products.length} products successfully.`);
    } catch (err: any) {
      setJob(prev => ({ ...prev, phase: 'FAILED', errorDetails: err.message }));
      pushLog('error', err.message);
    }
  };

  const handleBackupExport = async () => {
    const products = await loadProducts();
    if (!products) return alert('No products to export.');
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `eppla_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleBackupImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          await saveProducts(json);
          onImportProducts(json);
          setLocalProductCount(json.length);
          alert('Backup restored successfully!');
        }
      } catch (e) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 text-left animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
             <Database className="text-indigo-600" /> Catalog Admin
           </h1>
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500" /> Database Persistence Layer
           </p>
        </div>
        <div className="flex gap-4 items-center">
           <button onClick={handleBackupExport} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
             <Download size={16} /> Export JSON Backup
           </button>
           <button onClick={async () => { if(confirm('Clear Database?')) { await clearAllProducts(); window.location.reload(); } }} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
             <Trash2 size={20} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] mb-10 text-slate-400 flex items-center gap-2"><Settings size={16}/> Markup Config</h3>
            <div className="space-y-6">
               {tiers.map((tier, idx) => (
                 <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400">
                       <span>Over {tier.threshold}€</span>
                       <span className="text-lg text-indigo-600">+{tier.percentage}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={tier.percentage} onChange={(e) => {
                      const next = [...tiers];
                      next[idx].percentage = parseInt(e.target.value);
                      setTiers(next);
                    }} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="flex bg-slate-50 p-2 m-2 rounded-[30px]">
                 <button onClick={() => setImportMode('url')} className={`flex-1 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${importMode === 'url' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>Fetch XML</button>
                 <button onClick={() => setImportMode('file')} className={`flex-1 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${importMode === 'file' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>Upload XML</button>
                 <button onClick={() => setImportMode('backup')} className={`flex-1 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${importMode === 'backup' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>Safety Backup</button>
              </div>

              <div className="p-10 md:p-16 space-y-10">
                 {importMode === 'url' && (
                   <div className="space-y-6">
                      <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-mono text-slate-500" value={xmlUrl} onChange={(e) => setXmlUrl(e.target.value)} />
                      <button onClick={async () => {
                        const jobId = `FETCH-${Math.random().toString(36).substring(7).toUpperCase()}`;
                        setJob({ id: jobId, phase: 'READING', progress: 5, logs: [{ type: 'info', text: 'Connecting to Megapap...', time: new Date().toLocaleTimeString() }] });
                        try {
                          const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(xmlUrl)}`);
                          const data = await res.json();
                          if (data.contents) await processXmlData(data.contents);
                        } catch (e) { setJob(prev => ({ ...prev, phase: 'FAILED', errorDetails: 'Proxy error.' })); }
                      }} className="w-full bg-indigo-600 text-white py-7 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Synchronize from URL</button>
                   </div>
                 )}
                 {importMode === 'file' && (
                    <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 rounded-[40px] p-24 text-center group hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/50">
                       <input type="file" ref={fileInputRef} className="hidden" accept=".xml" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => processXmlData(ev.target?.result as string);
                          reader.readAsText(file);
                       }} />
                       <FileUp size={64} className="mx-auto text-slate-200 group-hover:text-indigo-400 mb-6 transition-colors" />
                       <h4 className="text-xl font-black uppercase tracking-tighter text-slate-400">Drag & Drop XML Feed</h4>
                    </div>
                 )}
                 {importMode === 'backup' && (
                    <div className="text-center space-y-8">
                       <div className="p-10 bg-indigo-50 rounded-[40px] border-2 border-indigo-100 space-y-4">
                          <Share className="mx-auto text-indigo-600" size={48} />
                          <h4 className="text-2xl font-black uppercase tracking-tighter">Safety Recovery</h4>
                          <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Use this if the browser clears your imported items. Always download a backup after a successful XML import.</p>
                       </div>
                       <button onClick={() => backupInputRef.current?.click()} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3">
                         <Upload size={18} /> Restore from JSON Backup
                       </button>
                       <input type="file" ref={backupInputRef} className="hidden" accept=".json" onChange={handleBackupImport} />
                    </div>
                 )}

                 {job.phase !== 'IDLE' && (
                   <div className="space-y-6 animate-slide-in">
                      <div className="flex justify-between items-end">
                         <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                           {job.phase === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />} {job.phase}
                         </p>
                         <p className="text-5xl font-black text-slate-900 tracking-tighter">{job.progress}%</p>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${job.progress}%` }} />
                      </div>
                      <div className="bg-slate-950 rounded-[32px] p-8 font-mono text-[10px] space-y-2 max-h-48 overflow-y-auto scrollbar-hide text-left border border-slate-800 shadow-inner">
                         {job.logs.map((log, idx) => (
                           <div key={idx} className={`flex gap-3 ${log.type === 'error' ? 'text-rose-400' : 'text-slate-500'}`}>
                              <span className="opacity-30">[{log.time}]</span>
                              <span>{log.text}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
