
import React from 'react';
import { ShoppingCart, Star, Eye, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const installment = (product.price / 3).toFixed(2);

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer p-4"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-white mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-2 right-2">
          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shadow-sm">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow text-left space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
        <h3 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 uppercase h-10">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-900">€</span>
              <span className="text-2xl font-black text-slate-900">
                {Math.floor(product.price)}
                <span className="text-sm font-bold align-top">.{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</span>
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((c, i) => (
              <img 
                key={i} 
                src={c.image} 
                className="w-6 h-6 rounded-full border border-slate-100 object-cover" 
                alt={c.name} 
              />
            ))}
            {product.colors && product.colors.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                +{product.colors.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl space-y-1">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-medium text-slate-500">ή σε 3 άτοκες δόσεις των {installment} €</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Klarna_logo.svg" className="h-2 opacity-60" alt="Klarna" />
           </div>
           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
             {product.rewardPoints} πόντους ανταμοιβής
           </p>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all mt-auto"
        >
          <ShoppingCart size={18} />
          Προσθήκη
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
