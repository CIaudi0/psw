import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product, ProductFilters, ProductsMeta } from '../../../core/models/product';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';
import { ProductCardComponent } from '../../../shared/ui/product-card/product-card';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination';

@Component({
  selector: 'app-product-list',
  imports: [
    FormsModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule,
    HttpStateCardComponent, ProductCardComponent, PaginationComponent
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListPageComponent {
  private service = inject(ProductService);
  private cart = inject(CartService);

  protected filters: ProductFilters = { title: '', sale: false };

  products = signal<Product[]>([]);
  meta = signal<ProductsMeta | null>(null);
  page = signal(1);
  state = signal<HttpState>({ status: 'loading' });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.state.set({ status: 'loading' });

    this.service.list(this.filters, this.page()).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.meta.set(response.meta);
        this.state.set({ status: response.products.length === 0 ? 'empty' : 'success' });
      },
      error: () => {
        this.state.set({ status: 'error', message: 'Impossibile caricare i prodotti.' });
      }
    });
  }

  applyFilters(): void {
    this.page.set(1);
    this.reload();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.reload();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAdd(product: Product): void {
    this.cart.add(product);
  }
}
