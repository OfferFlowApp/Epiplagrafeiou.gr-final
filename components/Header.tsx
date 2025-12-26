
import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, Settings, Camera, ChevronDown, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Page } from '../types';
import { MEGA_MENU_ITEMS } from '../constants';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onNavigate, currentPage, onOpenCart }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="sticky top-0 z-[100]">
      {/* Top Banner with Trust Signals */}
      <div className="bg-slate-900 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1"><Truck size={14} className="text-indigo-400" /> Δωρεάν Μεταφορικά > 150€</span>
             <span className="hidden md:flex items-center gap-1"><ShieldCheck size={14} className="text-indigo-400" /> Ασφαλείς Πληρωμές SSL</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1"><Clock size={14} className="text-indigo-400" /> Παράδοση σε 2-3 Ημέρες</span>
          </div>
        </div>
      </div>

      <header className="glass border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => onNavigate(Page.Home)}
          >
            <div className="flex flex-col leading-none uppercase font-black text-slate-800 tracking-tighter text-left">
              <span className="text-xl">Epipla</span>
              <span className="text-xl flex items-center gap-1">
                Grafeiou<span className="text-indigo-600 text-sm">.gr</span>
                <span className="bg-indigo-600 text-white text-[10px] px-1 rounded ml-1 font-bold tracking-normal">PRO</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl relative w-full px-4">
            <div className="flex items-center bg-slate-100 rounded-full px-6 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Αναζητήστε προϊόντα, δωμάτια, ιδέες..." 
                className="bg-transparent border-none outline-none px-4 text-sm w-full py-1 text-slate-600"
              />
              <Camera size={18} className="text-slate-400 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-6 shrink-0">
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
              <User size={20} className="text-slate-500" />
              <span className="hidden lg:block">Λογαριασμός</span>
            </button>
            <button 
              onClick={onOpenCart}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation / Mega Menu Bar */}
        <nav className="border-t border-slate-100 bg-white/50 relative">
          <div className="container mx-auto px-4 flex items-center justify-center gap-10 font-bold text-slate-700 text-xs py-4 uppercase tracking-wider">
            {MEGA_MENU_ITEMS.map((item) => (
              <div 
                key={item.title}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveMenu(item.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div 
                  className={`flex items-center gap-1 cursor-pointer group-hover:text-indigo-600 transition-colors pb-1 border-b-2 ${activeMenu === item.title ? 'border-indigo-600 text-indigo-600' : 'border-transparent'}`}
                  onClick={() => {
                    if (item.title === 'Blog') onNavigate(Page.Blog);
                    else onNavigate(Page.Shop);
                  }}
                >
                  {item.title}
                  {item.subCategories.length > 0 && <ChevronDown size={12} />}
                </div>

                {/* Mega Menu Dropdown - Fixed Gap with py-4 padding */}
                {item.subCategories.length > 0 && (
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full w-screen max-w-5xl bg-white shadow-2xl border border-slate-100 rounded-b-3xl overflow-hidden transition-all duration-300 origin-top pt-4 z-[110] ${activeMenu === item.title ? 'opacity-100 translate-y-0 scale-y-100' : 'opacity-0 translate-y-2 scale-y-0 pointer-events-none'}`}>
                    <div className="p-10 flex gap-12 bg-white">
                      {/* Sub Categories Grid */}
                      <div className="flex-grow grid grid-cols-3 gap-y-10 gap-x-6 text-center">
                        {item.subCategories.map((sub) => (
                          <div 
                            key={sub.name} 
                            className="flex flex-col items-center gap-4 group/sub cursor-pointer"
                            onClick={() => onNavigate(Page.Shop)}
                          >
                            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group-hover/sub:border-indigo-400 group-hover/sub:shadow-xl transition-all duration-500">
                              <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-700" />
                            </div>
                            <span className="text-[11px] font-black text-slate-800 group-hover/sub:text-indigo-600 uppercase tracking-tighter leading-none">{sub.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Featured Side Image */}
                      {item.featuredImage && (
                        <div className="w-2/5 relative rounded-[32px] overflow-hidden group/feat cursor-pointer">
                          <img src={item.featuredImage} alt="Featured" className="w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 text-white text-left">
                            <h3 className="text-3xl font-black mb-3 leading-tight uppercase tracking-tighter">{item.featuredLabel}</h3>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                                Ανακαλύψτε <ChevronDown size={14} className="-rotate-90" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
