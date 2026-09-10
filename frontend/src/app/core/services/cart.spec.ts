import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CartService } from './cart';
import { NotificationService } from './notification';
import { Product } from '../models/product';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: { show: () => {} } }
      ]
    });
    service = TestBed.inject(CartService);
  });

  it('dovrebbe calcolare il totale', () => {
    service.add({ id: 1, price: 10, stock: 5 } as Product);
    expect(service.totalPrice()).toBe(10);
  });
});
