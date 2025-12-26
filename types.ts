
export interface ColorVariant {
  name: string;
  hex?: string;
  image: string;
  productId: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  model: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  supplierPrice: number;
  category: string;
  image: string;
  gallery: string[];
  stock: number;
  seoKeywords: string[];
  colors?: ColorVariant[];
  attributes?: ProductAttribute[];
  rewardPoints: number;
  availability: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  seoKeywords: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface MarkupTier {
  threshold: number;
  percentage: number;
}

export enum Page {
  Home = 'home',
  Shop = 'shop',
  Product = 'product',
  Admin = 'admin',
  Cart = 'cart',
  Blog = 'blog',
  BlogPost = 'blog-post'
}
