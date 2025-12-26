
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
    category: 'Πανιά καρέκλας σκηνοθέτη',
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
  'Γραφεία',
  'Καρέκλες Γραφείου',
  'Έπιπλα Εσωτερικού Χώρου',
  'Έπιπλα Κήπου',
  'Παπουτσοθήκες',
  'Διακόσμηση',
  'Φωτισμός'
];

export const MEGA_MENU_ITEMS = [
  {
    title: 'Έπιπλα Γραφείου',
    subCategories: [
      { name: 'Γραφεία Εργασίας', image: 'https://www.megapap.com/image/catalog/products/GP009-0048-0.jpg' },
      { name: 'Καρέκλες Γραφείου', image: 'https://www.megapap.com/image/catalog/products/GP008-0001-0.jpg' },
      { name: 'Βιβλιοθήκες', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=200' },
      { name: 'Ντουλάπες Γραφείου', image: 'https://www.megapap.com/image/catalog/products/GP009-0048-0.jpg' }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'PRO Γραφείο'
  },
  {
    title: 'Έπιπλα Εσωτερικού Χώρου',
    subCategories: [
      { name: 'Καναπέδες', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200' },
      { name: 'Παπουτσοθήκες', image: 'https://www.megapap.com/image/catalog/products/GP009-0090-0.jpg' },
      { name: 'Έπιπλα Μπάνιου', image: 'https://www.megapap.com/image/catalog/products/GP009-0047-0.jpg' }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=600',
    featuredLabel: 'Home Design'
  },
  { title: 'Blog', subCategories: [] }
];

export const SEO_TEXTS: Record<string, { h1: string; h2: string; body: string }> = {
  'Όλα': {
    h1: 'Έπιπλα Γραφείου & Σπιτιού - EpplaGrafeiou.gr',
    h2: 'Κορυφαία Ποιότητα, Εργονομία και Στυλ για Κάθε Χώρο',
    body: 'Καλώς ήρθατε στο EpplaGrafeiou.gr, τον προορισμό σας για τα καλύτερα έπιπλα στην Ελλάδα. Εξειδικευόμαστε σε λύσεις που συνδυάζουν την άνεση με την αισθητική. Από εργονομικές καρέκλες γραφείου που προστατεύουν την υγεία σας, μέχρι πολυτελείς καναπέδες για το σαλόνι σας.'
  },
  'Γραφεία': {
    h1: 'Μοντέρνα Γραφεία Εργασίας & Διευθυντικά Γραφεία',
    h2: 'Οργανώστε το Χώρο σας για Μέγιστη Παραγωγικότητα',
    body: 'Ανακαλύψτε γραφεία από μελαμίνη, δρυ ή μέταλλο. Σχεδιασμένα για να καλύπτουν κάθε ανάγκη, από το home office μέχρι τον εταιρικό εξοπλισμό. Προσφέρουμε γραφεία με ενσωματωμένη αποθήκευση και minimal design.'
  }
};
