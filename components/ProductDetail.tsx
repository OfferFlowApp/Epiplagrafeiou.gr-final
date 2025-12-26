
import React, { useState } from 'react';
import { ShoppingCart, Star, ShieldCheck, Truck, Clock, ArrowRight, Share2, Heart, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

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

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 relative p-8">
              <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
            </div>
            <div className="grid grid-cols-4 gap-4">
               {product.gallery.map((img, i) => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 cursor-pointer p-2 bg-white">
                    <img src={img} className="w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                {product.name}
              </h1>
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
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Επιλογή Έκδοσης</p>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      className={`group relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${product.id === color.productId ? 'border-indigo-600 shadow-lg' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      <img src={color.image} className="w-full h-full object-cover" alt={color.name} />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[8px] font-bold py-1 truncate px-1">{color.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-slate-900 rounded-[32px] text-white space-y-6 relative overflow-hidden">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black tracking-tighter">€{product.price.toLocaleString('el-GR')}</span>
                {product.originalPrice && <span className="text-slate-500 line-through text-xl">€{product.originalPrice.toFixed(2)}</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">3 Άτοκες Δόσεις</p>
                   <p className="text-sm font-black">€{installment} / μήνα</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Πόντοι Ανταμοιβής</p>
                   <p className="text-sm font-black">{product.rewardPoints} points</p>
                </div>
              </div>

              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-white text-slate-900 py-6 rounded-[24px] font-black text-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-6 uppercase tracking-tighter shadow-xl"
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
                {activeTab === 'description' ? <div dangerouslySetInnerHTML={{ __html: product.description }} /> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.attributes?.map((attr, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{attr.name}</span>
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
