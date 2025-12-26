
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, Product, CartItem, BlogPost } from './types';
import { MOCK_PRODUCTS, CATEGORIES, MEGA_MENU_ITEMS, SEO_TEXTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import EmailPopup from './components/EmailPopup';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Truck, Clock, X, Monitor, Sofa, Briefcase, Layout, Wrench, Building2, Calendar, User as UserIcon, ChevronRight, Phone, Mail, MapPin, CreditCard, Headphones } from 'lucide-react';
import { getShoppingAssistantResponse } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleImportProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    setCurrentPage(Page.Shop);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.Product);
    window.scrollTo(0, 0);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Όλα') return products;
    return products.filter(p => p.category.includes(selectedCategory) || selectedCategory === 'Όλα');
  }, [selectedCategory, products]);

  const seoInfo = SEO_TEXTS[selectedCategory] || SEO_TEXTS['Όλα'];

  const renderHome = () => (
    <div className="space-y-24 pb-24">
       {/* Hero and typical landing elements go here - Simplified for brevity */}
       <section className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-6 h-[60vh]">
          <div className="lg:w-2/3 h-full relative rounded-3xl overflow-hidden group shadow-2xl">
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white text-left">
               <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">Κομψότητα & Λειτουργικότητα</h1>
               <button onClick={() => setCurrentPage(Page.Shop)} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold w-fit flex items-center gap-2">Ανακαλύψτε τώρα <ArrowRight size={20}/></button>
            </div>
          </div>
          <div className="lg:w-1/3 h-full bg-slate-900 rounded-3xl p-12 text-white flex flex-col justify-center text-center">
             <h2 className="text-8xl font-black text-indigo-400">3</h2>
             <p className="text-2xl font-bold uppercase tracking-widest">Άτοκες Δόσεις</p>
          </div>
       </section>

       <section className="container mx-auto px-4">
         <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter text-center">Δημοφιλή Προϊόντα</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => openProduct(p)} />)}
         </div>
       </section>
    </div>
  );

  const renderShop = () => (
    <div className="container mx-auto px-4 py-16 space-y-16 min-h-screen text-left">
      <header className="space-y-6 max-w-4xl">
         <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">{seoInfo.h1}</h1>
         <h2 className="text-xl md:text-2xl font-bold text-slate-500 tracking-tight">{seoInfo.h2}</h2>
         <p className="text-slate-400 leading-relaxed font-medium">{seoInfo.body}</p>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                {cat}
              </button>
            ))}
         </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => openProduct(p)} />)}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main>
        {currentPage === Page.Home && renderHome()}
        {currentPage === Page.Shop && renderShop()}
        {currentPage === Page.Admin && <AdminPanel onImportProducts={handleImportProducts} />}
        {currentPage === Page.Product && selectedProduct && <ProductDetail product={selectedProduct} onAddToCart={addToCart} relatedProducts={products.filter(p => p.id !== selectedProduct.id).slice(0, 4)} onNavigateToProduct={openProduct} />}
      </main>

      {/* Footer per Screenshot */}
      <footer className="bg-slate-900 text-white mt-24">
        {/* Top Trust Icons */}
        <div className="border-b border-white/5 py-12">
           <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl">
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-500"><Truck /></div>
                 <div className="text-left"><p className="font-bold text-sm">Δωρεάν Μεταφορικά</p><p className="text-[10px] text-slate-400">Για παραγγελίες άνω των €150</p></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl">
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-500"><ShieldCheck /></div>
                 <div className="text-left"><p className="font-bold text-sm">Ασφαλείς Αγορές</p><p className="text-[10px] text-slate-400">Κρυπτογραφημένες πληρωμές</p></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl">
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-500"><CreditCard /></div>
                 <div className="text-left"><p className="font-bold text-sm">Πολλοί Τρόποι Πληρωμής</p><p className="text-[10px] text-slate-400">Κάρτα, Apple Pay, Stripe, Κατάθεση</p></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl">
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow-500"><Headphones /></div>
                 <div className="text-left"><p className="font-bold text-sm">Υποστήριξη 24/7</p><p className="text-[10px] text-slate-400">Είμαστε εδώ για εσάς</p></div>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-4 gap-16 text-left">
           <div className="space-y-6">
              <div className="flex flex-col leading-none uppercase font-black tracking-tighter">
                <span className="text-2xl">Epipla Grafeiou<span className="text-indigo-500">.gr</span></span>
                <span className="bg-indigo-600 text-[10px] px-1 rounded w-fit font-bold tracking-normal mt-1">PRO</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Ποιοτικά έπιπλα για κάθε χώρο. Σχεδιασμένα με αγάπη, κατασκευασμένα για να διαρκούν.</p>
           </div>
           
           <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Τελευταία Άρθρα</h4>
              <ul className="space-y-4 text-slate-400 text-xs">
                 <li className="hover:text-white cursor-pointer transition-colors">5 Συμβουλές για ένα Εργονομικό Γραφείο στο Σπίτι</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Οι Τάσεις του Σκανδιναβικού Design για το 2024</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Μικροέπιπλα: Η Λεπτομέρεια που Κάνει τη Διαφορά</li>
                 <li className="font-bold text-yellow-500 pt-2 cursor-pointer">Δείτε όλα τα άρθρα →</li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Εξυπηρέτηση</h4>
              <ul className="space-y-4 text-slate-400 text-xs">
                 <li className="hover:text-white cursor-pointer">Πολιτική Απορρήτου</li>
                 <li className="hover:text-white cursor-pointer">Πολιτική Επιστροφών</li>
                 <li className="hover:text-white cursor-pointer">Όροι Παροχής Υπηρεσιών</li>
                 <li className="hover:text-white cursor-pointer">Επικοινωνία</li>
                 <li onClick={() => setCurrentPage(Page.Admin)} className="font-bold text-indigo-400 cursor-pointer pt-4">Admin Page</li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8">Στοιχεία Επιχείρησης</h4>
              <div className="space-y-4 text-slate-400 text-xs">
                 <p className="font-bold text-white">Ανδρέας Γιωργαράς</p>
                 <p className="flex items-center gap-2"><MapPin size={14} className="text-yellow-500" /> Καναδά 11, 851 00 Ρόδος</p>
                 <p className="flex items-center gap-2"><Phone size={14} className="text-yellow-500" /> 22410 21087</p>
                 <p className="flex items-center gap-2"><Mail size={14} className="text-yellow-500" /> salesepiplagrafeiou@gmail.com</p>
                 <p className="pt-4 text-[10px] font-bold">ΑΦΜ: EL047290419</p>
              </div>
           </div>
        </div>

        <div className="bg-black/20 py-8">
           <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">© 2025 epiplagrafeiou.gr. Με επιφύλαξη παντός δικαιώματος.</p>
        </div>
      </footer>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onRemove={removeItem} onCheckout={() => {}} />
      <EmailPopup />
    </div>
  );
};

export default App;
