import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';

@Injectable({ providedIn: 'root' })
export class ZapatillaService {
  private apiUrl = `${API_URL}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`);
  }

  getVotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/votos`);
  }

  votar(zapaId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${this.apiUrl}/vote`, { productId: zapaId }, { headers });
  }
}
