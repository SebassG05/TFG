import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { API_URL } from '../api-url';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [NgIf, NgFor, DatePipe]
})
export class PerfilComponent implements OnInit {
  user: any = null;
  loading = true;
  error: string | null = null;

  async ngOnInit() {
    this.loading = true;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudo cargar el perfil');
      this.user = await res.json();
    } catch (e: any) {
      this.error = e.message;
    }
    this.loading = false;
  }

  get lastPurchase() {
    if (!this.user?.purchaseHistory?.length) return null;
    // Ordenar por fecha descendente y tomar la más reciente
    return [...this.user.purchaseHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  get lastPurchases() {
    if (!this.user?.purchaseHistory?.length) return [];
    // Ordenar por fecha descendente y tomar las dos más recientes
    return [...this.user.purchaseHistory]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);
  }
}
