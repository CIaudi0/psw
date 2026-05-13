import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product';
import { Cart, CartItem } from '../models/cart';
import { AuthService } from './auth-service';
import { NotificationService } from './notification';
import { apiErrors } from '../../shared/http/api-error';

const STORAGE_KEY = 'shop_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private readonly baseUrl = environment.apiUrl;

  items = signal<CartItem[]>([]);

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

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.items.set(this.loadFromStorage());
      return;
    }

    this.http.get<Cart>(`${this.baseUrl}/cart`).subscribe({
      next: (cart) => this.items.set(cart.items),
      error: () => this.notify.show('Errore di connessione al carrello. Riprova più tardi.')
    });
  }

  add(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.addLocal(product);
      return;
    }

    this.http.post<Cart>(`${this.baseUrl}/cart/items`, { productId: product.id, quantity: 1 }).subscribe({
      next: (cart) => {
        this.items.set(cart.items);
        this.notify.show('Prodotto aggiunto al carrello!', 2000);
      },
      error: (err) => {
        this.notify.show(apiErrors(err, 'Impossibile aggiungere al carrello').join(' '), 2500);
        this.loadCart();
      }
    });
  }

  remove(item: CartItem): void {
    if (!this.auth.isLoggedIn()) {
      this.saveLocal(this.items().filter((i) => i.productId !== item.productId));
      return;
    }

    this.http.delete(`${this.baseUrl}/cart/items/${item.id}`).subscribe({
      next: () => this.loadCart(),
      error: () => this.loadCart()
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.remove(item);
      return;
    }

    if (!this.auth.isLoggedIn()) {
      const items = this.items().map((i) => {
        if (i.productId === item.productId) {
          return { ...i, quantity: Math.min(quantity, i.product.stock) };
        }
        return i;
      });
      this.saveLocal(items);
      return;
    }

    this.http.patch<Cart>(`${this.baseUrl}/cart/items/${item.id}`, { quantity }).subscribe({
      next: (cart) => this.items.set(cart.items),
      error: (err) => {
        this.notify.show(apiErrors(err, 'Impossibile aggiornare la quantità').join(' '), 2500);
        this.loadCart();
      }
    });
  }

  clear(): void {
    this.items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  syncLocalCartToServer(): void {
    const localItems = this.loadFromStorage();

    if (localItems.length === 0 || !this.auth.isLoggedIn()) {
      this.loadCart();
      return;
    }

    const payload = localItems.map((item) => {
      return { productId: item.productId, quantity: item.quantity };
    });

    this.http.post<Cart>(`${this.baseUrl}/cart/sync`, { items: payload }).subscribe({
      next: (cart) => {
        localStorage.removeItem(STORAGE_KEY);
        this.items.set(cart.items);
      },
      error: () => this.notify.show('Errore durante la sincronizzazione del carrello.')
    });
  }

  private addLocal(product: Product): void {
    const existing = this.items().find((item) => item.productId === product.id);
    const currentQuantity = existing ? existing.quantity : 0;

    if (currentQuantity >= product.stock) {
      this.notify.show(`Stock esaurito (disponibili: ${product.stock})`, 2000);
      return;
    }

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

    this.saveLocal(items);
    this.notify.show('Prodotto aggiunto al carrello!', 2000);
  }

  private saveLocal(items: CartItem[]): void {
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
