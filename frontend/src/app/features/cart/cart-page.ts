import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';
import { CartItem } from '../../core/models/cart';
import { CartLineComponent } from '../../shared/ui/cart-line/cart-line';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, CartLineComponent],
  templateUrl: './cart-page.html'
})
export class CartPageComponent {
  cartService = inject(CartService);

  changeQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item, quantity);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.remove(item);
  }
}
