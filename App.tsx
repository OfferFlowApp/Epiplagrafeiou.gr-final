
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, Product, CartItem, BlogPost } from './types';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_BLOG_POSTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import EmailPopup from './components/EmailPopup';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Truck, Clock, X, Monitor, Sofa, Briefcase, Layout, Wrench, Building2, Calendar, User as UserIcon, ChevronRight } from 'lucide-react';
import { getShoppingAssistantResponse } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cart Logic
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
    setProducts(prev => [...newProducts, ...prev]);
    setCurrentPage(Page.Shop);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.Product);
    window.scrollTo(0, 0);
  };

  const openBlog = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentPage(Page.BlogPost);
    window.scrollTo(0, 0);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Όλα') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsLoading(true);
    const response = await getShoppingAssistantResponse(userMsg, products);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  useEffect(() => {
    const pageTitles = {
      [Page.Home]: 'EpiplaGrafeiou.gr | Κορυφαία Έπιπλα Γραφείου στην Ελλάδα',
      [Page.Shop]: `${selectedCategory} | Κατάλογος Επίπλων EpplaGrafeiou.gr`,
      [Page.Admin]: 'Διαχείριση Αποθέματος | Admin',
      [Page.Cart]: 'Το Καλάθι μου | EpplaGrafeiou.gr',
      [Page.Product]: selectedProduct ? `${selectedProduct.name} | EpplaGrafeiou.gr` : 'Προϊόν',
      [Page.Blog]: 'Blog Διακόσμησης & Εργονομίας | EpplaGrafeiou.gr',
      [Page.BlogPost]: selectedPost ? `${selectedPost.title} | Blog EpplaGrafeiou.gr` : 'Άρθρο'
    };
    document.title = pageTitles[currentPage] || 'EpiplaGrafeiou.gr';
  }, [currentPage, selectedProduct, selectedCategory, selectedPost]);

  const renderHome = () => (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-6 h-[75vh]">
        <div className="lg:w-2/3 h-full relative rounded-[48px] overflow-hidden group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Showroom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end p-16 text-white text-left">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter uppercase">
              Κομψότητα & <br/> Λειτουργικότητα
            </h1>
            <p className="text-xl text-slate-200 mb-10 max-w-lg font-medium leading-relaxed">
              Ανακαλύψτε τώρα τα έπιπλα που θα μεταμορφώσουν την παραγωγικότητά σας.
            </p>
            <button 
              onClick={() => setCurrentPage(Page.Shop)}
              className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-12 py-5 rounded-[24px] font-black w-fit transition-all uppercase tracking-widest flex items-center gap-4 group/btn shadow-xl shadow-indigo-500/20"
            >
              Ανακαλύψτε τώρα <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:w-1/3 h-full relative rounded-[48px] overflow-hidden bg-slate-900 flex items-center justify-center p-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-indigo-600 opacity-20 blur-[100px] -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-9xl font-black mb-2 leading-none tracking-tighter text-indigo-400">3</h2>
            <p className="text-4xl font-black uppercase tracking-widest mb-4">Άτοκες</p>
            <p className="text-7xl font-black uppercase mb-10 tracking-tighter">Δόσεις</p>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/20">
              Για όλες τις παραγγελίες
            </div>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Διάλεξε Κατηγορία</h2>
          <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {[
            { name: 'Γραφεία', icon: <Monitor size={40} />, category: 'Γραφεία' },
            { name: 'Σαλόνι', icon: <Sofa size={40} />, category: 'Έπιπλα Εσωτερικού Χώρου' },
            { name: 'Καρέκλες', icon: <Briefcase size={40} />, category: 'Καρέκλες Γραφείου' },
            { name: 'Αποθήκευση', icon: <Layout size={40} />, category: 'Γραφεία' },
            { name: 'Εξοπλισμός', icon: <Wrench size={40} />, category: 'Όλα' },
            { name: 'Εταιρικά', icon: <Building2 size={40} />, category: 'Όλα' },
          ].map((cat) => (
            <div 
              key={cat.name} 
              className="flex flex-col items-center gap-6 cursor-pointer group"
              onClick={() => {
                setSelectedCategory(cat.category);
                setCurrentPage(Page.Shop);
              }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl border border-slate-100 group-hover:border-indigo-400 scale-90 group-hover:scale-100">
                {cat.icon}
              </div>
              <span className="text-xs font-black text-slate-700 group-hover:text-indigo-600 transition-colors uppercase tracking-widest leading-none">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Κορυφαία σε Πωλήσεις</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Τα πιο αγαπημένα κομμάτια των πελατών μας</p>
          </div>
          <button 
            onClick={() => setCurrentPage(Page.Shop)}
            className="hidden md:flex items-center gap-2 text-indigo-600 font-black hover:gap-4 transition-all uppercase tracking-widest text-[11px] bg-indigo-50 px-6 py-3 rounded-2xl"
          >
            Δείτε Όλα <ArrowRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => openProduct(p)} />
          ))}
        </div>
      </section>

      {/* Blog Teaser for SEO */}
      <section className="container mx-auto px-4 py-24 bg-slate-100 rounded-[64px]">
        <div className="flex flex-col items-center mb-16 gap-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Νέα από το Blog μας</h2>
          <p className="text-slate-500 max-w-md text-center text-sm font-medium">Συμβουλές διακόσμησης, εργονομίας και τάσεις για το σύγχρονο γραφείο.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {MOCK_BLOG_POSTS.map(post => (
            <div 
              key={post.id} 
              className="bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-xl group cursor-pointer hover:shadow-2xl transition-all duration-500"
              onClick={() => openBlog(post)}
            >
              <div className="md:w-2/5 relative overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={post.title} />
              </div>
              <div className="md:w-3/5 p-10 flex flex-col justify-center text-left">
                <div className="flex items-center gap-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><UserIcon size={12} /> {post.author}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{post.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 group-hover:translate-x-2 transition-all duration-300 uppercase tracking-widest">
                  Διαβάστε Περισσότερα <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="container mx-auto px-4 py-16 space-y-16 min-h-screen text-left">
      {/* SEO Optimized Header for Shop */}
      <header className="bg-slate-900 text-white p-16 rounded-[48px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
             <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Premium Κατάλογος</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {selectedCategory === 'Όλα' ? 'Έπιπλα Γραφείου Αθήνα' : selectedCategory}
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-slate-400 max-w-2xl leading-relaxed">
            Βρείτε τη μεγαλύτερη ποικιλία σε εργονομικές καρέκλες, γραφεία διευθυντικά και επαγγελματικό εξοπλισμό με άμεση παράδοση σε όλη την Ελλάδα.
          </h2>
          <div className="flex flex-wrap gap-4 pt-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid with Trust Signal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredProducts.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => openProduct(p)} />
        ))}
      </div>
      
      {/* SEO Rich Text for Category Ranking */}
      <section className="bg-white p-12 rounded-[40px] border border-slate-100 text-slate-600 text-sm leading-relaxed space-y-8 shadow-sm">
         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Γιατί να επιλέξετε EpplaGrafeiou.gr για το γραφείο σας;</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Ποιότητα & Εργονομία</h3>
               <p>Στο EpplaGrafeiou.gr δίνουμε προτεραιότητα στην υγεία σας. Κάθε εργονομική καρέκλα γραφείου που διαθέτουμε έχει σχεδιαστεί για να παρέχει μέγιστη υποστήριξη στη σπονδυλική στήλη.</p>
            </div>
            <div className="space-y-4">
               <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Άμεση Παράδοση στην Αθήνα και Θεσσαλονίκη</h3>
               <p>Διαθέτουμε ιδιόκτητο στόλο για ταχεία παράδοση των επίπλων σας. Είτε ψάχνετε για γραφείο στο σπίτι είτε πλήρη εξοπλισμό εταιρείας, είμαστε δίπλα σας.</p>
            </div>
         </div>
      </section>
    </div>
  );

  const renderBlog = () => (
    <div className="container mx-auto px-4 py-16 space-y-16 min-h-screen text-left">
      <header className="bg-indigo-600 text-white p-20 rounded-[48px] text-center space-y-6">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Το Blog μας</h1>
         <p className="text-xl font-medium text-indigo-100 max-w-2xl mx-auto">Οδηγοί αγοράς, συμβουλές εργονομίας και οι τελευταίες τάσεις στο design.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {MOCK_BLOG_POSTS.map(post => (
           <div 
             key={post.id} 
             className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col"
             onClick={() => openBlog(post)}
           >
              <div className="aspect-video relative overflow-hidden">
                 <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-10 flex-grow flex flex-col">
                 <div className="flex items-center gap-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{post.title}</h3>
                 <p className="text-sm text-slate-500 line-clamp-3 mb-8 font-medium">{post.excerpt}</p>
                 <div className="mt-auto flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest group-hover:translate-x-2 transition-all">
                    Περισσότερα <ArrowRight size={14} />
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderBlogPost = () => selectedPost && (
    <div className="container mx-auto px-4 py-16 min-h-screen text-left max-w-4xl">
       <button 
        onClick={() => setCurrentPage(Page.Blog)}
        className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-12 hover:gap-4 transition-all"
       >
         <ArrowRight size={16} className="rotate-180" /> Επιστροφή στο Blog
       </button>
       <article className="space-y-12">
          <header className="space-y-6">
             <div className="flex items-center gap-4 text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>By {selectedPost.author}</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">{selectedPost.title}</h1>
          </header>
          <div className="aspect-video rounded-[48px] overflow-hidden shadow-2xl">
             <img src={selectedPost.image} className="w-full h-full object-cover" />
          </div>
          <div className="prose prose-xl max-w-none text-slate-700 leading-relaxed font-medium space-y-8">
             <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase border-l-4 border-indigo-600 pl-8">{selectedPost.excerpt}</p>
             <div className="text-lg whitespace-pre-wrap">{selectedPost.content}</div>
             <div className="bg-slate-100 p-10 rounded-[32px] border border-slate-200">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">SEO Keywords Άρθρου</h4>
                <div className="flex flex-wrap gap-3">
                   {selectedPost.seoKeywords.map(kw => (
                     <span key={kw} className="bg-white px-4 py-2 rounded-xl text-xs font-black text-indigo-600 uppercase tracking-widest border border-slate-200">#{kw}</span>
                   ))}
                </div>
             </div>
          </div>
       </article>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="animate-fade-in">
        {currentPage === Page.Home && renderHome()}
        {currentPage === Page.Shop && renderShop()}
        {currentPage === Page.Admin && <AdminPanel onImportProducts={handleImportProducts} />}
        {currentPage === Page.Blog && renderBlog()}
        {currentPage === Page.BlogPost && renderBlogPost()}
        {currentPage === Page.Product && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4)}
            onNavigateToProduct={openProduct}
          />
        )}
        {currentPage === Page.Cart && (
           <div className="container mx-auto px-4 py-24 text-center">
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">Το Καλάθι μου</h2>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl"
              >
                Άνοιγμα Πλευρικού Καλαθιού
              </button>
           </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-24 mt-24 rounded-t-[80px]">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20 text-left">
          <div className="space-y-8">
             <div className="flex flex-col leading-none uppercase font-black text-white tracking-tighter">
                <span className="text-3xl">Epipla</span>
                <span className="text-3xl flex items-center gap-1">
                  Grafeiou<span className="text-indigo-500 text-sm">.gr</span>
                </span>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Ο απόλυτος προορισμός για επαγγελματικό εξοπλισμό στην Ελλάδα. Σχεδιάζουμε χώρους που εμπνέουν και καρέκλες που προστατεύουν την υγεία σας.
             </p>
             <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                   <ShieldCheck />
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                   <Truck />
                </div>
             </div>
          </div>
          <div>
            <h4 className="font-black mb-10 uppercase text-xs tracking-[0.3em] text-white/30">Κατηγορίες</h4>
            <ul className="space-y-5 text-slate-300 text-xs font-black uppercase tracking-widest">
              <li><button onClick={() => {setSelectedCategory('Γραφεία'); setCurrentPage(Page.Shop)}} className="hover:text-indigo-400 transition-colors">Γραφεία Διευθυντικά</button></li>
              <li><button onClick={() => {setSelectedCategory('Καρέκλες Γραφείου'); setCurrentPage(Page.Shop)}} className="hover:text-indigo-400 transition-colors">Καρέκλες Εργονομικές</button></li>
              <li><button onClick={() => {setSelectedCategory('Φωτισμός'); setCurrentPage(Page.Shop)}} className="hover:text-indigo-400 transition-colors">Φωτισμός</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 uppercase text-xs tracking-[0.3em] text-white/30">Εξυπηρέτηση</h4>
            <ul className="space-y-5 text-slate-300 text-xs font-black uppercase tracking-widest">
              <li><button className="hover:text-indigo-400 transition-colors">Σχετικά με εμάς</button></li>
              <li><button onClick={() => setCurrentPage(Page.Blog)} className="hover:text-indigo-400 transition-colors">Blog & Tips</button></li>
              <li><button className="hover:text-indigo-400 transition-colors">Επικοινωνία</button></li>
              <li><button className="hover:text-indigo-400 transition-colors">Τρόποι Πληρωμής</button></li>
            </ul>
          </div>
          <div className="bg-white/5 p-10 rounded-[48px] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px]"></div>
            <h4 className="font-black mb-4 uppercase text-xs tracking-widest text-indigo-400 relative z-10">Newsletter</h4>
            <p className="text-[10px] text-slate-400 mb-8 uppercase font-black relative z-10 leading-relaxed">Κερδίστε 20% έκπτωση στην πρώτη αγορά και SEO tips για το γραφείο σας.</p>
            <div className="flex gap-2 relative z-10">
              <input type="email" placeholder="Email" className="bg-white/10 border-none rounded-2xl px-6 py-4 text-xs w-full outline-none focus:ring-1 focus:ring-indigo-500" />
              <button className="bg-indigo-600 p-4 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-500/20"><ArrowRight size={20} /></button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-8 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">© 2024 EpiplaGrafeiou.gr | All Rights Reserved</p>
           <div className="flex items-center gap-8 opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 grayscale" alt="Stripe" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 grayscale" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 grayscale" alt="Mastercard" />
           </div>
        </div>
      </footer>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={() => alert('Proceeding to Checkout...')}
      />

      <EmailPopup />
      
      {/* Assistant */}
      <div className="fixed bottom-8 right-8 z-[150]">
         {isChatOpen && (
           <div className="absolute bottom-24 right-0 w-[400px] bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[600px] animate-scale-up">
              <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black uppercase tracking-tighter">AI Σύμβουλος</h4>
                    <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest">Showroom Expert</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left">
                 <div className="bg-slate-100 p-5 rounded-[32px] rounded-tl-none text-sm text-slate-800 font-medium">
                   Γεια σας! Είμαι εδώ για να σας βοηθήσω να βρείτε τα ιδανικά έπιπλα για το δικό σας γραφείο. Τι αναζητάτε σήμερα;
                 </div>
                 {chatHistory.map((chat, i) => (
                   <div 
                    key={i} 
                    className={`p-5 rounded-[32px] text-sm font-medium ${
                      chat.role === 'user' 
                      ? 'bg-indigo-600 text-white ml-auto rounded-tr-none max-w-[85%]' 
                      : 'bg-slate-100 text-slate-800 mr-auto rounded-tl-none max-w-[85%]'
                    }`}
                   >
                     {chat.text}
                   </div>
                 ))}
                 {isLoading && (
                   <div className="flex gap-1.5 p-3">
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                 )}
              </div>
              <form onSubmit={handleChatSubmit} className="p-6 border-t border-slate-50 flex gap-3">
                 <input 
                  type="text" 
                  placeholder="Ρωτήστε με οτιδήποτε..." 
                  className="flex-grow bg-slate-100 rounded-[24px] px-6 text-sm outline-none focus:ring-2 focus:ring-indigo-600 border-none py-4"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                 />
                 <button type="submit" className="bg-indigo-600 text-white w-14 h-14 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <ArrowRight size={24} />
                 </button>
              </form>
           </div>
         )}
         <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className="w-20 h-20 bg-slate-900 text-white rounded-[30px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
         >
           <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <MessageSquare size={32} className="relative z-10 group-hover:rotate-12 transition-transform" />
         </button>
      </div>

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
