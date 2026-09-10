import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('dovrebbe fare una GET su /products e restituire i prodotti', () => {
    const mockProducts = [
      { id: 1, title: 'Prodotto 1', price: 10 } as any,
      { id: 2, title: 'Prodotto 2', price: 20 } as any
    ];

    service.list({ title: '', sale: false }).subscribe((response) => {
      expect(response.products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products?page=1&per_page=12`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts, meta: { total: 2, page: 1, perPage: 12, totalPages: 1 } });
  });
});
