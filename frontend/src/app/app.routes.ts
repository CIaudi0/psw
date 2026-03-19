import { Routes } from '@angular/router';
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
    path: '**',
    loadComponent: () => import('./shared/not-found.page').then(m => m.NotFoundPage)
  }
];
