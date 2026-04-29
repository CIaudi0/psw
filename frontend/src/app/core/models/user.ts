export type UserRole = 'user' | 'vendor' | 'admin';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'admin', label: 'Admin' }
];

export interface TokenPayload {
  user_id: number;
  email: string;
  role: UserRole;
  exp: number;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

export function fullName(user: User): string {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName} ${lastName}`.trim();
}
