
import { Product, BlogPost } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'GP011-0014',
    model: '0086733',
    name: 'Διάτρητο πανί επαγγελματικό για πολυθρόνα σκηνοθέτη πορτοκαλί',
    description: 'Ενισχυμένη πλέξη PVC textilene 1x1 για επαγγελματική χρήση. Ιδανικό για τις περισσότερες καρέκλες σκηνοθέτη.',
    price: 6.90,
    originalPrice: 9.50,
    supplierPrice: 7.66,
    category: 'Έπιπλα Εσωτερικού χώρου > Καρέκλες',
    image: 'https://www.megapap.com/image/catalog/products/GP011-0014-0.jpg',
    gallery: [
      'https://www.megapap.com/image/catalog/products/GP011-0014-1.jpg',
      'https://www.megapap.com/image/catalog/products/GP011-0014-2.jpg'
    ],
    stock: 60,
    seoKeywords: ['πανί σκηνοθέτη', 'megapap', 'έπιπλα κήπου'],
    rewardPoints: 35,
    availability: 'Άμεση παραλαβή | Παράδοση σε 1 έως 3 ημέρες',
    colors: [
      { name: 'Πορτοκαλί', image: 'https://www.megapap.com/image/catalog/products/GP011-0014-0.jpg', productId: '1' },
      { name: 'Μπορντώ', image: 'https://www.megapap.com/image/catalog/products/GP011-0013-0.jpg', productId: '22' }
    ],
    attributes: [
      { name: 'Υλικό', value: 'PVC' },
      { name: 'Μήκος', value: '46 - 53 cm' }
    ]
  }
];

export const CATEGORIES = [
  'Όλα',
  'Επιπλα Γραφείου',
  'Διακόσμηση',
  'Φωτισμός',
  'Έπιπλα Εσωτερικού χώρου'
];

export const MEGA_MENU_ITEMS = [
  {
    title: 'Επιπλα Γραφείου',
    subCategories: [], // Will be populated dynamically in App.tsx
    featuredImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'PRO Γραφείο'
  },
  {
    title: 'Διακόσμηση',
    subCategories: [],
    featuredImage: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Home Decor'
  },
  {
    title: 'Φωτισμός',
    subCategories: [],
    featuredImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Bright Living'
  },
  {
    title: 'Έπιπλα Εσωτερικού χώρου',
    subCategories: [],
    featuredImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Modern Home'
  }
];

export const SEO_TEXTS: Record<string, { h1: string; h2: string; body: string }> = {
  'Όλα': {
    h1: 'Έπιπλα Γραφείου & Σπιτιού - EpplaGrafeiou.gr',
    h2: 'Κορυφαία Ποιότητα, Εργονομία και Στυλ για Κάθε Χώρο',
    body: 'Καλώς ήρθατε στο EpplaGrafeiou.gr, τον προορισμό σας για τα καλύτερα έπιπλα στην Ελλάδα.'
  }
};
