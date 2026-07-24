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
  vendorId: number | null;
  imageAttached: boolean;
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

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  sale: boolean;
  stock: number;
  thumbnail: string;
  image: File | null;
  removeImage: boolean;
}

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
