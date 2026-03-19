import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-stepper',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './quantity-stepper.html',
  styles: `
    :host { display: inline-flex; align-items: center; gap: 0.4rem; }
    .value { min-width: 1.75rem; text-align: center; font-weight: 500; }
  `
})
export class QuantityStepperComponent {
  quantity = input.required<number>();
  max = input<number>(Infinity);
  quantityChange = output<number>();
}
