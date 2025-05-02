import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: 'proveedor', loadComponent: () => import('./proveedor/proveedor.component').then(m => m.ProveedorComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // ...otras rutas...
];
