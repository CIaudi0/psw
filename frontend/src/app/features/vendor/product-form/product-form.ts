import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../../core/services/product';
import { VendorService } from '../../../core/services/vendor';
import { NotificationService } from '../../../core/services/notification';
import { IMAGE_TYPES, MAX_IMAGE_SIZE, ProductInput } from '../../../core/models/product';
import { apiErrors } from '../../../shared/http/api-error';
import { ProductImageComponent } from '../../../shared/ui/product-image/product-image';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ProductImageComponent
  ],
  templateUrl: './product-form.html',
  styles: `
    .image-fieldset { display: flex; flex-direction: column; gap: 0.75rem; margin: 0 0 1rem; padding: 0; border: 0; }
    .image-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
    .image-buttons { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .preview { width: 7rem; height: 7rem; }
    .image-error { margin: 0; color: #c62828; }
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private productService = inject(ProductService);
  private vendorService = inject(VendorService);
  private notify = inject(NotificationService);

  productId = this.route.snapshot.paramMap.get('id');
  isEditMode = this.productId !== null;

  productForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    originalPrice: [0, Validators.min(0)],
    sale: [false],
    stock: [0, [Validators.required, Validators.min(0)]],
    thumbnail: [''],
    description: ['', Validators.required]
  });

  selectedFile = signal<File | null>(null);
  preview = signal<string | null>(null);
  hasSavedImage = signal(false);
  removeSavedImage = signal(false);
  imageMissing = signal(false);

  ngOnInit(): void {
    if (!this.productId) {
      return;
    }

    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        let thumbnail = product.thumbnail || '';

        if (product.imageAttached) {
          this.hasSavedImage.set(true);
          this.preview.set(product.thumbnail || null);
          thumbnail = '';
        }

        this.productForm.patchValue({
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          sale: product.sale,
          stock: product.stock,
          thumbnail: thumbnail,
          description: product.description || ''
        });
      },
      error: () => this.notify.show('Errore nel caricamento del prodotto', 2000)
    });
  }

  hasError(name: string, code: string): boolean {
    const control = this.productForm.get(name);
    return control !== null && control.touched && control.hasError(code);
  }

  hasUploadedImage(): boolean {
    if (this.selectedFile() !== null) {
      return true;
    }
    return this.hasSavedImage() && !this.removeSavedImage();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    input.value = '';

    if (!IMAGE_TYPES.includes(file.type)) {
      this.notify.show('Il file deve essere un\'immagine JPG, PNG, WebP o GIF');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      this.notify.show('L\'immagine non può superare 5 MB');
      return;
    }

    this.selectedFile.set(file);
    this.preview.set(URL.createObjectURL(file));
    this.removeSavedImage.set(false);
    this.imageMissing.set(false);
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.preview.set(null);
    if (this.hasSavedImage()) {
      this.removeSavedImage.set(true);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const values = this.productForm.getRawValue();
    if (!this.hasUploadedImage() && values.thumbnail.trim() === '') {
      this.imageMissing.set(true);
      return;
    }

    const product: ProductInput = {
      title: values.title,
      description: values.description,
      price: values.price,
      originalPrice: values.originalPrice,
      sale: values.sale,
      stock: values.stock,
      thumbnail: values.thumbnail,
      image: this.selectedFile(),
      removeImage: this.removeSavedImage()
    };

    if (this.productId) {
      this.vendorService.updateProduct(Number(this.productId), product).subscribe({
        next: () => {
          this.notify.show('Modifiche salvate con successo!', 4000);
          this.goBack();
        },
        error: (err) => this.notify.show(apiErrors(err, 'Errore durante il salvataggio.').join(' '))
      });
    } else {
      this.vendorService.createProduct(product).subscribe({
        next: () => {
          this.notify.show('Prodotto aggiunto con successo!', 4000);
          this.productForm.reset();
          this.selectedFile.set(null);
          this.preview.set(null);
        },
        error: (err) => this.notify.show(apiErrors(err, "Errore durante l'inserimento.").join(' '))
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
