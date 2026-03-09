import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpState } from '../http-state';

@Component({
  selector: 'app-http-state-card',
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './http-state-card.html',
  styles: `
    .http-state-loading { display: flex; justify-content: center; padding: 3rem; }
    .http-state-error { margin: 1rem 0; border-left: 4px solid #c62828; }
  `
})
export class HttpStateCardComponent {
  state = input<HttpState | null>(null);
  emptyMessage = input('Nessun elemento trovato.');
  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
