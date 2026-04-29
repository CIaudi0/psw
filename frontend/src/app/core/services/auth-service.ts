import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenPayload, User } from '../models/user';

const TOKEN_KEY = 'shop_token';
const RETURN_URL_KEY = 'login_return_url';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  isLoggedIn = computed(() => this.token() !== null);

  currentUser = computed<TokenPayload | null>(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  });

  userRole = computed(() => {
    const user = this.currentUser();
    return user ? user.role : 'user';
  });

  isAdmin = computed(() => this.userRole() === 'admin');
  isVendor = computed(() => this.userRole() === 'vendor' || this.userRole() === 'admin');

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`);
  }

  loginWithGoogle(returnUrl = '/products'): void {
    sessionStorage.setItem(RETURN_URL_KEY, returnUrl);
    window.location.href = `${this.baseUrl}/auth/google_oauth2`;
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }

  consumeReturnUrl(): string {
    const url = sessionStorage.getItem(RETURN_URL_KEY) || '/products';
    sessionStorage.removeItem(RETURN_URL_KEY);
    return url;
  }
}
