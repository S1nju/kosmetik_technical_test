import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { AuthService } from './auth';

export interface RawMaterial {
  id: number;
  name: string;
  code: string;
  category: string;
  unit_of_measure: string;
  quantity: number;
  status: 'active' | 'inactive';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getMaterials(page = 1, limit = 10, filters: any = {}): Observable<PaginatedResponse<RawMaterial>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    
    if (filters.name) params = params.set('name', filters.name);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<PaginatedResponse<RawMaterial>>(API_ENDPOINTS.rawMaterials.base, {
      headers: this.headers,
      params
    });
  }

  getMaterial(id: number): Observable<RawMaterial> {
    return this.http.get<RawMaterial>(API_ENDPOINTS.rawMaterials.byId(id), { headers: this.headers });
  }

  createMaterial(material: Partial<RawMaterial>): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(API_ENDPOINTS.rawMaterials.base, material, { headers: this.headers });
  }

  updateMaterial(id: number, material: Partial<RawMaterial>): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(API_ENDPOINTS.rawMaterials.byId(id), material, { headers: this.headers });
  }

  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.rawMaterials.byId(id), { headers: this.headers });
  }
}
