
import React, { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

const EmailPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem('popup_shown');
    if (!shown) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('popup_shown', 'true');
    setTimeout(() => setIsVisible(false), 3000);
  };

  const close = () => {
    setIsVisible(false);
    localStorage.setItem('popup_shown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={close} />
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-up">
        <button 
          onClick={close}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 z-10"
        >
          <X size={20} />
        </button>

        <div className="md:w-1/2 relative bg-indigo-600 overflow-hidden min-h-[250px] md:min-h-full">
           <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
           />
           <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
              <div className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/30">
                 <div className="flex items-center gap-2 mb-2">
                    <Gift className="text-yellow-400" />
                    <span className="font-bold uppercase tracking-tighter">Exclusive Offer</span>
                 </div>
                 <h2 className="text-3xl font-bold leading-tight">Claim Your 20% Discount Today</h2>
              </div>
           </div>
        </div>

        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          {submitted ? (
            <div className="text-center animate-bounce-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox!</h3>
              <p className="text-slate-500">Your discount code is on its way. Ready for your dream office?</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Join our community.</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Subscribe to get VIP access to new arrivals, ergonomic tips, and 20% off your first purchase.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input 
                    required
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  Send My Discount Code
                </button>
              </form>
              <p className="mt-6 text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">
                We value your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
