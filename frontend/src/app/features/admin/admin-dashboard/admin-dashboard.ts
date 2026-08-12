import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification';
import { USER_ROLES, User, UserRole, fullName } from '../../../core/models/user';
import { apiErrors } from '../../../shared/http/api-error';
import { HttpState } from '../../../shared/http/http-state';
import { HttpStateCardComponent } from '../../../shared/http/http-state-card/http-state-card';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterLink, MatTableModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    HttpStateCardComponent
  ],
  templateUrl: './admin-dashboard.html',
  styles: `
    .role-select { width: 130px; margin: 0.5rem 0; }
  `,
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);

  roles = USER_ROLES;
  fullName = fullName;
  displayedColumns = ['name', 'email', 'role', 'actions'];

  users = signal<User[]>([]);
  state = signal<HttpState>({ status: 'loading' });
  searchTerm = signal('');
  roleFilter = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const role = this.roleFilter();

    return this.users().filter((user) => {
      const name = fullName(user).toLowerCase();
      const email = user.email.toLowerCase();
      const matchesTerm = term === '' || name.includes(term) || email.includes(term);
      const matchesRole = role === '' || user.role === role;
      return matchesTerm && matchesRole;
    });
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.state.set({ status: 'loading' });

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.state.set({ status: 'success' });
      },
      error: () => {
        this.state.set({ status: 'error', message: 'Errore nel caricamento degli utenti.' });
      }
    });
  }

  isSelf(user: User): boolean {
    const currentUser = this.auth.currentUser();
    return currentUser !== null && user.id === currentUser.user_id;
  }

  onRoleChange(user: User, role: UserRole): void {
    this.adminService.updateUserRole(user.id, role).subscribe({
      next: () => {
        const users = this.users().map((u) => {
          if (u.id === user.id) {
            return { ...u, role: role };
          }
          return u;
        });
        this.users.set(users);
        this.notify.show(`Ruolo di ${fullName(user) || user.email} aggiornato a ${role.toUpperCase()}`);
      },
      error: (err) => {
        this.notify.show(apiErrors(err, "Errore nell'aggiornamento del ruolo").join(' '));
        this.load();
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Vuoi eliminare l'utente ${user.email}?` }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.users.set(this.users().filter((u) => u.id !== user.id));
          this.notify.show(`Utente ${user.email} eliminato`);
        },
        error: (err) => this.notify.show(apiErrors(err, "Errore durante l'eliminazione").join(' '))
      });
    });
  }
}
