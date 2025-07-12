import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private apiUrl = environment.API_URL + '/api/imagen';

  constructor(private http: HttpClient) {}

  getProductImages(productId: number): Observable<any> {
    console.log('Fetching images for product ID:', productId);
    return this.http.get(`${this.apiUrl}/producto/${productId}`);
  }

  uploadProductImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  updateImageOrder(images: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/order`, { imagenes: images });
  }

  deleteProductImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${imageId}`);
  }

  setPrincipal(imageId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/producto/principal/${imageId}`, {});
  }
}
