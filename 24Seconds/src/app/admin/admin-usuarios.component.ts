import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  styleUrls: ['./admin.users.css'],
  template: `
    <div class="usuarios-admin-container">
      <h2 class="usuarios-title">Usuarios Registrados</h2>
      <table class="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>HoopCoins</th>
            <th>Fecha de Registro</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let usuario of usuariosPaginados">
            <td>{{ usuario.username }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.role }}</td>
            <td>{{ usuario.hoopCoins }}</td>
            <td>{{ usuario.createdAt | date:'short' }}</td>
            <td>
              <button class="btn-eliminar" (click)="eliminarUsuario(usuario._id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="usuarios.length === 0" class="usuarios-empty">
        <img src="/assets/logo.png" alt="Sin usuarios" class="usuarios-empty-img" />
        <p>No hay usuarios registrados.</p>
      </div>
      <div *ngIf="usuarios.length > tamanoPagina" class="usuarios-paginacion">
        <button (click)="cambiarPagina(-1)" [disabled]="paginaActual === 1">Anterior</button>
        <span>Página {{paginaActual}} de {{totalPaginas}}</span>
        <button (click)="cambiarPagina(1)" [disabled]="paginaActual === totalPaginas">Siguiente</button>
      </div>
    </div>
  `,

})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  paginaActual: number = 1;
  tamanoPagina: number = 6;

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.tamanoPagina);
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.usuarios.slice(inicio, inicio + this.tamanoPagina);
  }

  async ngOnInit() {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4001/api/admin/usuarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.usuarios = await res.json();
    } else {
      this.usuarios = [];
    }
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async eliminarUsuario(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta cuenta?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4001/api/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.usuarios = this.usuarios.filter(u => u._id !== id);
    } else {
      alert('Error al eliminar el usuario');
    }
  }
}
