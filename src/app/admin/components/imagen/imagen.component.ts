import { Component, Input, OnInit } from '@angular/core';
import { ImagenService } from '../../services/imagen.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-imagen',
  imports: [CommonModule],
  templateUrl: './imagen.component.html',
  styleUrl: './imagen.component.css'
})
export class ImagenComponent implements OnInit{

  @Input() productoId!: number;
  images: any[] = [];
  loading = false;
  
  constructor(private imagenService: ImagenService) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.loading = true;
    this.imagenService.getProductImages(this.productoId)
      .subscribe({
        next: (response) => {
          this.images = response.imagenes;
          console.log('Images loaded:', this.images);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading images:', error);
          this.loading = false;
        }
      });
  }

  getImageUrl(url: string): string {
    if (url?.startsWith('http')) {
      return url;
    }
    return `${environment.API_URL}/${url}`;
  }

  handleImageError(event: any) {
    event.target.src = 'https://importaciones-sarmiento.com/error.svg';
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const formData = new FormData();
        formData.append('imagen', file);
        formData.append('producto_id', this.productoId.toString());
        formData.append('es_principal', (!this.images.length).toString());
        
        this.loading = true;
        this.imagenService.uploadProductImage(formData)
          .subscribe({
            next: () => {
              this.loadImages();
            },
            error: (error) => {
              console.error('Error uploading image:', error);
              this.loading = false;
            }
          });
      });
    }
  }

  deleteImage(imageId: number) {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      this.loading = true;
      this.imagenService.deleteProductImage(imageId)
        .subscribe({
          next: () => {
            this.loadImages();
          },
          error: (error) => {
            console.error('Error deleting image:', error);
            this.loading = false;
          }
        });
    }
  }

  updateOrder(images: any[]) {
    this.imagenService.updateImageOrder(images)
      .subscribe({
        next: () => {
          this.loadImages();
        },
        error: (error) => {
          console.error('Error updating order:', error);
        }
      });
  }

  setPrincipal(image: any) {
    this.loading = true;
    this.imagenService.setPrincipal(image.id).subscribe({
      next: () => {
        this.images = this.images.map(img => ({
          ...img,
          es_principal: img.id === image.id
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error setting principal image:', error);
        this.loading = false;
      }
    });
  }

}
