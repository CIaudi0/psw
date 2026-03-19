import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product, ProductFilters } from '../../../core/models/product';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [
    FormsModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule,
    HttpStateCardComponent, ProductCardComponent
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListPageComponent {
  private service = inject(ProductService);
  private cart = inject(CartService);

  protected filters: ProductFilters = { title: '', sale: false };

  private allProducts: Product[] = [];
  products = signal<Product[]>([]);
  state = signal<HttpState>({ status: 'loading' });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.state.set({ status: 'loading' });

    this.service.list().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
      },
      error: () => {
        this.state.set({ status: 'error', message: 'Impossibile caricare i prodotti.' });
      }
    });
  }

  applyFilters(): void {
    const title = this.filters.title.trim().toLowerCase();
    const filtered = this.allProducts.filter((product) => {
      const matchesTitle = !title || product.title.toLowerCase().includes(title);
      const matchesSale = !this.filters.sale || product.sale;
      return matchesTitle && matchesSale;
    });
    this.products.set(filtered);
    this.state.set({ status: filtered.length === 0 ? 'empty' : 'success' });
  }

  onAdd(product: Product): void {
    this.cart.add(product);
  }
}
