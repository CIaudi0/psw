import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductInput } from '../models/product';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  createProduct(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/vendor/products`, this.toFormData(product));
  }

  updateProduct(productId: number, product: ProductInput): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/vendor/products/${productId}`, this.toFormData(product));
  }

  removeProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vendor/products/${productId}`);
  }

  private toFormData(product: ProductInput): FormData {
    const data = new FormData();
    data.append('product[title]', product.title);
    data.append('product[description]', product.description);
    data.append('product[price]', String(product.price));
    data.append('product[original_price]', product.originalPrice > 0 ? String(product.originalPrice) : '');
    data.append('product[sale]', String(product.sale));
    data.append('product[stock]', String(product.stock));
    data.append('product[thumbnail]', product.thumbnail);

    if (product.image) {
      data.append('product[image]', product.image);
    }
    if (product.removeImage) {
      data.append('product[remove_image]', 'true');
    }
    return data;
  }
}
