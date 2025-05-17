import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AdminMobileNavbarComponent } from './admin-mobile-navbar/admin-mobile-navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, NgIf, AdminMobileNavbarComponent],
  template: `
    <app-admin-mobile-navbar></app-admin-mobile-navbar>
    <div class="admin-dashboard">
      <aside class="admin-sidebar" *ngIf="!esMovil()">
        <h2>Panel Admin</h2>
        <ul>
          <li><a routerLink="/admin/proveedores">Aprobar Proveedores</a></li>
          <li><a routerLink="/admin/usuarios">Gestión de Usuarios</a></li>
          <li><a routerLink="/admin/pedidos">Productos en Tienda</a></li>
          <li><a routerLink="/admin/eventos">Eventos Tienda</a></li>
          <li><a routerLink="/admin/sorteos">Sorteos Tienda</a></li>
        </ul>
      </aside>
      <main class="admin-content">
        <h1>Bienvenido, Administrador</h1>
        <section class="admin-widgets">
          <div class="widget">
            <h3>Proveedores Pendientes</h3>
            <p>Revisa y aprueba nuevos proveedores.</p>
            <a routerLink="/admin/proveedores" class="btn">Ir a Proveedores</a>
          </div>
          <div class="widget">
            <h3>Usuarios Registrados</h3>
            <p>Gestiona los usuarios de la plataforma.</p>
            <a routerLink="/admin/usuarios" class="btn">Ver Usuarios</a>
          </div>
          <div class="widget">
            <h3>Productos en Tienda</h3>
            <p>Consulta todos los productos en la tienda.</p>
            <a routerLink="/admin/pedidos" class="btn">Ver Productos</a>
          </div>
          <div class="widget">
            <h3>Eventos Tienda</h3>
            <p>Consulta y elimina eventos de la tienda.</p>
            <a routerLink="/admin/eventos" class="btn">Ver Eventos</a>
          </div>
          <div class="widget">
            <h3>Sorteos Tienda</h3>
            <p>Consulta y elimina sorteos de la tienda.</p>
            <a routerLink="/admin/sorteos" class="btn">Ver Sorteos</a>
          </div>
        </section>
      </main>
    </div>
    <button class="exit-btn" (click)="logout()" title="Salir">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#23272f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>
    <div *ngIf="mensajeLogout" class="logout-toast">{{ mensajeLogout }}</div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  mensajeLogout: string | null = null;

  constructor(private router: Router) {}

  esMovil(): boolean {
    return window.innerWidth <= 900;
  }

  logout() {
    fetch('http://localhost:4001/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      this.mensajeLogout = 'Sesión cerrada correctamente.';
      setTimeout(() => {
        this.mensajeLogout = null;
        localStorage.removeItem('token');
        this.router.navigate(['/home']).then(() => {
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    })
    .catch(() => {
      this.mensajeLogout = 'Sesión cerrada.';
      setTimeout(() => {
        this.mensajeLogout = null;
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
      }, 1800);
    });
  }
}
