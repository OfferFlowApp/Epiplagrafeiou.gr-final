
import React from 'react';
import { ShoppingCart, Heart, MoveVertical, MoveHorizontal, Maximize2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
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
        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 uppercase min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Dimensions Section with Icons */}
        <div className="flex gap-4 text-slate-400">
          {dims.height && (
            <div className="flex items-center gap-1">
              <MoveVertical size={14} className="opacity-50" />
              <span className="text-[10px] font-bold">{dims.height}</span>
            </div>
          )}
          {dims.width && (
            <div className="flex items-center gap-1">
              <MoveHorizontal size={14} className="opacity-50" />
              <span className="text-[10px] font-bold">{dims.width}</span>
            </div>
          )}
          {dims.depth && (
            <div className="flex items-center gap-1">
              <Maximize2 size={14} className="opacity-50 rotate-45" />
              <span className="text-[10px] font-bold">{dims.depth}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-1 py-1">
          <span className="text-2xl font-black text-slate-900">
            {Math.floor(product.price)}
            <span className="text-sm font-bold align-top">.{((product.price % 1) * 100).toFixed(0).padStart(2, '0')} €</span>
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through ml-2">€{product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Bubble Variant Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {product.colors.slice(0, 4).map((c, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${product.image === c.image ? 'border-indigo-500 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <img 
                  src={c.image} 
                  className="w-full h-full rounded-full object-cover" 
                  alt={c.name} 
                />
              </div>
            ))}
            {product.colors.length > 4 && (
              <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-50 p-3 rounded-xl space-y-1 mt-auto">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-medium text-slate-500">ή σε 3 άτοκες δόσεις των {installment} €</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Klarna_logo.svg" className="h-2 opacity-60" alt="Klarna" />
           </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <ShoppingCart size={18} />
          Προσθήκη
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
