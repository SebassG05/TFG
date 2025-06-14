import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificacionService } from '../notificacion.service';
import { API_URL } from '../api-url';

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

  constructor(private notificacionService: NotificacionService) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/sorteos/all`, {
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
    this.notificacionService.mostrar({
      mensaje: '¿Seguro que quieres eliminar este sorteo?',
      tipo: 'confirm',
      accion: {
        texto: 'Eliminar',
        callback: async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/sorteos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            this.sorteos = this.sorteos.filter(s => s._id !== id);
            this.totalPaginas = Math.max(1, Math.ceil(this.sorteos.length / this.sorteosPorPagina));
            if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
            this.notificacionService.mostrar({ mensaje: 'Sorteo eliminado correctamente', tipo: 'success' });
          } else {
            this.notificacionService.mostrar({ mensaje: 'Error al eliminar el sorteo', tipo: 'error' });
          }
        }
      }
    });
  }
}
