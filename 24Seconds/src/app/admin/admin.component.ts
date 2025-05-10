import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="admin-dashboard">
      <aside class="admin-sidebar">
        <h2>Panel Admin</h2>
        <ul>
          <li><a routerLink="/admin/proveedores">Aprobar Proveedores</a></li>
          <li><a routerLink="/admin/usuarios">Gestión de Usuarios</a></li>
          <li><a routerLink="/admin/pedidos">Productos en Tienda</a></li>
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
            <a routerLink="/admin/pedidos" class="btn">Ver Pedidos</a>
          </div>
        </section>
      </main>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {}
