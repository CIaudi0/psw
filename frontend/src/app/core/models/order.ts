import { CartItem } from './cart';

export type ShippingMethod = 'standard' | 'express';

export const SHIPPING_METHODS: { value: ShippingMethod; label: string }[] = [
  { value: 'standard', label: 'Standard (3-5 giorni lavorativi)' },
  { value: 'express', label: 'Express (24 ore)' }
];

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
}

export interface Order {
  id?: number;
  customer: Customer;
  address: Address;
  shippingMethod: ShippingMethod;
  items: CartItem[];
  total: number;
  createdAt: string;
}
