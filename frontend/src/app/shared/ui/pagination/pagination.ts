import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './pagination.html',
  styles: `
    :host { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; }
  `
})
export class PaginationComponent {
  page = input.required<number>();
  totalPages = input.required<number>();
  total = input<number>();
  pageChange = output<number>();
}
