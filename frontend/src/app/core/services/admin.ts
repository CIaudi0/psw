import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  updateUserRole(userId: number, role: UserRole): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/admin/users/${userId}`, { role });
  }

  deleteUser(userId: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}`);
  }
}
