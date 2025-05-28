import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ZapatillaService {
  private apiUrl = 'http://localhost:4001/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`);
  }

  getVotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/votos`);
  }

  votar(zapaId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, { productId: zapaId });
  }
}
