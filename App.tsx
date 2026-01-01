import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Page, Product, CartItem } from './types';
import { MOCK_PRODUCTS, CATEGORIES as BASE_CATEGORIES, MEGA_MENU_ITEMS as BASE_MEGA_MENU, SEO_TEXTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import EmailPopup from './components/EmailPopup';
import CartModal from './components/CartModal';
import { loadProducts, saveProducts } from './services/dbService';
import { pullFromCloud, pushToCloud, initFirebase } from './services/firebaseService';
import { initiateStripeCheckout } from './services/stripeService';
import { ShoppingCart, Truck, CheckCircle2, Zap, Sparkles, CreditCard as CardIcon, Loader2, PackageSearch, AlertCircle } from 'lucide-react';
import { createSlug } from './utils';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    const hydrate = async () => {
      try {
        console.log("App: Initializing Cloud Services...");
        initFirebase();
        
        let initialData: Product[] = [];
        
        try {
          const cloudData = await pullFromCloud();
          if (cloudData && cloudData.length > 0) {
            initialData = cloudData;
            await saveProducts(cloudData);
            console.log("App: Synced from Cloud.");
          }
        } catch (cloudErr) {
          console.warn("App: Cloud Sync skipped (Normal if keys missing).", cloudErr);
        }

        if (initialData.length === 0) {
          const localData = await loadProducts();
          if (localData && localData.length > 0) {
            initialData = localData;
            console.log("App: Loaded from Local DB.");
          } else {
            initialData = MOCK_PRODUCTS;
            console.log("App: Using MOCK data.");
          }
        }

        setProducts(initialData);
      } catch (e: any) {
        console.error("App: Fatal hydration error", e);
        setError(e.message || "Failed to initialize application core.");
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
        initialized.current = true;
      }
    };

    hydrate();
  }, []);

  const handleNavigate = (page: Page, categorySlug?: string) => {
    setCurrentPage(page);
    if (categorySlug) {
      setActiveCategorySlug(categorySlug.toLowerCase().replace(/^\/|\/$/g, ''));
    } else if (page === Page.Shop) {
      setActiveCategorySlug(null); 
    }
    window.scrollTo(0, 0);
  };

  const dynamicMegaMenu = useMemo(() => {
    const requestedOrder = ['Επιπλα Γραφείου', 'Διακόσμηση', 'Φωτισμός', 'Έπιπλα Εσωτερικού χώρου'];
    const menu = requestedOrder.map(title => {
      const base = BASE_MEGA_MENU.find(m => m.title === title) || { title, subCategories: [], featuredImage: '', featuredLabel: '' };
      return { ...JSON.parse(JSON.stringify(base)), subCategories: [] };
    });

    if (!products.length) return menu;

    const supplierCats = new Set<string>();
    products.forEach(p => supplierCats.add(p.category.trim()));

    supplierCats.forEach(fullCat => {
      const lowerCat = fullCat.toLowerCase();
      const isOutdoor = lowerCat.includes('κήπου') || lowerCat.includes('outdoor') || lowerCat.includes('βεράντα') || lowerCat.includes('garden');
      const isOffice = lowerCat.includes('γραφεί') || lowerCat.includes('office') || lowerCat.includes('εργασία');
      const isLighting = lowerCat.includes('φωτισ') || lowerCat.includes('light');
      const isDecor = lowerCat.includes('διακόσμηση') || lowerCat.includes('decor');

      let targetIndex = -1;
      if (!isOutdoor && isOffice) targetIndex = 0;
      else if (isDecor) targetIndex = 1;
      else if (isLighting) targetIndex = 2;
      else targetIndex = 3;

      if (targetIndex !== -1) {
        const parts = fullCat.split(' > ').map(p => p.trim());
        parts.forEach((partName, idx) => {
          if (idx === 0) return;
          if (partName && !menu[targetIndex].subCategories.find((s: any) => s.name === partName)) {
            const representativeProduct = products.find(p => p.category.split(' > ').map(c => c.trim()).includes(partName));
            menu[targetIndex].subCategories.push({
              name: partName,
              image: representativeProduct?.image || 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=200'
            });
          }
        });
      }
    });

    menu.forEach(m => m.subCategories.sort((a: any, b: any) => a.name.localeCompare(b.name)));
    return menu;
  }, [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    await initiateStripeCheckout(cart);
  };

  const filteredProducts = useMemo(() => {
    if (!activeCategorySlug) return products;
    return products.filter(p => {
      const categoryPathArray = p.category.split(' > ').map(createSlug);
      const matchesBucket = dynamicMegaMenu.some(menu => {
         if (createSlug(menu.title) === activeCategorySlug) {
            const lowerP = p.category.toLowerCase();
            const isOutdoor = lowerP.includes('κήπου') || lowerP.includes('outdoor') || lowerP.includes('βεράντα');
            if (menu.title === 'Επιπλα Γραφείου') return !isOutdoor && (lowerP.includes('γραφεί') || lowerP.includes('office'));
            if (menu.title === 'Διακόσμηση') return lowerP.includes('διακόσμηση') || lowerP.includes('decor');
            if (menu.title === 'Φωτισμός') return lowerP.includes('φωτισ') || lowerP.includes('light');
            if (menu.title === 'Έπιπλα Εσωτερικού χώρου') return isOutdoor || lowerP.includes('εσωτερικ') || lowerP.includes('σαλόνι');
         }
         return false;
      });
      const matchesIndividualPart = categoryPathArray.includes(activeCategorySlug);
      const fullPathString = categoryPathArray.join('/');
      return matchesBucket || matchesIndividualPart || fullPathString.includes(activeCategorySlug);
    });
  }, [activeCategorySlug, products, dynamicMegaMenu]);

  const renderHome = () => (
    <div className="animate-fade-in text-left">
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] py-12">
        <div className="space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-indigo-600">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Design your productivity</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                Modern<br />
                <span className="text-indigo-600">Office</span><br />
                Solutions
             </h1>
             <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">
                Premium έπιπλα γραφείου που αναβαθμίζουν τον χώρο και την απόδοσή σας. 
                Ανακαλύψτε την συλλογή 2024 με εργονομικές καρέκλες και minimal γραφεία.
             </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                <CardIcon className="text-indigo-600" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Installments</p>
                <p className="font-bold text-slate-900 text-xs">3 Άτοκες Δόσεις</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                <Truck className="text-indigo-600" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping</p>
                <p className="font-bold text-slate-900 text-xs">Δωρεάν &gt; 150€</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                <Zap className="text-indigo-600" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rewards</p>
                <p className="font-bold text-slate-900 text-xs">Bonus Points x5</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => handleNavigate(Page.Shop)} className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">EXPLORE SHOP</button>
            <button className="px-10 py-5 rounded-[24px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">VIEW TRENDS</button>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative group">
           <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
           <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=1200" className="w-full h-auto rounded-[60px] shadow-2xl relative z-10 transition-transform duration-1000 group-hover:scale-[1.02]" alt="Office Setup" />
        </div>
      </section>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        cartCount={cart.length} 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        onOpenCart={() => setIsCartOpen(true)} 
        dynamicMegaMenu={dynamicMegaMenu} 
      />
      
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Environment...</p>
        </div>
      ) : error ? (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-10 space-y-6">
           <AlertCircle className="text-rose-500" size={64} />
           <div>
             <h2 className="text-2xl font-black uppercase">Configuration Error</h2>
             <p className="text-slate-500 max-w-md mx-auto mt-2">{error}</p>
           </div>
           <button onClick={() => window.location.reload()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Retry Connection</button>
        </div>
      ) : (
        <main className="animate-fade-in">
          {currentPage === Page.Home && renderHome()}
          {currentPage === Page.Shop && (
            <div className="container mx-auto px-4 py-12 text-left min-h-screen">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter">
                    {activeCategorySlug ? activeCategorySlug.split('/').pop()?.replace(/-/g, ' ') : 'Όλα τα προϊόντα'}
                  </h1>
                  <p className="text-slate-500 max-w-2xl mt-4 font-medium">Κορυφαία έπιπλα γραφείου και σπιτιού με άμεση παράδοση σε όλη την Ελλάδα.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveCategorySlug(null)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!activeCategorySlug ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Όλα</button>
                  {dynamicMegaMenu.map(m => (
                    <button key={m.title} onClick={() => setActiveCategorySlug(createSlug(m.title))} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategorySlug === createSlug(m.title) ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{m.title}</button>
                  ))}
                </div>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onClick={() => { setSelectedProduct(product); setCurrentPage(Page.Product); window.scrollTo(0,0); }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-4">
                  <PackageSearch size={64} className="opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία</p>
                  <button onClick={() => setActiveCategorySlug(null)} className="text-indigo-600 font-black text-xs uppercase tracking-widest underline">Επιστροφή σε όλα</button>
                </div>
              )}
            </div>
          )}
          {currentPage === Page.Admin && <AdminPanel onImportProducts={(newProducts) => { setProducts(newProducts); handleNavigate(Page.Shop); }} />}
          {currentPage === Page.Product && selectedProduct && <ProductDetail product={selectedProduct} onAddToCart={addToCart} relatedProducts={products.slice(0, 4)} onNavigateToProduct={(p) => { setSelectedProduct(p); window.scrollTo(0,0); }} />}
        </main>
      )}

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateCartQuantity} 
        onRemove={removeFromCart} 
        onCheckout={handleCheckout} 
      />

      <footer className="bg-slate-900 text-white py-24 mt-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
           <div className="space-y-6">
              <img src="https://i.postimg.cc/HnskmvDn/EpiplaGRAFEIOU.GR-removebg-preview.png" alt="Eppla Logo" className="h-16 w-auto object-contain" />
              <p className="text-slate-400 text-sm leading-relaxed">Modern office environments designed for the high-performance workforce.</p>
           </div>
           <div><h4 onClick={() => handleNavigate(Page.Admin)} className="font-bold uppercase tracking-widest text-xs mb-8 cursor-pointer hover:text-indigo-400 transition-colors">Admin Access</h4></div>
           <div><h4 className="font-bold uppercase tracking-widest text-xs mb-8">Επικοινωνία</h4><p className="text-slate-400 text-sm">Καναδά 11, Ρόδος<br/>22410 21087</p></div>
        </div>
      </footer>
      <EmailPopup />
    </div>
  );
};

export default App;