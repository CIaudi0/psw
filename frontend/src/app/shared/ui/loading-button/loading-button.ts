import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-button',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './loading-button.html',
  styles: `
    :host { display: block; }
    button { width: 100%; }
    mat-progress-spinner { display: inline-block; }
  `
})
export class LoadingButtonComponent {
  loading = input(false);
  disabled = input(false);
}
