import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-sugerencias',
  standalone: true,
  templateUrl: './admin-sugerencias.component.html',
  styleUrls: ['./admin-sugerencias.component.css'],
  imports: [NgFor, NgIf, NgClass, DatePipe]
})
export class AdminSugerenciasComponent implements OnInit {
  sugerencias: any[] = [];
  loading = false;

  async ngOnInit() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4001/api/sugerencias', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.sugerencias = await res.json();
    }
    this.loading = false;
  }

  async cambiarEstado(id: string, estado: 'realizada' | 'rechazada') {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4001/api/sugerencias/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ estado })
    });
    if (res.ok) {
      const actualizada = await res.json();
      this.sugerencias = this.sugerencias.map(s => s._id === id ? actualizada : s);
    }
  }
}
