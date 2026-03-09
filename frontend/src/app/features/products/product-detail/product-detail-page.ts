import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    CurrencyPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule,
    HttpStateCardComponent
  ],
  templateUrl: './product-detail-page.html',
  styles: `
    img { max-height: 420px; object-fit: cover; }
  `
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(ProductService);

  product = signal<Product | null>(null);
  state = signal<HttpState>({ status: 'loading' });

  constructor() {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.state.set({ status: 'loading' });

    this.svc.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.state.set({ status: 'success' });
      },
      error: (err) => {
        const message = err.status === 404 ? 'Prodotto non trovato.' : 'Impossibile caricare il prodotto.';
        this.state.set({ status: 'error', message: message });
      }
    });
  }
}
