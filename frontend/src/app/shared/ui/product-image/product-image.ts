import { Component, input } from '@angular/core';

const PLACEHOLDER = 'https://placehold.co/600x400/eeeeee/999999?text=Immagine+non+disponibile';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.html',
  styles: `
    :host { display: block; overflow: hidden; border-radius: 0.5rem; }
    img { display: block; width: 100%; height: 100%; object-fit: cover; }
  `
})
export class ProductImageComponent {
  src = input<string | null>();
  alt = input('');

  imageUrl(): string {
    return this.src() || PLACEHOLDER;
  }

  onError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = PLACEHOLDER;
  }
}
