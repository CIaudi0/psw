import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  styles: `
    :host { display: block; }
    .alert { margin-bottom: 1.5rem; padding: 1rem; border-left: 4px solid currentColor; border-radius: 2px; }
    .alert-error { background: #ffebee; color: #c62828; }
    .alert-success { background: #e8f5e9; color: #2e7d32; }
    .alert-warning { background: #fff3cd; color: #856404; }
  `
})
export class AlertComponent {
  type = input.required<'error' | 'success' | 'warning'>();
}
