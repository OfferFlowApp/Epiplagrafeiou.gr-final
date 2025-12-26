
import React, { useState } from 'react';
import { Upload, DollarSign, RefreshCw, FileText, CheckCircle, Globe, AlertCircle, Info } from 'lucide-react';
import { Product, MarkupTier } from '../types';

interface AdminPanelProps {
  onImportProducts: (products: Product[]) => void;
}

const DEFAULT_TIERS: MarkupTier[] = [
  { threshold: 0, percentage: 40 },
  { threshold: 200, percentage: 30 },
  { threshold: 500, percentage: 20 },
  { threshold: 1500, percentage: 12 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onImportProducts }) => {
  const [xmlUrl, setXmlUrl] = useState('https://api.epplagrafeiou.gr/v1/supplier/catalog.xml');
  const [xmlData, setXmlData] = useState('');
  const [status, setStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [tiers, setTiers] = useState<MarkupTier[]>(DEFAULT_TIERS);

  const calculatePrice = (basePrice: number) => {
    // Find the applicable tier (highest threshold that is still less than or equal to basePrice)
    const applicableTier = [...tiers]
      .sort((a, b) => b.threshold - a.threshold)
      .find(t => basePrice >= t.threshold) || tiers[0];
    
    return basePrice * (1 + applicableTier.percentage / 100);
  };

  const parseXml = (xmlString: string): Product[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDoc.getElementsByTagName('product');
    const importedProducts: Product[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = item.getElementsByTagName('id')[0]?.textContent || Math.random().toString(36).substr(2, 9);
      const sku = item.getElementsByTagName('sku')[0]?.textContent || `SKU-${id}`;
      const name = item.getElementsByTagName('name')[0]?.textContent || 'Unnamed Product';
      const description = item.getElementsByTagName('description')[0]?.textContent || '';
      const supplierPrice = parseFloat(item.getElementsByTagName('price')[0]?.textContent || '0');
      const category = item.getElementsByTagName('category')[0]?.textContent || 'General';
      const image = item.getElementsByTagName('image')[0]?.textContent || 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800';
      const stock = parseInt(item.getElementsByTagName('stock')[0]?.textContent || '0');

      importedProducts.push({
        id,
        sku,
        name,
        description,
        supplierPrice,
        price: calculatePrice(supplierPrice),
        category,
        image,
        stock,
        seoKeywords: [name.toLowerCase(), category.toLowerCase(), 'office furniture']
      });
    }

    return importedProducts;
  };

  const handleFetchAndImport = async () => {
    setStatus('importing');
    setErrorMessage('');
    
    try {
      // For demo purposes, we simulate the fetch if it's the mock URL
      // In a real app, this would be: const response = await fetch(xmlUrl);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockXml = `
        <catalog>
          <product>
            <id>xml_1</id>
            <sku>CH-001</sku>
            <name>AeroFlow Task Chair</name>
            <description>Advanced breathable mesh with synchronous tilt mechanism.</description>
            <price>180.00</price>
            <category>Chairs</category>
            <image>https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800</image>
            <stock>45</stock>
          </product>
          <product>
            <id>xml_2</id>
            <sku>DK-002</sku>
            <name>Titan Industrial L-Desk</name>
            <description>Spacious corner desk with heavy-duty carbon steel frame.</description>
            <price>650.00</price>
            <category>Desks</category>
            <image>https://images.unsplash.com/photo-1591133000413-3b09e4962ca6?auto=format&fit=crop&q=80&w=800</image>
            <stock>12</stock>
          </product>
          <product>
            <id>xml_3</id>
            <sku>ST-003</sku>
            <name>SilentDrawer Archive Cabinet</name>
            <description>Fire-resistant steel cabinet with sound-dampening sliders.</description>
            <price>1200.00</price>
            <category>Storage</category>
            <image>https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800</image>
            <stock>8</stock>
          </product>
        </catalog>
      `;

      const products = parseXml(xmlData || mockXml);
      onImportProducts(products);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to fetch or parse XML catalog. Check URL or data format.');
    }
  };

  const updateTier = (index: number, field: 'threshold' | 'percentage', value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory & Pricing Control</h1>
          <p className="text-slate-500">Master supplier links, XML data, and tiered profit strategies.</p>
        </div>
        <div className="flex gap-2">
          <div className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${status === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <RefreshCw size={14} className={status === 'importing' ? 'animate-spin' : ''} />
            {status === 'importing' ? 'Syncing...' : 'System Live'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tiered Markup Management */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Tiered Pricing Strategy</h2>
                <p className="text-xs text-slate-400">Markups decrease as item value increases.</p>
              </div>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl cursor-help group relative">
              <Info size={16} />
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-relaxed">
                A tiered markup strategy ensures competitiveness for high-ticket items while maintaining healthy margins on smaller accessories.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
              <span>Min. Supplier Price</span>
              <span>Profit Markup</span>
              <span className="text-right">Example Sale</span>
            </div>
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-slate-400 text-sm">€</span>
                  <input 
                    type="number" 
                    value={tier.threshold} 
                    onChange={(e) => updateTier(idx, 'threshold', parseFloat(e.target.value))}
                    className="w-full bg-transparent font-bold text-slate-700 outline-none"
                    disabled={idx === 0}
                  />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    type="number" 
                    value={tier.percentage} 
                    onChange={(e) => updateTier(idx, 'percentage', parseFloat(e.target.value))}
                    className="w-full bg-transparent font-bold text-indigo-600 text-right outline-none"
                  />
                  <span className="text-indigo-600 text-sm font-bold">%</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-xs font-medium text-slate-500">
                    €{(tier.threshold * (1 + tier.percentage / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Summary */}
        <div className="bg-slate-900 text-white p-8 rounded-[32px] space-y-6 shadow-xl shadow-slate-200">
           <h2 className="text-lg font-bold">Sync Activity</h2>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-green-400" size={24} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total SKUs</p>
                    <p className="text-2xl font-bold">1,248</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Globe className="text-indigo-400" size={24} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Active Links</p>
                    <p className="text-2xl font-bold">4 Suppliers</p>
                 </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                   "Pricing tiers are synchronized across all integrated Greek supplier networks every 6 hours."
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Supplier XML Source</h2>
              <p className="text-sm text-slate-500">Connect directly to supplier API or catalog URL.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Feed URL</label>
            <div className="flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder="https://supplier.com/api/products.xml"
                className="flex-grow p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium text-slate-600"
                value={xmlUrl}
                onChange={(e) => setXmlUrl(e.target.value)}
              />
              <button 
                onClick={handleFetchAndImport}
                disabled={status === 'importing' || !xmlUrl}
                className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg whitespace-nowrap ${
                  status === 'success' ? 'bg-green-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300'
                }`}
              >
                {status === 'importing' ? <RefreshCw size={20} className="animate-spin" /> : <Globe size={20} />}
                Fetch from URL
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-[0.2em]">OR PASTE MANUALLY</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">XML Content</label>
            <textarea 
              placeholder="<catalog> <product> ... </product> </catalog>"
              className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-[32px] outline-none focus:border-indigo-300 focus:bg-white transition-all font-mono text-xs text-slate-600 leading-relaxed"
              value={xmlData}
              onChange={(e) => setXmlData(e.target.value)}
            />
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-fade-in">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <button 
            onClick={handleFetchAndImport}
            disabled={status === 'importing' || (!xmlData && !xmlUrl)}
            className={`w-full py-5 rounded-[24px] font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 ${
              status === 'success' ? 'bg-green-600 text-white shadow-green-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 disabled:bg-slate-200 disabled:shadow-none'
            }`}
          >
            {status === 'idle' && <><Upload size={20} /> Initialize Smart Markup Import</>}
            {status === 'importing' && <><RefreshCw size={20} className="animate-spin" /> Calculating Multi-Tier Markups...</>}
            {status === 'success' && <><CheckCircle size={20} /> {xmlData ? 'Manual' : 'URL'} Catalog Synchronized!</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
