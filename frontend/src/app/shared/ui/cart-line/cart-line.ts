import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../../../core/models/cart';
import { QuantityStepperComponent } from '../quantity-stepper/quantity-stepper';

@Component({
  selector: 'app-cart-line',
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, QuantityStepperComponent],
  templateUrl: './cart-line.html',
  host: { class: 'item-row' }
})
export class CartLineComponent {
  item = input.required<CartItem>();
  quantityChange = output<number>();
  remove = output<void>();
}
