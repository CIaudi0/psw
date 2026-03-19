import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Order, SHIPPING_METHODS, ShippingMethod } from '../../core/models/order';
import { apiErrors } from '../../shared/http/api-error';
import { AlertComponent } from '../../shared/ui/alert/alert';
import { LoadingButtonComponent } from '../../shared/ui/loading-button/loading-button';

const DEFAULT_ERROR = "Errore di comunicazione col server. L'ordine non è andato a buon fine.";

const FIELDS = [
  'customer.firstName',
  'customer.lastName',
  'customer.email',
  'address.street',
  'address.city',
  'address.zip',
  'shippingMethod',
  'privacy'
];

@Component({
  selector: 'app-checkout-page',
  imports: [
    CurrencyPipe, ReactiveFormsModule, RouterLink,
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule,
    AlertComponent, LoadingButtonComponent
  ],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss'
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  cartService = inject(CartService);

  shippingMethods = SHIPPING_METHODS;

  showSummary = signal(false);
  loading = signal(false);
  orderSuccess = signal<Order | null>(null);
  orderError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    customer: this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    }),
    address: this.fb.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]]
    }),
    shippingMethod: ['standard' as ShippingMethod, Validators.required],
    privacy: [false, Validators.requiredTrue]
  });

  getControl(path: string) {
    return this.form.get(path);
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.getControl(path);
    return !!control && control.hasError(errorCode) && control.touched;
  }

  errorCount(): number {
    let count = 0;
    for (const path of FIELDS) {
      const control = this.getControl(path);
      if (control && control.invalid) {
        count++;
      }
    }
    return count;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummary.set(true);
      this.focusFirstInvalid();
      return;
    }

    this.loading.set(true);
    this.orderSuccess.set(null);
    this.orderError.set(null);

    const value = this.form.getRawValue();

    this.orderService.create({
      customer: value.customer,
      address: value.address,
      shippingMethod: value.shippingMethod,
      items: this.cartService.items(),
      total: this.cartService.totalPrice(),
      createdAt: new Date().toISOString()
    }).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.orderSuccess.set(order);
        this.showSummary.set(false);
        this.cartService.clear();
        this.form.reset();
      },
      error: (err) => {
        this.loading.set(false);
        this.orderError.set(apiErrors(err, DEFAULT_ERROR).join(' '));
      }
    });
  }

  private focusFirstInvalid(): void {
    const firstInvalid = document.querySelector('form .ng-invalid[formControlName]') as HTMLElement | null;
    firstInvalid?.focus();
  }
}
