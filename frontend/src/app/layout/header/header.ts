import { Component, inject, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  title = input('shop');

  private router = inject(Router);
  cartService = inject(CartService);
  auth = inject(AuthService);

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  toggleLogin(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
      this.cartService.loadCart();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
