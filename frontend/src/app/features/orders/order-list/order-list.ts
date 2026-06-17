import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderService } from '../../../core/services/order';
import { ORDER_STATUSES, OrderSummary, orderStatusLabel } from '../../../core/models/order';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';

@Component({
  selector: 'app-order-list',
  imports: [
    CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    HttpStateCardComponent
  ],
  templateUrl: './order-list.html',
  styles: `
    .filter-actions { display: flex; gap: 0.5rem; padding-top: 0.4rem; flex: 0 0 auto; min-width: 0; }
  `
})
export class OrderListComponent {
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);

  showAll = inject(ActivatedRoute).snapshot.data['all'] === true;

  statuses = ORDER_STATUSES;
  statusLabel = orderStatusLabel;

  filters = this.fb.nonNullable.group({
    status: [''],
    from: [''],
    to: ['']
  });

  orders = signal<OrderSummary[]>([]);
  state = signal<HttpState>({ status: 'loading' });
  emptyMessage = 'Non hai ancora effettuato nessun ordine.';

  constructor() {
    this.load();
  }

  load(): void {
    this.state.set({ status: 'loading' });
    this.emptyMessage = this.hasFilters ? 'Nessun ordine corrisponde ai filtri.' : 'Non hai ancora effettuato nessun ordine.';

    this.orderService.list(this.filters.getRawValue(), this.showAll).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.state.set({ status: orders.length === 0 ? 'empty' : 'success' });
      },
      error: () => {
        this.state.set({ status: 'error', message: 'Errore nel caricamento degli ordini.' });
      }
    });
  }

  resetFilters(): void {
    this.filters.reset();
    this.load();
  }

  get hasFilters(): boolean {
    const values = this.filters.getRawValue();
    return values.status !== '' || values.from !== '' || values.to !== '';
  }
}
