import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product';
import { VendorService } from '../../../core/services/vendor';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog';
import { StockStatusComponent } from '../../../shared/ui/stock-status/stock-status';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    CurrencyPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule,
    HttpStateCardComponent, StockStatusComponent
  ],
  templateUrl: './product-detail-page.html',
  styles: `
    img { max-height: 420px; object-fit: cover; }
  `
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private svc = inject(ProductService);
  private vendorService = inject(VendorService);
  private cartService = inject(CartService);
  private notify = inject(NotificationService);
  auth = inject(AuthService);

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

  addToCart(product: Product): void {
    this.cartService.add(product);
  }

  removeProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Vuoi eliminare "${product.title}"?` }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.vendorService.removeProduct(product.id).subscribe({
        next: () => {
          this.notify.show('Prodotto rimosso con successo!', 2000);
          this.router.navigate(['/products']);
        },
        error: () => this.notify.show("Errore durante l'eliminazione.", 2000)
      });
    });
  }
}
