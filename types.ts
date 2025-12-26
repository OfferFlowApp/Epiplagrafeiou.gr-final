
export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  supplierPrice: number;
  category: string;
  image: string;
  stock: number;
  seoKeywords: string[];
  colors?: ColorVariant[];
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

export interface SupplierItem {
  id: string;
  name: string;
  basePrice: number;
  stock: number;
  category: string;
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
