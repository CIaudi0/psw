import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewOrder, Order, OrderFilters, OrderSummary } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  create(order: NewOrder): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, order);
  }

  list(filters: OrderFilters = {}, all = false): Observable<OrderSummary[]> {
    let params = new HttpParams();
    if (all) {
      params = params.set('all', 'true');
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.from) {
      params = params.set('from', filters.from);
    }
    if (filters.to) {
      params = params.set('to', filters.to);
    }
    return this.http.get<OrderSummary[]>(`${this.baseUrl}/orders`, { params });
  }

  getById(id: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }
}
