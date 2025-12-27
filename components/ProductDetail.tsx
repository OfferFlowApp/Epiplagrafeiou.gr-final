
import React, { useState } from 'react';
import { ShoppingCart, Star, CheckCircle2, MoveVertical, MoveHorizontal, Maximize2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  relatedProducts: Product[];
  onNavigateToProduct: (p: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onAddToCart, 
  relatedProducts,
  onNavigateToProduct 
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const installment = (product.price / 3).toFixed(2);

  // Helper to extract dimensions from attributes
  const getDim = (name: string) => {
    return product.attributes?.find(a => 
      a.name.toLowerCase().includes(name) || 
      a.name.toLowerCase() === name
    )?.value;
  };

  const dims = {
    height: getDim('ύψος') || getDim('height'),
    width: getDim('μήκος') || getDim('πλάτος') || getDim('width'),
    depth: getDim('βάθος') || getDim('depth')
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="aspect-square rounded-[40px] overflow-hidden bg-white border border-slate-100 relative p-12">
              <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
            </div>
            <div className="grid grid-cols-4 gap-4">
               {product.gallery.map((img, i) => (
                 <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 cursor-pointer p-3 bg-white hover:border-indigo-400 transition-all">
                    <img src={img} className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                  {product.category}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                {product.name}
              </h1>

              {/* Dimensions Icons for Detail */}
              <div className="flex gap-8 text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-fit">
                {dims.height && (
                  <div className="flex flex-col gap-1 items-center">
                    <MoveVertical size={18} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ύψος</span>
                    <span className="text-sm font-bold">{dims.height}</span>
                  </div>
                )}
                {dims.width && (
                  <div className="flex flex-col gap-1 items-center">
                    <MoveHorizontal size={18} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Μήκος</span>
                    <span className="text-sm font-bold">{dims.width}</span>
                  </div>
                )}
                {dims.depth && (
                  <div className="flex flex-col gap-1 items-center">
                    <Maximize2 size={18} className="text-indigo-600 rotate-45" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Βάθος</span>
                    <span className="text-sm font-bold">{dims.depth}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-2 uppercase tracking-widest">
                  <CheckCircle2 size={16} /> {product.availability}
                </span>
              </div>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Επιλέξτε Έκδοση</p>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        // Assuming variants would navigate if productId matches
                        console.log("Variant clicked:", color.name);
                      }}
                      className={`group relative w-20 h-20 rounded-full border-4 transition-all ${product.id === color.productId ? 'border-indigo-600 shadow-xl' : 'border-slate-50 hover:border-indigo-200'}`}
                    >
                      <img src={color.image} className="w-full h-full rounded-full object-cover" alt={color.name} />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600">{color.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black tracking-tighter">€{product.price.toLocaleString('el-GR')}</span>
                {product.originalPrice && <span className="text-slate-500 line-through text-2xl">€{product.originalPrice.toFixed(2)}</span>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">3 Άτοκες Δόσεις</p>
                   <p className="text-lg font-black">€{installment} / μήνα</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Bonus Points</p>
                   <p className="text-lg font-black">{product.rewardPoints} points</p>
                </div>
              </div>

              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-white text-slate-900 py-6 rounded-[28px] font-black text-2xl transition-all hover:bg-indigo-50 active:scale-95 flex items-center justify-center gap-6 uppercase tracking-tighter shadow-xl"
              >
                <ShoppingCart size={28} />
                Προσθήκη στο καλάθι
              </button>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex border-b border-slate-100 gap-10">
                {['description', 'specs'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400'}`}
                  >
                    {tab === 'description' ? 'Περιγραφή' : 'Χαρακτηριστικά'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}
                  </button>
                ))}
              </div>
              <div className="text-slate-600 leading-relaxed text-sm font-medium">
                {activeTab === 'description' ? <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} /> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.attributes?.map((attr, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 rounded-2xl flex flex-col border border-slate-100/50">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{attr.name}</span>
                        <span className="font-bold text-slate-800">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
