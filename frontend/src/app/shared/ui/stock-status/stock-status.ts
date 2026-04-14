import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stock-status',
  templateUrl: './stock-status.html',
  styles: `
    .badge { padding: 3px 8px; border-radius: 2px; background: #c62828; color: #fff; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; }
    .out { font-weight: 700; color: #c62828; }
    .available { font-size: 0.9rem; color: #2e7d32; }
  `
})
export class StockStatusComponent {
  stock = input.required<number>();
  variant = input<'badge' | 'text'>('text');
}
