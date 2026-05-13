import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-success',
  imports: [MatProgressSpinnerModule],
  templateUrl: './login-success.html'
})
export class LoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const returnUrl = this.auth.consumeReturnUrl();

    if (!token) {
      this.router.navigate(['/products']);
      return;
    }

    this.auth.saveToken(token);
    this.auth.me().subscribe({
      next: () => {
        this.cartService.syncLocalCartToServer();
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.auth.logout();
        this.router.navigate(['/products']);
      }
    });
  }
}
