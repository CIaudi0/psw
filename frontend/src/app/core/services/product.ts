import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilters, ProductsResponse } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  list(filters: ProductFilters, page = 1, perPage = 12): Observable<ProductsResponse> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('per_page', perPage);
    if (filters.title) {
      params = params.set('q', filters.title);
    }
    if (filters.sale) {
      params = params.set('sale', 'true');
    }
    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params });
  }

  getById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}
