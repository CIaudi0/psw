import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, order);
  }
}
