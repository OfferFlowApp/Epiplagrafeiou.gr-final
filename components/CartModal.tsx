import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Lock, ShoppingCart, Loader2, ShieldCheck } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  useEffect(() => {
    const handleStart = () => setIsProcessing(true);
    const handleCancel = () => setIsProcessing(false);
    window.addEventListener('stripe-checkout-start', handleStart);
    window.addEventListener('stripe-checkout-cancel', handleCancel);
    return () => {
      window.removeEventListener('stripe-checkout-start', handleStart);
      window.removeEventListener('stripe-checkout-cancel', handleCancel);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-10 text-center space-y-6 animate-fade-in">
            <div className="relative">
              <Loader2 className="animate-spin text-indigo-600" size={64} />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600/20" size={120} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Secure Redirect</h3>
              <p className="text-slate-500 text-sm font-medium">Connecting to Stripe encrypted gateway. Please do not close your browser.</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600 animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
            </div>
          </div>
        )}

        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-xl">
               <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800">Your Cart</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{items.length} Premium Items</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShoppingCart size={64} strokeWidth={1} className="text-slate-300" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Your workspace is empty.</p>
              <button onClick={onClose} className="text-indigo-600 font-black text-xs uppercase underline tracking-widest">Explore Collection</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-24 rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 p-4 shrink-0 transition-transform group-hover:scale-105">
                  <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2 uppercase leading-snug">{item.name}</h4>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-1">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-2 hover:text-indigo-600"><Minus size={12} /></button>
                      <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-2 hover:text-indigo-600"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-black text-slate-900">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 text-[10px] font-black uppercase tracking-widest">
                <span>Shipping (Express)</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-slate-900 tracking-tighter uppercase border-t border-slate-200 pt-4">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <CreditCard size={20} className="group-hover:animate-pulse" />
              Secure Checkout via Stripe
            </button>
            
            <div className="flex flex-col items-center gap-2">
              <p className="flex items-center gap-2 text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">
                <Lock size={10} /> PCI DSS Compliant Gateway
              </p>
              <div className="flex gap-4 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Klarna_logo.svg" className="h-3" alt="Klarna" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;