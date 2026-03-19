import { Injectable, inject, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart';
import { NotificationService } from './notification';

const STORAGE_KEY = 'shop_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private notify = inject(NotificationService);

  items = signal<CartItem[]>(this.loadFromStorage());

  totalCount = computed(() => {
    let count = 0;
    for (const item of this.items()) {
      count += item.quantity;
    }
    return count;
  });

  totalPrice = computed(() => {
    let total = 0;
    for (const item of this.items()) {
      total += item.unitPrice * item.quantity;
    }
    return total;
  });

  add(product: Product): void {
    const existing = this.items().find((item) => item.productId === product.id);

    let items: CartItem[];
    if (existing) {
      items = this.items().map((item) => {
        if (item.productId === product.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      items = [...this.items(), { productId: product.id, quantity: 1, unitPrice: product.price, product: product }];
    }

    this.save(items);
    this.notify.show('Prodotto aggiunto al carrello!', 2000);
  }

  remove(item: CartItem): void {
    this.save(this.items().filter((i) => i.productId !== item.productId));
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.remove(item);
      return;
    }

    const items = this.items().map((i) => {
      if (i.productId === item.productId) {
        return { ...i, quantity: quantity };
      }
      return i;
    });
    this.save(items);
  }

  clear(): void {
    this.items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private save(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }
}
