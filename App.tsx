
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Page, Product, CartItem } from './types';
import { MOCK_PRODUCTS, CATEGORIES as BASE_CATEGORIES, MEGA_MENU_ITEMS as BASE_MEGA_MENU, SEO_TEXTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import EmailPopup from './components/EmailPopup';
import { loadProducts, saveProducts } from './services/dbService';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Lock, Truck, CheckCircle2, Zap, Sparkles, CreditCard as CardIcon, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [shippingCity, setShippingCity] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  
  // CRITICAL: Prevent hydration race conditions
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    const hydrate = async () => {
      try {
        console.log("Eppla: Initializing state...");
        
        // 1. Attempt to load from IndexedDB
        const stored = await loadProducts();
        
        if (stored && stored.length > 0) {
          console.log(`Eppla: Found ${stored.length} products in local DB.`);
          setProducts(stored);
        } else {
          // 2. Only if DB is empty, use MOCK_PRODUCTS
          console.log("Eppla: Database empty. Loading factory defaults.");
          setProducts(MOCK_PRODUCTS);
        }
      } catch (e) {
        console.error("Eppla: Hydration failed", e);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
        initialized.current = true;
      }
    };

    hydrate();
  }, []);

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
      
      // STRICT CATEGORY FILTERING
      const isGarden = lowerCat.includes('κήπου') || lowerCat.includes('outdoor') || lowerCat.includes('βεράντας') || lowerCat.includes('garden');
      const isOffice = lowerCat.includes('γραφεί') || lowerCat.includes('office') || lowerCat.includes('εργασίας') || lowerCat.includes('επαγγελματικό');
      const isLighting = lowerCat.includes('φωτισ') || lowerCat.includes('light');
      const isDecor = lowerCat.includes('διακόσμηση') || lowerCat.includes('decor') || lowerCat.includes('πίνακες') || lowerCat.includes('ρολόγια') || lowerCat.includes('καθρέπτες');

      let targetIndex = -1;

      // Rule: Office section MUST NOT include Garden furniture
      if (!isGarden && isOffice) {
        targetIndex = 0;
      } else if (isDecor) {
        targetIndex = 1;
      } else if (isLighting) {
        targetIndex = 2;
      } else {
        // Includes Garden furniture and general interior
        targetIndex = 3;
      }

      if (targetIndex !== -1) {
        const name = fullCat.includes('>') ? fullCat.split('>').pop()?.trim() : fullCat;
        if (!menu[targetIndex].subCategories.find((s: any) => s.name === name)) {
          menu[targetIndex].subCategories.push({
            name: name || fullCat,
            image: products.find(p => p.category === fullCat)?.image || 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=200'
          });
        }
      }
    });
    return menu;
  }, [products]);

  const dynamicCategoriesList = useMemo(() => ['Όλα', ...dynamicMegaMenu.map(m => m.title)], [dynamicMegaMenu]);
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  
  const shippingCost = useMemo(() => {
    if (subtotal === 0 || subtotal >= 150) return 0;
    const city = shippingCity.toLowerCase().trim();
    if (city === 'ρόδος' || city === 'rodos') return 5.00;
    return city === '' ? 10.00 : 12.00;
  }, [subtotal, shippingCity]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setCurrentPage(Page.Cart);
    setIsOrdered(false);
  };

  const handleImportProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    await saveProducts(newProducts);
    setCurrentPage(Page.Shop);
    console.log("Eppla: Catalog synchronized and stored permanently.");
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.Product);
    window.scrollTo(0, 0);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Όλα') return products;
    return products.filter(p => {
      const lowerP = p.category.toLowerCase();
      const isGarden = lowerP.includes('κήπου') || lowerP.includes('outdoor') || lowerP.includes('βεράντας') || lowerP.includes('garden');

      if (selectedCategory === 'Επιπλα Γραφείου') {
        return !isGarden && (lowerP.includes('γραφεί') || lowerP.includes('office') || lowerP.includes('εργασίας') || lowerP.includes('επαγγελματικό'));
      }
      if (selectedCategory === 'Διακόσμηση') return lowerP.includes('διακόσμηση') || lowerP.includes('decor') || lowerP.includes('πίνακες');
      if (selectedCategory === 'Φωτισμός') return lowerP.includes('φωτισ') || lowerP.includes('light');
      if (selectedCategory === 'Έπιπλα Εσωτερικού χώρου') {
        return isGarden || lowerP.includes('εσωτερικού') || lowerP.includes('σαλόνι') || lowerP.includes('υπνοδωμάτιο');
      }
      return p.category.includes(selectedCategory);
    });
  }, [selectedCategory, products]);

  const renderHome = () => (
    <div className="space-y-16 pb-24 text-left">
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] py-12">
        <div className="space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-indigo-600">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Efficiency in style</span>
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
            <button onClick={() => setCurrentPage(Page.Shop)} className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">EXPLORE SHOP</button>
            <button className="px-10 py-5 rounded-[24px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">VIEW TRENDS</button>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative group">
           <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
           <img 
             src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=1200" 
             className="w-full h-auto rounded-[60px] shadow-2xl relative z-10 transition-transform duration-1000 group-hover:scale-[1.02]" 
             alt="Office Setting"
           />
        </div>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="container mx-auto px-4 py-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div>
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest block mb-2">Showroom</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{selectedCategory}</h1>
          {SEO_TEXTS[selectedCategory] && <p className="text-slate-500 max-w-2xl mt-4 font-medium">{SEO_TEXTS[selectedCategory].body}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {dynamicCategoriesList.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} onClick={() => openProduct(product)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} onNavigate={setCurrentPage} currentPage={currentPage} onOpenCart={() => setCurrentPage(Page.Cart)} dynamicMegaMenu={dynamicMegaMenu} />
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>
      ) : (
        <main className="animate-fade-in">
          {currentPage === Page.Home && renderHome()}
          {currentPage === Page.Shop && renderShop()}
          {currentPage === Page.Admin && <AdminPanel onImportProducts={handleImportProducts} />}
          {currentPage === Page.Cart && <div className="p-20 text-center font-black uppercase text-2xl">Cart Page Content (Subtotal: €{subtotal})</div>}
          {currentPage === Page.Product && selectedProduct && <ProductDetail product={selectedProduct} onAddToCart={addToCart} relatedProducts={products.slice(0, 4)} onNavigateToProduct={openProduct} />}
        </main>
      )}
      <footer className="bg-slate-900 text-white py-24 mt-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
           <div className="space-y-6">
              <img src="https://i.postimg.cc/HnskmvDn/EpiplaGRAFEIOU.GR-removebg-preview.png" alt="Logo" className="h-16 w-auto object-contain" />
              <p className="text-slate-400 text-sm leading-relaxed">Premium furniture for modern business environments.</p>
           </div>
           <div><h4 onClick={() => setCurrentPage(Page.Admin)} className="font-bold uppercase tracking-widest text-xs mb-8 cursor-pointer hover:text-indigo-400">Admin Dashboard</h4></div>
           <div><h4 className="font-bold uppercase tracking-widest text-xs mb-8">Contact</h4><div className="text-slate-400 text-xs space-y-2"><p>22410 21087</p><p>Kanada 11, Rhodes</p></div></div>
        </div>
      </footer>
      <EmailPopup />
    </div>
  );
};

export default App;
