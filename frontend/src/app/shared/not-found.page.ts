import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="text-center">
      <h1 class="page-title">Pagina non trovata</h1>
      <a mat-flat-button routerLink="/products">Torna al catalogo</a>
    </section>
  `
})
export class NotFoundPage {}
