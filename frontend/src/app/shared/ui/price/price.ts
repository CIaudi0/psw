import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-price',
  imports: [CurrencyPipe],
  templateUrl: './price.html'
})
export class PriceComponent {
  product = input.required<Product>();

  originalPrice(): number | null {
    const product = this.product();
    if (product.sale && product.originalPrice && product.originalPrice > product.price) {
      return product.originalPrice;
    }
    return null;
  }
}
