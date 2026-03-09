import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../core/models/product';
import { PriceComponent } from '../price/price';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, PriceComponent],
  templateUrl: './product-card.html',
  styles: `
    :host { display: block; }
    mat-card { position: relative; height: 100%; display: flex; flex-direction: column; }
    img { height: 180px; object-fit: cover; }
    mat-card-content { flex: 1; }
    .description { color: var(--mat-sys-on-surface-variant); font-size: 0.9rem; }
  `
})
export class ProductCardComponent {
  product = input.required<Product>();
  add = output<Product>();
}
