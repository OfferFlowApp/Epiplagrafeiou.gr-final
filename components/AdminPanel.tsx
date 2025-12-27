import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CloudUpload, CloudDownload, Database, Trash2, Info, Loader2, Download, Settings, Server, Zap, Upload, FileUp, Save, Share, ShieldCheck, Activity, AlertTriangle, CheckCircle, Copy, HelpCircle, X, Check, Terminal, ShieldAlert, ExternalLink } from 'lucide-react';
import { Product, MarkupTier } from '../types';
import { saveProducts, clearAllProducts, loadProducts } from '../services/dbService';
import { pushToCloud, pullFromCloud, isCloudConnected, initFirebase, testCloudConnection } from '../services/firebaseService';

interface AdminPanelProps {
  onImportProducts: (products: Product[]) => void;
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
  const [importMode, setImportMode] = useState<'url' | 'file'>('url');
  const [tiers, setTiers] = useState<MarkupTier[]>(DEFAULT_TIERS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<string>('');
  const [cloudStatus, setCloudStatus] = useState(isCloudConnected());
  const [testResult, setTestResult] = useState<{status: 'idle' | 'testing' | 'success' | 'error', message?: string, code?: string}>({status: 'idle'});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initFirebase();
    const timer = setInterval(() => setCloudStatus(isCloudConnected()), 1500);
    return () => clearInterval(timer);
  }, []);

  const runConnectionTest = async () => {
    setTestResult({status: 'testing'});
    const result = await testCloudConnection();
    if (result.success) {
      setTestResult({status: 'success', message: 'Perfect! Database is ready.'});
      setCloudStatus(true);
    } else {
      setTestResult({status: 'error', message: result.error, code: result.code});
    }
  };

  const handleCloudPush = async () => {
    setIsSyncing(true);
    setSyncStep('Mirroring to Google Cloud...');
    const local = await loadProducts();
    if (local && await pushToCloud(local)) {
      alert("Success! Your products are now safe in the Cloud.");
    } else {
      alert("Push failed. Run the connection test below.");
    }
    setIsSyncing(false);
    setSyncStep('');
  };

  const handleCloudPull = async () => {
    setIsSyncing(true);
    setSyncStep('Fetching from Cloud...');
    const cloud = await pullFromCloud();
    if (cloud) {
      await saveProducts(cloud);
      onImportProducts(cloud);
      alert(`Sync Complete: ${cloud.length} items recovered.`);
    } else {
      alert("No cloud data found. Sync your products first!");
    }
    setIsSyncing(false);
    setSyncStep('');
  };

  const processXmlData = async (xmlString: string) => {
    setIsSyncing(true);
    try {
      setSyncStep('Syncing local catalog...');
      const cleanXml = xmlString.trim();
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanXml, 'text/xml');
      let rawItems = doc.getElementsByTagName('product');
      if (rawItems.length === 0) rawItems = doc.getElementsByTagName('item');
      
      const products: Product[] = [];
      for (let i = 0; i < rawItems.length; i++) {
        const item = rawItems[i];
        const getVal = (tag: string) => item.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
        const supplierPrice = parseFloat(getVal('retail_price_with_vat') || getVal('price') || '0');
        if (isNaN(supplierPrice) || supplierPrice <= 0) continue;
        
        const tier = [...tiers].sort((a, b) => b.threshold - a.threshold).find(t => supplierPrice >= t.threshold) || tiers[0];
        const finalPrice = supplierPrice * (1 + tier.percentage / 100);

        products.push({
          id: getVal('id') || getVal('sku') || `p-${i}`,
          sku: getVal('sku') || '',
          model: getVal('model') || '',
          name: getVal('name') || '',
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

      await saveProducts(products);
      if (isCloudConnected()) await pushToCloud(products);
      onImportProducts(products);
      setSyncStep('Sync Complete!');
      setTimeout(() => setSyncStep(''), 2000);
    } catch (e) {
      alert("XML processing failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 text-left pb-32 animate-modern-fade">
      <header className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Dashboard</h1>
           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cloudStatus ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
             <span className={`w-2 h-2 rounded-full ${cloudStatus ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
             {cloudStatus ? 'Firestore Active' : 'Waiting for Cloud Connection'}
           </div>
        </div>
        <button onClick={async () => { if(confirm('Clear all data?')) { await clearAllProducts(); window.location.reload(); } }} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
          <Trash2 size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          {/* Diagnostic Console */}
          <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl border border-white/5">
             <div className="space-y-1">
               <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Diagnostics</h3>
               <p className="text-xl font-black uppercase tracking-tighter">Connection Status</p>
             </div>
             
             <button 
               onClick={runConnectionTest}
               disabled={testResult.status === 'testing'}
               className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
             >
               {testResult.status === 'testing' ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>}
               Run Cloud Health Check
             </button>

             {testResult.status !== 'idle' && (
               <div className={`p-6 rounded-3xl border ${testResult.status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                 <div className="flex items-start gap-4">
                    {testResult.status === 'success' ? <CheckCircle size={20}/> : <ShieldAlert size={20}/>}
                    <div className="space-y-1">
                       <p className="font-black uppercase text-[10px] tracking-widest">
                         {testResult.status === 'success' ? 'Link established' : `Error: ${testResult.code || 'Failed'}`}
                       </p>
                       <p className="text-xs leading-relaxed opacity-80">{testResult.message}</p>
                    </div>
                 </div>
               </div>
             )}

             {testResult.code === 'permission-denied' && (
               <div className="bg-indigo-600 p-6 rounded-3xl space-y-4 animate-modern-fade">
                  <h4 className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Info size={14}/> How to fix this:
                  </h4>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    Google Cloud blocks all database writes by default. Go to your <a href="https://console.firebase.google.com" target="_blank" className="font-bold underline inline-flex items-center gap-1">Firebase Console <ExternalLink size={10}/></a>, select your project, go to <b>Firestore Database</b>, then the <b>Rules</b> tab, and click <b>Edit</b>.
                  </p>
                  <div className="bg-black/20 p-4 rounded-xl font-mono text-[9px] text-indigo-200">
                    allow read, write: if true;
                  </div>
                  <p className="text-[9px] opacity-70 italic">Note: Only use this for development. Add proper auth later.</p>
               </div>
             )}

             <div className="pt-4 grid grid-cols-2 gap-3">
                <button onClick={handleCloudPush} disabled={isSyncing || !cloudStatus} className="py-4 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-2xl font-black uppercase text-[10px] tracking-widest flex flex-col items-center gap-1">
                  <CloudUpload size={16}/> Push
                </button>
                <button onClick={handleCloudPull} disabled={isSyncing || !cloudStatus} className="py-4 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-2xl font-black uppercase text-[10px] tracking-widest flex flex-col items-center gap-1">
                  <CloudDownload size={16}/> Pull
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-white rounded-[50px] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
              <div className="flex bg-slate-50 p-2 m-4 rounded-[30px]">
                 <button onClick={() => setImportMode('url')} className={`flex-1 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${importMode === 'url' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}>Catalog URL</button>
                 <button onClick={() => setImportMode('file')} className={`flex-1 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${importMode === 'file' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}>Local File</button>
              </div>

              <div className="p-12 space-y-8 flex-grow flex flex-col justify-center">
                 {importMode === 'url' ? (
                   <div className="space-y-6">
                      <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-mono text-slate-500 focus:border-indigo-400 outline-none" value={xmlUrl} onChange={(e) => setXmlUrl(e.target.value)} />
                      <button onClick={async () => {
                          setIsSyncing(true);
                          setSyncStep('Analyzing supplier data...');
                          try {
                            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(xmlUrl)}`);
                            const data = await res.json();
                            if (data.contents) await processXmlData(data.contents);
                          } catch (e) { alert("Feed unreachable."); }
                          setIsSyncing(false);
                      }} disabled={isSyncing} className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                        <div className="flex items-center gap-4">
                          {isSyncing ? <Loader2 className="animate-spin"/> : <RefreshCw size={20}/>} 
                          {isSyncing ? 'Synchronizing...' : 'Update Product Catalog'}
                        </div>
                        {syncStep && <span className="text-[9px] opacity-60 normal-case tracking-normal">{syncStep}</span>}
                      </button>
                   </div>
                 ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 rounded-[60px] p-24 text-center group hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/50">
                       <input type="file" ref={fileInputRef} className="hidden" accept=".xml" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => processXmlData(ev.target?.result as string);
                          reader.readAsText(file);
                       }} />
                       <FileUp size={64} className="mx-auto text-slate-200 group-hover:text-indigo-400 mb-6 transition-transform group-hover:-translate-y-2" />
                       <h4 className="text-xl font-black uppercase tracking-tighter">Drag XML here</h4>
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