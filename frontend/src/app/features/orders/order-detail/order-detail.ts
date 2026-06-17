import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order';
import { Order, orderStatusLabel, shippingLabel } from '../../../core/models/order';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';

@Component({
  selector: 'app-order-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule, HttpStateCardComponent],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  statusLabel = orderStatusLabel;
  shippingLabel = shippingLabel;

  order = signal<Order | null>(null);
  state = signal<HttpState>({ status: 'loading' });

  constructor() {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.state.set({ status: 'loading' });

    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.state.set({ status: 'success' });
      },
      error: (err) => {
        const message = err.status === 404 ? 'Ordine non trovato.' : "Errore nel caricamento dell'ordine.";
        this.state.set({ status: 'error', message: message });
      }
    });
  }
}
