import { HttpErrorResponse } from '@angular/common/http';

export function apiErrors(err: HttpErrorResponse, fallback: string): string[] {
  if (err.error && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
    return err.error.errors;
  }
  return [fallback];
}
