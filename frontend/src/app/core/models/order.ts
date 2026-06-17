import { Product } from './product';

export type OrderStatus = 'in_lavorazione' | 'spedito' | 'consegnato';
export type ShippingMethod = 'standard' | 'express';

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'in_lavorazione', label: 'In lavorazione' },
  { value: 'spedito', label: 'Spedito' },
  { value: 'consegnato', label: 'Consegnato' }
];

export const SHIPPING_METHODS: { value: ShippingMethod; label: string }[] = [
  { value: 'standard', label: 'Standard (3-5 giorni lavorativi)' },
  { value: 'express', label: 'Express (24 ore)' }
];

export function orderStatusLabel(status: string): string {
  for (const s of ORDER_STATUSES) {
    if (s.value === status) {
      return s.label;
    }
  }
  return status;
}

export function shippingLabel(method: string): string {
  for (const m of SHIPPING_METHODS) {
    if (m.value === method) {
      return m.label;
    }
  }
  return method;
}

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

export interface NewOrder {
  customer: Customer;
  address: Address;
  shippingMethod: ShippingMethod;
}

export interface OrderFilters {
  status?: string;
  from?: string;
  to?: string;
}

export interface OrderSummary {
  id: number;
  createdAt: string;
  status: OrderStatus;
  total: number;
  shippingMethod: ShippingMethod;
  itemsCount: number;
  userEmail: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: Product | null;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  customer: Customer;
  address: Address;
  shippingMethod: ShippingMethod;
  createdAt: string;
  items: OrderItem[];
}
