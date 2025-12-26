
import React from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Lock, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout 
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Your Cart ({items.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              {/* Fix: Added missing ShoppingCart icon from lucide-react */}
              <ShoppingCart size={48} className="mb-4" />
              <p className="font-medium">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-indigo-600 font-bold underline">Start Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                    <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">€{item.price.toFixed(2)} / unit</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600"><Plus size={14} /></button>
                    </div>
                    <span className="text-sm font-bold text-slate-900">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              <CreditCard size={20} />
              Checkout via Stripe
            </button>
            <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <Lock size={12} /> Secure 256-bit SSL encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
