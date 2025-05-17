import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-sorteos',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './admin-sorteos.component.html',
  styleUrls: ['./admin-sorteos.component.css']
})
export class AdminSorteosComponent implements OnInit {
  sorteos: any[] = [];
  paginaActual = 1;
  sorteosPorPagina = 6;
  totalPaginas = 1;

  async ngOnInit() {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4001/api/sorteos/all', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      this.sorteos = await res.json();
      this.totalPaginas = Math.ceil(this.sorteos.length / this.sorteosPorPagina);
    } else {
      this.sorteos = [];
    }
  }

  get sorteosPaginados() {
    const start = (this.paginaActual - 1) * this.sorteosPorPagina;
    return this.sorteos.slice(start, start + this.sorteosPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async eliminarSorteo(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este sorteo?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4001/api/sorteos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.sorteos = this.sorteos.filter(s => s._id !== id);
      this.totalPaginas = Math.max(1, Math.ceil(this.sorteos.length / this.sorteosPorPagina));
      if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
    } else {
      alert('Error al eliminar el sorteo');
    }
  }
}
