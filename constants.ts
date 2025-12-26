
import { Product, BlogPost } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'EX-CH-001',
    name: 'Εργονομική Καρέκλα ErgoPro X',
    description: 'Επαγγελματική καρέκλα γραφείου με ρυθμιζόμενη υποστήριξη μέσης, 4D μπράτσα και αναπνεόμενο πλέγμα mesh υψηλής αντοχής.',
    price: 499.00,
    supplierPrice: 250.00,
    category: 'Καρέκλες Γραφείου',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    seoKeywords: ['εργονομική καρέκλα', 'έπιπλα γραφείου αθήνα', 'καρέκλες διευθυντικές'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Blue', hex: '#0000ff' }
    ]
  },
  {
    id: '2',
    sku: 'DT-MN-002',
    name: 'Γραφείο Scandi Oak Minimal',
    description: 'Μινιμαλιστικό γραφείο από μασίφ ξύλο δρυός με ενσωματωμένο σύστημα διαχείρισης καλωδίων και κρυφό συρτάρι.',
    price: 850.00,
    supplierPrice: 400.00,
    category: 'Γραφεία',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    seoKeywords: ['γραφείο δρυς', 'μοντέρνα γραφεία', 'έπιπλα σκανδιναβικού στυλ'],
    colors: [
      { name: 'Natural Oak', hex: '#d2b48c' },
      { name: 'Walnut', hex: '#5d4037' }
    ]
  },
  {
    id: '3',
    sku: 'SO-CO-483',
    name: 'Γωνιακός Καναπές Comfivo 483',
    description: 'Πολυτελής γωνιακός καναπές με επένδυση υψηλής ποιότητας, ιδανικός για χώρους αναμονής ή το σπίτι.',
    price: 1289.00,
    supplierPrice: 800.00,
    category: 'Έπιπλα Εσωτερικού Χώρου',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    seoKeywords: ['γωνιακός καναπές', 'καναπέδες προσφορές', 'έπιπλα σαλονιού'],
    colors: [
      { name: 'Beige', hex: '#f5f5dc' },
      { name: 'Green', hex: '#2e7d32' },
      { name: 'Brown', hex: '#6d4c41' },
      { name: 'Grey', hex: '#9e9e9e' }
    ]
  }
];

export const CATEGORIES = ['Όλα', 'Γραφεία', 'Καρέκλες Γραφείου', 'Έπιπλα Εσωτερικού Χώρου', 'Διακόσμηση', 'Φωτισμός'];

export const MEGA_MENU_ITEMS = [
  {
    title: 'Έπιπλα Γραφείου',
    subCategories: [
      { name: 'Γραφεία Διευθυντικά', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=200' },
      { name: 'Καρέκλες Εργονομικές', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=200' },
      { name: 'Αρχειοθέτηση', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=200' },
      { name: 'Βιβλιοθήκες', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=200' },
      { name: 'Τραπέζια Συνεδριάσεων', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=200' }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Επαγγελματικός Εξοπλισμός'
  },
  {
    title: 'Έπιπλα Εσωτερικού Χώρου',
    subCategories: [
      { name: 'Καναπέδες', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200' },
      { name: 'Πολυθρόνες', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Τραπέζια Τραπεζαρίας', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200' }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Οικιακός Εξοπλισμός'
  },
  { title: 'Διακόσμηση', subCategories: [] },
  { title: 'Φωτισμός', subCategories: [] },
  { title: 'Blog', subCategories: [] }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Πώς να επιλέξετε την κατάλληλη εργονομική καρέκλα για το 2024',
    slug: 'pos-na-epilexete-ergonomiki-karekla-2024',
    excerpt: 'Η σωστή καρέκλα γραφείου μπορεί να αλλάξει ριζικά την παραγωγικότητά σας. Δείτε τι πρέπει να προσέξετε.',
    content: 'Η εργονομία στο χώρο εργασίας δεν είναι πλέον πολυτέλεια, αλλά ανάγκη. Με την αύξηση της τηλεργασίας στην Ελλάδα...',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    date: '24/12/2023',
    author: 'Epipla Grafeiou Team',
    seoKeywords: ['εργονομία γραφείου', 'καλύτερες καρέκλες 2024', 'υγεία στην εργασία']
  },
  {
    id: 'b2',
    title: 'Trends 2024: Το μινιμαλιστικό γραφείο επιστρέφει',
    slug: 'trends-2024-minimal-office',
    excerpt: 'Καθαρές γραμμές, φυσικά υλικά και έξυπνη οργάνωση είναι τα κύρια χαρακτηριστικά του σύγχρονου γραφείου.',
    content: 'Ο μινιμαλισμός στην εσωτερική διακόσμηση γραφείων κερδίζει έδαφος. Η χρήση ξύλου δρυός και η κρυφή διαχείριση καλωδίων...',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    date: '15/12/2023',
    author: 'Design Expert',
    seoKeywords: ['διακόσμηση γραφείου', 'trends 2024', 'μινιμαλισμός']
  }
];
