
import React from 'react';
import { ShoppingCart, Star, Eye, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Wishlist Placeholder Icon like epipla1.gr */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock < 10 && (
            <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Περιορισμένο Απόθεμα
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {product.category}
          </span>
        </div>
        
        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
            <Eye size={16} /> Προβολή
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-slate-400 ml-2 font-bold uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={10} /> Verified
          </span>
        </div>
        
        <h3 className="font-black text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight tracking-tight uppercase">
          {product.name}
        </h3>

        {/* Color Swatches like epipla1.gr */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mt-2 mb-4">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div 
                key={idx} 
                className="w-6 h-6 rounded-full border border-slate-200 shadow-sm p-[2px]"
                title={color.name}
              >
                <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }}></div>
              </div>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] font-bold text-slate-400 ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 leading-none">€{product.price.toLocaleString('el-GR')}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">με ΦΠΑ</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-indigo-600 hover:bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 hover:shadow-slate-300"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
