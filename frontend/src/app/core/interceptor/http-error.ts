import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP error', error.status, error.message);
      if (error.status === 0 || error.status >= 500) {
        notify.show('Errore di rete, riprova più tardi.');
      }
      return throwError(() => error);
    })
  );
};
