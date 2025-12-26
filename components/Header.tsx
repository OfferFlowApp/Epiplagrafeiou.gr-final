
import React, { useState, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, Settings, Camera, ChevronDown } from 'lucide-react';
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
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setActiveMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <div className="sticky top-0 z-[100]">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest relative">
        Δωρεάν μεταφορικά για παραγγελίες άνω των 150€!
      </div>

      <header className="glass border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
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

          <div className="flex-grow max-w-2xl relative w-full px-4">
            <div className="flex items-center bg-slate-100 rounded-full px-6 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Αναζητήστε προϊόντα, ιδέες..." 
                className="bg-transparent border-none outline-none px-4 text-sm w-full py-1 text-slate-600"
              />
              <Camera size={18} className="text-slate-400 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>

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

        <nav className="border-t border-slate-100 bg-white relative">
          <div className="container mx-auto px-4 flex items-center justify-center gap-10 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
            {MEGA_MENU_ITEMS.map((item) => (
              <div 
                key={item.title}
                className="relative py-4 group"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${activeMenu === item.title ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
                  onClick={() => item.title === 'Blog' ? onNavigate(Page.Blog) : onNavigate(Page.Shop)}
                >
                  {item.title}
                  {item.subCategories.length > 0 && <ChevronDown size={12} />}
                </div>

                {item.subCategories.length > 0 && (
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full w-screen max-w-4xl bg-white shadow-2xl border-t border-slate-100 rounded-b-3xl overflow-hidden transition-all duration-300 transform origin-top pt-2 ${activeMenu === item.title ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}`}>
                    <div className="p-8 flex gap-10 bg-white">
                      <div className="flex-grow grid grid-cols-3 gap-8">
                        {item.subCategories.map((sub) => (
                          <div key={sub.name} className="flex flex-col items-center gap-3 group/sub cursor-pointer" onClick={() => onNavigate(Page.Shop)}>
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover/sub:border-indigo-400 transition-all">
                              <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-500" />
                            </div>
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{sub.name}</span>
                          </div>
                        ))}
                      </div>
                      {item.featuredImage && (
                        <div className="w-1/3 relative rounded-3xl overflow-hidden group/feat">
                          <img src={item.featuredImage} alt="Featured" className="w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
                            <h3 className="text-xl font-bold mb-1">{item.featuredLabel}</h3>
                            <span className="text-[10px] font-bold underline">Δείτε τη συλλογή</span>
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
