import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/products';

  loginWithGoogle(): void {
    this.auth.loginWithGoogle(this.returnUrl);
  }
}
