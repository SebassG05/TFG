import { Routes } from '@angular/router';
import { AdminUsuariosComponent } from './admin/admin-usuarios.component';
import { CrearProductoComponent } from './proveedor/crear-producto.component';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: 'admin/proveedores', loadComponent: () => import('./admin/admin-proveedores.component').then(m => m.AdminProveedoresComponent) },
  { path: 'admin/usuarios', component: AdminUsuariosComponent },
  { path: 'proveedor', loadComponent: () => import('./proveedor/proveedor.component').then(m => m.ProveedorComponent) },
  { path: 'proveedor/crear-producto', loadComponent: () => import('./proveedor/crear-producto.component').then(m => m.CrearProductoComponent) },
  { path: 'reset/:token', loadComponent: () => import('./reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];
