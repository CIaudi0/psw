import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';
import { checkoutGuard } from './core/guard/checkout-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then(m => m.ProductListPageComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail-page').then(m => m.ProductDetailPageComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart-page').then(m => m.CartPageComponent)
  },
  {
    path: 'checkout',
    canActivate: [checkoutGuard],
    loadComponent: () => import('./features/checkout/checkout-page').then(m => m.CheckoutPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'login/success',
    loadComponent: () =>
      import('./features/auth/login-success/login-success').then(m => m.LoginSuccessComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/order-list/order-list').then(m => m.OrderListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/orders/order-detail/order-detail').then(m => m.OrderDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found.page').then(m => m.NotFoundPage)
  }
];
