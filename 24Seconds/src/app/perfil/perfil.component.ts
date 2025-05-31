import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';

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
      const res = await fetch('http://localhost:4001/api/auth/profile', {
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
}
