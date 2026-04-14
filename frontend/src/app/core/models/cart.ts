import { Product } from './product';

export interface CartItem {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  count: number;
}
