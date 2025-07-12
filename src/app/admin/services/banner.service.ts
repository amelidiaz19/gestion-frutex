import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private apiUrl = `${environment.API_URL}/api/banners`;

  constructor(private http: HttpClient) {}

  getBannsers() {
    return this.http.get<any>(`${this.apiUrl}/list`).pipe(
      map(response => ({
        ...response,
        banners: response.banners.map((banner: any) => ({
          ...banner,
          path: `${environment.API_URL}${banner.path}`
        }))
      }))
    );
  }

  getBanners() {
    return this.http.get<any>(`${this.apiUrl}/list`).pipe(
      map(response => {
        const bannerArray = Object.entries(response.banners).map(([filename, data]: [string, any]) => ({
          filename: data.filename,
          image: `${environment.API_URL}${data.path}`,
          active: data.active,
          createdAt: data.createdAt,
          order: data.order
        }));
        return bannerArray.sort((a, b) => a.order - b.order);
      })
    );
  }

  uploadBanner(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  updateOrder(orderData: any[]) {
    return this.http.put<any>(`${this.apiUrl}/order`, orderData);
  }

  toggleBannerStatus(filename: string) {
    return this.http.put<any>(`${this.apiUrl}/toggle/${filename}`, {});
  }
}
