export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  sale: boolean;
  thumbnail?: string;
  createdAt: string;
  stock: number;
}

export interface ProductFilters {
  title: string;
  sale: boolean;
}

export interface ProductsMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  meta: ProductsMeta;
}
