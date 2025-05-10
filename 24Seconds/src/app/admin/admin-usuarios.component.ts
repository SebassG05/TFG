import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
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
  styles: [`
    .usuarios-admin-container {
      max-width: 100%;
      width: 900px;
      margin: 3rem auto 0 auto;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10);
      padding: 2.5rem 2.5rem 2rem 2.5rem;
      min-height: 400px;
      position: relative;
      overflow-x: auto;
    }
    .usuarios-title {
      font-size: 2.1rem;
      font-weight: 700;
      margin-bottom: 2.2rem;
      color: #23272f;
      text-align: center;
      letter-spacing: 1px;
    }
    .usuarios-table {
      width: 100%;
      min-width: 800px;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 1.5rem;
    }
    .usuarios-table th, .usuarios-table td {
      padding: 1.1rem 1.2rem;
      text-align: left;
      font-size: 1.08rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .usuarios-table th, .usuarios-table td {
      width: 20%;
    }
    .usuarios-table th:nth-child(1),
    .usuarios-table td:nth-child(1) {
      width: 28%; /* Usuario más largo */
      max-width: 260px;
    }
    .usuarios-table th:nth-child(5),
    .usuarios-table td:nth-child(5) {
      width: 28%; /* Fecha de registro más larga */
      max-width: 260px;
    }
    .usuarios-table th,
    .usuarios-table td {
      vertical-align: middle;
    }
    .usuarios-table th {
      background: #f4f6fa;
      font-weight: 700;
      color: #23272f;
      border-bottom: 2px solid #e5e7eb;
    }
    .usuarios-table tr {
      transition: background 0.18s;
    }
    .usuarios-table tbody tr:hover {
      background: #f1f5fb;
    }
    .usuarios-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2.5rem;
      color: #888;
      font-size: 1.2rem;
    }
    .usuarios-empty-img {
      width: 90px;
      opacity: 0.13;
      margin-bottom: 1.2rem;
    }
    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .pagination-controls button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .pagination-controls button:disabled {
      background-color: #d6d6d6;
      cursor: not-allowed;
    }
    .pagination-controls button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .usuarios-paginacion {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.2rem;
      margin-top: 1.5rem;
    }
    .usuarios-paginacion button {
      background: #ff3c00;
      color: #fff;
      border: none;
      border-radius: 7px;
      padding: 0.5rem 1.3rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .usuarios-paginacion button:disabled {
      background: #e0e0e0;
      color: #aaa;
      cursor: not-allowed;
    }
    .usuarios-paginacion span {
      font-size: 1.1rem;
      color: #23272f;
      font-weight: 500;
    }
    .btn-eliminar {
      background: #e53935;
      color: #fff;
      border: none;
      border-radius: 7px;
      padding: 0.5rem 1.1rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-eliminar:hover {
      background: #b71c1c;
    }
  `]
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
