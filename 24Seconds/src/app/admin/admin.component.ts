import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div class="admin-dashboard">
      <aside class="admin-sidebar">
        <h2>Panel Admin</h2>
        <ul>
          <li><a routerLink="/admin/proveedores">Aprobar Proveedores</a></li>
          <li><a routerLink="/admin/usuarios">Gestión de Usuarios</a></li>
          <li><a routerLink="/admin/productos">Gestión de Productos</a></li>
          <li><a routerLink="/admin/pedidos">Pedidos</a></li>
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
            <h3>Productos</h3>
            <p>Agrega, edita o elimina productos.</p>
            <a routerLink="/admin/productos" class="btn">Gestionar Productos</a>
          </div>
          <div class="widget">
            <h3>Pedidos</h3>
            <p>Consulta y gestiona los pedidos recientes.</p>
            <a routerLink="/admin/pedidos" class="btn">Ver Pedidos</a>
          </div>
        </section>
      </main>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {}
