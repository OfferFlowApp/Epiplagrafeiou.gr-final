
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, Settings, X, ChevronDown, ChevronRight, Sparkles, LogIn, ArrowLeft } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  onOpenCart: () => void;
  dynamicMegaMenu: any[];
}

const Header: React.FC<HeaderProps> = ({ cartCount, onNavigate, currentPage, onOpenCart, dynamicMegaMenu }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
        {/* Top Promo Bar */}
        <div className={`bg-slate-900 text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-indigo-400" />
            ΔΩΡΕΑΝ ΠΑΡΑΔΟΣΗ ΣΤΗΝ ΗΠΕΙΡΩΤΙΚΗ ΕΛΛΑΔΑ • ΠΛΗΡΩΜΗ ΚΑΤΑ ΤΗΝ ΠΑΡΑΔΟΣΗ • 20% ΕΚΠΤΩΣΗ
          </span>
        </div>

        <header className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-2 shadow-xl' : 'bg-white py-6 border-b border-slate-100'}`}>
          <div className="container mx-auto px-4 flex items-center justify-between gap-6">
            
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer shrink-0"
              onClick={() => onNavigate(Page.Home)}
            >
              <img 
                src="https://i.postimg.cc/HnskmvDn/EpiplaGRAFEIOU.GR-removebg-preview.png" 
                alt="EpplaGrafeiou.gr Logo" 
                className={`transition-all duration-300 object-contain ${isScrolled ? 'h-10' : 'h-16 md:h-20'}`}
              />
            </div>

            {/* Desktop Center Search */}
            <div className="hidden lg:flex flex-grow max-w-2xl px-8">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-5 py-2.5 w-full focus-within:border-indigo-400 focus-within:bg-white transition-all shadow-sm">
                <input type="text" placeholder="Αναζήτηση σε 5000+ προϊόντα..." className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-600" />
                <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-3 md:gap-5 shrink-0">
              <button className="hidden sm:flex p-2 text-slate-600 hover:text-indigo-600 transition-all active:scale-90">
                <User size={22} strokeWidth={2} />
              </button>
              <button className="hidden sm:flex p-2 text-slate-600 hover:text-indigo-600 transition-all active:scale-90" onClick={() => onNavigate(Page.Admin)}>
                <Settings size={22} strokeWidth={2} />
              </button>
              <button 
                onClick={onOpenCart}
                className="p-2.5 bg-slate-900 text-white rounded-xl relative hover:bg-indigo-600 transition-all active:scale-95 shadow-md"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-slate-900">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-900">
                <Menu size={28} />
              </button>
            </div>
          </div>

          {/* Mega Navigation Bar - Now the 'relative' anchor for full-width dropdown */}
          <nav className="hidden lg:flex border-t border-slate-100 mt-4 bg-white relative">
            <div className="container mx-auto px-4 flex items-center justify-center gap-10 font-bold text-slate-500 text-[11px] uppercase tracking-wider h-14">
              {dynamicMegaMenu.map((item) => (
                <div 
                  key={item.title}
                  className="h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button 
                    className={`flex items-center gap-1 transition-all h-full border-b-2 ${activeMenu === item.title ? 'text-indigo-600 border-indigo-600' : 'text-slate-600 border-transparent hover:text-indigo-600'}`}
                    onClick={() => onNavigate(Page.Shop)}
                  >
                    {item.title}
                  </button>

                  {/* Full-Width Mega Menu Dropdown */}
                  {item.subCategories.length > 0 && (
                    <div 
                      className={`absolute left-0 right-0 top-full transition-all duration-300 z-[110] border-t border-slate-100 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] ${activeMenu === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
                    >
                      <div className="container mx-auto px-4 py-12 flex gap-12">
                        {/* Subcategories Grid */}
                        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
                          {item.subCategories.map((sub: any) => (
                            <div 
                              key={sub.name} 
                              className="flex flex-col items-center gap-4 group/sub cursor-pointer" 
                              onClick={() => { onNavigate(Page.Shop); setActiveMenu(null); }}
                            >
                              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50/50 border border-slate-100 group-hover/sub:border-indigo-300 group-hover/sub:bg-white group-hover/sub:shadow-xl transition-all flex items-center justify-center p-3">
                                <img src={sub.image} className="w-full h-full object-contain group-hover/sub:scale-110 transition-transform duration-700" alt={sub.name} />
                              </div>
                              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight text-center leading-tight group-hover/sub:text-indigo-600 transition-colors max-w-[100px]">
                                {sub.name}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Side Preview - Made smaller and sleeker to look 'less heavy' */}
                        {item.featuredImage && (
                          <div className="w-72 shrink-0 relative rounded-[32px] overflow-hidden group/feat cursor-pointer shadow-lg border border-slate-100 h-80" onClick={() => onNavigate(Page.Shop)}>
                            <img src={item.featuredImage} className="w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-1000" alt="Featured" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8 text-left">
                              <span className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Trends 2024</span>
                              <h4 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">
                                {item.title}
                              </h4>
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

      {/* Spacer to prevent layout jump */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-[110px]' : 'h-[170px]'}`}></div>
    </>
  );
};

export default Header;
