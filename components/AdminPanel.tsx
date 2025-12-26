
import React, { useState } from 'react';
import { Upload, DollarSign, RefreshCw, Globe, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [xmlUrl, setXmlUrl] = useState('https://www.megapap.com/?route=extension/feed/csxml_feed&token=NzM5TFAzNDY=&lang=el');
  const [status, setStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [tiers, setTiers] = useState<MarkupTier[]>(DEFAULT_TIERS);

  const calculatePrice = (basePrice: number) => {
    const applicableTier = [...tiers]
      .sort((a, b) => b.threshold - a.threshold)
      .find(t => basePrice >= t.threshold) || tiers[0];
    return basePrice * (1 + applicableTier.percentage / 100);
  };

  const parseMegapapXml = (xmlString: string): Product[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDoc.getElementsByTagName('product');
    const productsByModel: Record<string, Product[]> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const supplierPrice = parseFloat(item.getElementsByTagName('weboffer_price_with_vat')[0]?.textContent || 
                                     item.getElementsByTagName('retail_price_with_vat')[0]?.textContent || '0');
      
      const model = item.getElementsByTagName('model')[0]?.textContent?.trim() || '';
      const id = item.getAttribute('id') || Math.random().toString();
      
      const product: Product = {
        id,
        sku: item.getElementsByTagName('sku')[0]?.textContent?.trim() || '',
        model,
        name: item.getElementsByTagName('name')[0]?.textContent?.trim() || '',
        description: item.getElementsByTagName('description')[0]?.textContent?.trim() || '',
        supplierPrice,
        price: calculatePrice(supplierPrice),
        originalPrice: parseFloat(item.getElementsByTagName('retail_price_with_vat')[0]?.textContent || '0'),
        category: item.getElementsByTagName('category')[0]?.textContent?.trim() || 'General',
        image: item.getElementsByTagName('main_image')[0]?.textContent?.trim() || '',
        gallery: Array.from(item.getElementsByTagName('image')).map(img => img.textContent?.trim() || ''),
        stock: parseInt(item.getElementsByTagName('quantity')[0]?.textContent || '0'),
        availability: item.getElementsByTagName('availability')[0]?.textContent?.trim() || '',
        rewardPoints: Math.floor(supplierPrice * 5), // Simulating points
        seoKeywords: [],
        attributes: Array.from(item.getElementsByTagName('attribute')).map(attr => ({
          name: attr.getAttribute('name') || 'Spec',
          value: attr.textContent?.trim() || ''
        }))
      };

      if (!productsByModel[model]) productsByModel[model] = [];
      productsByModel[model].push(product);
    }

    // After grouping, inject variants into each product
    const finalProducts: Product[] = [];
    Object.values(productsByModel).forEach(variants => {
      variants.forEach(p => {
        p.colors = variants.map(v => ({
          name: v.name.split('χρώματος')[1]?.split('Megapap')[0]?.trim() || 'Default',
          image: v.image,
          productId: v.id
        }));
        finalProducts.push(p);
      });
    });

    return finalProducts;
  };

  const handleFetch = async () => {
    setStatus('importing');
    setErrorMessage('');
    try {
      // In this specific sandbox environment, we can't always bypass CORS for external domains 
      // but the logic is fully implemented for a standard browser fetch.
      const response = await fetch(xmlUrl);
      const xmlText = await response.text();
      const products = parseMegapapXml(xmlText);
      onImportProducts(products);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('XML fetch failed. In demo environments, manual pasting is recommended.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 pb-32">
      <header className="text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Supplier XML Management</h1>
        <p className="text-slate-500 font-medium">Διαχείριση Megapap XML και τιμολογιακής πολιτικής.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6 text-left">
          <h2 className="text-xl font-black uppercase tracking-tight">Tiered Markup %</h2>
          <div className="space-y-4">
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase w-20">Από €{tier.threshold}</span>
                <input 
                  type="number" 
                  value={tier.percentage} 
                  onChange={(e) => {
                    const next = [...tiers];
                    next[idx].percentage = parseFloat(e.target.value);
                    setTiers(next);
                  }}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl w-full text-indigo-600 font-bold"
                />
                <span className="font-bold">%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col justify-center gap-6">
           <div className="flex items-center gap-4">
              <Globe className="text-indigo-400" size={32} />
              <div className="text-left">
                 <h3 className="font-bold">Source Link</h3>
                 <p className="text-xs text-slate-400">Megapap Official Feed</p>
              </div>
           </div>
           <input 
              className="bg-white/10 border-none rounded-2xl px-6 py-4 text-xs w-full text-white outline-none" 
              value={xmlUrl} 
              onChange={e => setXmlUrl(e.target.value)} 
            />
           <button 
              onClick={handleFetch}
              disabled={status === 'importing'}
              className="bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 shadow-xl shadow-indigo-500/20"
            >
              {status === 'importing' ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
              ΣΥΓΧΡΟΝΙΣΜΟΣ XML
           </button>
           {status === 'success' && <p className="text-green-400 text-xs font-bold">Κατάλογος ενημερώθηκε επιτυχώς!</p>}
           {status === 'error' && <p className="text-red-400 text-xs font-bold">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
