import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CheckoutPageComponent } from './checkout-page';
import { NotificationService } from '../../core/services/notification';

describe('CheckoutPageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: NotificationService, useValue: { show: () => {} } }
      ]
    });
  });

  it('il form è valido con dati corretti', () => {
    const cmp = TestBed.createComponent(CheckoutPageComponent).componentInstance;

    cmp.form.setValue({
      customer: { firstName: 'Mario', lastName: 'Rossi', email: 'mario@example.com' },
      address: { street: 'Via Roma 1', city: 'Ferrara', zip: '44121' },
      shippingMethod: 'standard',
      privacy: true
    });

    expect(cmp.form.valid).toBe(true);
  });
});
