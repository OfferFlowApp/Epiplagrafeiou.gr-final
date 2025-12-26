
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
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-6">
            <div className="aspect-square rounded-[48px] overflow-hidden bg-slate-50 border border-slate-100 group cursor-zoom-in relative">
              <img 
                src={product.image} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={product.name} 
              />
              <div className="absolute bottom-6 right-6">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2">
                   <ShieldCheck className="text-green-500" size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Εγγυημένη Ποιότητα</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-[24px] overflow-hidden border-2 border-slate-100 hover:border-indigo-600 transition-all cursor-pointer bg-slate-50">
                    <img src={product.image} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                 </div>
               ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full shadow-sm">
                  {product.category}
                </span>
                <div className="flex gap-4">
                  <button className="p-3 bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl transition-all shadow-sm"><Share2 size={18} className="text-slate-400" /></button>
                  <button className="p-3 bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl transition-all shadow-sm"><Heart size={18} className="text-slate-400" /></button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">128 Αξιολογήσεις</span>
                <span className="text-slate-200">|</span>
                <span className="text-[11px] font-black text-green-600 flex items-center gap-2 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Άμεσα Διαθέσιμο
                </span>
              </div>
            </div>

            {/* Colors Section like epipla1.gr */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Επιλογή Χρώματος: <span className="text-slate-900">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative w-12 h-12 rounded-2xl p-1 transition-all duration-300 border-2 ${selectedColor === color.name ? 'border-indigo-600 shadow-lg scale-110' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: color.hex }}></div>
                      {selectedColor === color.name && (
                        <div className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-md animate-bounce-in">
                          <CheckCircle2 size={10} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-10 bg-slate-900 rounded-[40px] shadow-2xl space-y-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-end gap-4 relative z-10">
                <span className="text-5xl font-black tracking-tighter">€{product.price.toLocaleString('el-GR')}</span>
                <span className="text-indigo-400/50 line-through text-2xl mb-1">€{(product.price * 1.25).toLocaleString('el-GR')}</span>
              </div>
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-xl font-black">3</div>
                     <div className="text-left">
                        <p className="text-[10px] font-bold uppercase text-indigo-300 tracking-widest">Δόσεις Klarna</p>
                        <p className="text-sm font-black tracking-tight">€{(product.price / 3).toLocaleString('el-GR')} / μήνα</p>
                     </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex items-center gap-4">
                     <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                        <Truck size={24} />
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-bold uppercase text-green-300 tracking-widest">Παράδοση</p>
                        <p className="text-sm font-black tracking-tight">Δωρεάν σε όλη την Ελλάδα</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 relative z-10">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-white text-slate-900 py-7 rounded-[28px] font-black text-2xl shadow-xl transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-6 uppercase tracking-tighter"
                >
                  <ShoppingCart size={28} />
                  Προσθήκη στο καλάθι
                </button>
                <div className="flex items-center justify-center gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <RotateCcw size={20} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">365 Μέρες Επιστροφή</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Lock size={20} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Star size={20} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Verified Store</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-6 pt-4">
              <div className="flex border-b border-slate-100 gap-10">
                {['description', 'specs', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400'}`}
                  >
                    {tab === 'description' && 'Περιγραφή'}
                    {tab === 'specs' && 'Χαρακτηριστικά'}
                    {tab === 'reviews' && 'Κριτικές (128)'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}
                  </button>
                ))}
              </div>
              <div className="text-slate-600 leading-relaxed text-left text-sm font-medium">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-slate-800">Σχεδιασμένο για τη δική σας άνεση.</p>
                    <p>{product.description}</p>
                    <p>Κάθε κομμάτι της συλλογής μας περνάει από αυστηρούς ελέγχους ποιότητας για να εξασφαλίσουμε ότι θα σας συντροφεύει για χρόνια.</p>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100"><span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-1">SKU</span><span className="font-black text-slate-800 tracking-tight">{product.sku}</span></div>
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100"><span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-1">Διαστάσεις</span><span className="font-black text-slate-800 tracking-tight">80cm x 351cm x 191cm</span></div>
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100"><span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-1">Υλικό Επένδυσης</span><span className="font-black text-slate-800 tracking-tight">Ύφασμα Υψηλής Αντοχής</span></div>
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100"><span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest mb-1">Χώρα Κατασκευής</span><span className="font-black text-slate-800 tracking-tight">Ελλάδα</span></div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {[1,2].map(r => (
                      <div key={r} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex items-center gap-2 mb-2">
                           {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                           <span className="text-[10px] font-black uppercase text-indigo-600 ml-2">Verified Buyer</span>
                         </div>
                         <p className="font-bold text-slate-800 mb-1">Εξαιρετική ποιότητα!</p>
                         <p className="text-xs text-slate-500">Πραγματικά εντυπωσιασμένος από την ταχύτητα παράδοσης και την ποιότητα κατασκευής.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32 space-y-16">
           <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Συμπληρώστε τον χώρο σας</h2>
              <div className="w-20 h-1 bg-indigo-600 rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={() => onNavigateToProduct(p)} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
