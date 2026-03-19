import { Product } from './product';

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}
