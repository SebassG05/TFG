import { Routes } from '@angular/router';
import { AdminUsuariosComponent } from './admin/admin-usuarios.component';
import { CrearProductoComponent } from './proveedor/crear-producto.component';
import { CrearSorteoComponent } from './proveedor/crear-sorteo.component';
import { AdminProductosComponent } from './admin/admin-productos/admin-productos.component';
import { AdminEventosComponent } from './admin/admin-eventos/admin-eventos.component';
import { AdminSorteosComponent } from './admin/admin-sorteos/admin-sorteos.component';
import { VotationTopratedComponent } from './votation-toprated/votation-toprated.component';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: 'admin/proveedores', loadComponent: () => import('./admin/admin-proveedores.component').then(m => m.AdminProveedoresComponent) },
  { path: 'admin/usuarios', component: AdminUsuariosComponent },
  { path: 'admin/pedidos', component: AdminProductosComponent },
  { path: 'admin/eventos', component: AdminEventosComponent },
  { path: 'admin/sorteos', component: AdminSorteosComponent },
  { path: 'proveedor', loadComponent: () => import('./proveedor/proveedor.component').then(m => m.ProveedorComponent) },
  { path: 'proveedor/crear-producto', loadComponent: () => import('./proveedor/crear-producto.component').then(m => m.CrearProductoComponent) },
  { path: 'proveedor/crear-evento', loadComponent: () => import('./proveedor/crear-evento.component').then(m => m.CrearEventoComponent) },
  { path: 'proveedor/crear-sorteo', loadComponent: () => import('./proveedor/crear-sorteo.component').then(m => m.CrearSorteoComponent) },
  { path: 'proveedor/gestion-producto', loadChildren: () => import('./proveedor/product-management/product-management.routes').then(m => m.default) },
  { path: 'proveedor/gestion-evento', loadChildren: () => import('./proveedor/event-management/event-management.routes').then(m => m.default) },
  { path: 'proveedor/gestion-sorteo', loadChildren: () => import('./proveedor/sorteo-management/sorteo-management.routes').then(m => m.default) },
  { path: 'reset/:token', loadComponent: () => import('./reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'historia', loadComponent: () => import('./historia/historia.component').then(m => m.HistoriaComponent) },
  { path: 'votation-toprated', component: VotationTopratedComponent },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'eventos/inscripcion', loadChildren: () => import('./eventos/listado-eventos/listado-eventos.routes').then(m => m.default) },

];
