import React from 'react';
import { ShoppingCart, Tag, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick: () => void;
}

const PriceDisplay: React.FC<{ price: number; originalPrice?: number }> = ({ price, originalPrice }) => {
  const priceString = price.toFixed(2);
  const [integerPart, fractionalPart] = priceString.split('.');

  return (
    <div className="flex items-baseline gap-2">
      <div className="flex items-start font-black text-slate-900">
        <span className="text-lg mt-1 mr-0.5">€</span>
        <span className="text-4xl leading-none tracking-tighter">{integerPart}</span>
        <span className="text-lg leading-none">.{fractionalPart}</span>
      </div>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-slate-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const installment = (product.price / 3).toFixed(2);
  const isInStock = product.stock > 0;
  const pointsEarned = product.rewardPoints || Math.floor(product.price * 5);
  const categoryName = product.category.split(' > ').pop();

  return (
    <div 
      className="group bg-white rounded-[28px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-white p-6">
        {/* Conversion Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-widest animate-modern-fade">
            <Tag size={10} />
            Special Offer
          </div>
        </div>

        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-in-out"
        />
      </div>

      {/* Product Info Area */}
      <div className="flex flex-col flex-grow p-6 pt-0 text-left space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{categoryName}</p>
          <h3 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase text-sm line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </div>
        
        <div className="flex-grow"></div>

        {/* Pricing Section */}
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} />

        {/* Conversion & Trust Drivers */}
        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl">
            <span className="text-[10px] font-medium text-slate-500">
              ή 3 δόσεις των <span className="font-black text-slate-900">€{installment}</span>
            </span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Klarna_logo.svg" className="h-2 opacity-60" alt="Klarna" />
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-black uppercase tracking-tight">
            <Star size={12} className="fill-indigo-600" />
            Κερδίζετε {pointsEarned} πόντους
          </div>

          {isInStock ? (
            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Άμεσα διαθέσιμο</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Κατόπιν παραγγελίας</span>
            </div>
          )}
        </div>

        {/* Add to Cart CTA */}
        <div className="pt-2">
          <button 
            disabled={!isInStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              isInStock 
                ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
            {isInStock ? 'Προσθήκη στο καλάθι' : 'Εξαντλημένο'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;