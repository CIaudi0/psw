import { Routes } from '@angular/router';

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
    path: '**',
    loadComponent: () => import('./shared/not-found.page').then(m => m.NotFoundPage)
  }
];
