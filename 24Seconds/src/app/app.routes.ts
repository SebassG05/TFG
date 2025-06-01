import { Routes } from '@angular/router';
import { AdminUsuariosComponent } from './admin/admin-usuarios.component';
import { CrearProductoComponent } from './proveedor/crear-producto.component';
import { CrearSorteoComponent } from './proveedor/crear-sorteo.component';
import { AdminProductosComponent } from './admin/admin-productos/admin-productos.component';
import { AdminEventosComponent } from './admin/admin-eventos/admin-eventos.component';
import { AdminSorteosComponent } from './admin/admin-sorteos/admin-sorteos.component';
import { VotationTopratedComponent } from './votation-toprated/votation-toprated.component';
import { FormularioZapaidealComponent } from './formulario-zapaideal/formulario-zapaideal.component';
import { roleGuardFactory } from './role.guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/proveedores', loadComponent: () => import('./admin/admin-proveedores.component').then(m => m.AdminProveedoresComponent), canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/pedidos', component: AdminProductosComponent, canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/eventos', component: AdminEventosComponent, canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/sorteos', component: AdminSorteosComponent, canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/sugerencias', loadComponent: () => import('./admin/admin-sugerencias.component').then(m => m.AdminSugerenciasComponent), canActivate: [roleGuardFactory(['admin'])] },
  { path: 'admin/inscripciones', loadComponent: () => import('./admin/admin-inscripciones/admin-inscripciones.component').then(m => m.AdminInscripcionesComponent), canActivate: [roleGuardFactory(['admin'])] },
  { path: 'proveedor', loadComponent: () => import('./proveedor/proveedor.component').then(m => m.ProveedorComponent), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/crear-producto', loadComponent: () => import('./proveedor/crear-producto.component').then(m => m.CrearProductoComponent), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/crear-evento', loadComponent: () => import('./proveedor/crear-evento.component').then(m => m.CrearEventoComponent), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/crear-sorteo', loadComponent: () => import('./proveedor/crear-sorteo.component').then(m => m.CrearSorteoComponent), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/gestion-producto', loadChildren: () => import('./proveedor/product-management/product-management.routes').then(m => m.default), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/gestion-evento', loadChildren: () => import('./proveedor/event-management/event-management.routes').then(m => m.default), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'proveedor/gestion-sorteo', loadChildren: () => import('./proveedor/sorteo-management/sorteo-management.routes').then(m => m.default), canActivate: [roleGuardFactory(['proveedor'])] },
  { path: 'reset/:token', loadComponent: () => import('./reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'historia', loadComponent: () => import('./historia/historia.component').then(m => m.HistoriaComponent) },
  { path: 'votation-toprated', component: VotationTopratedComponent },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'eventos/inscripcion', loadChildren: () => import('./eventos/listado-eventos/listado-eventos.routes').then(m => m.default) },
  { path: 'inscripcion-sorteos', loadComponent: () => import('./sorteo/listado-sorteo/listado-sorteo.component').then(m => m.ListadoSorteoComponent) },
  { path: 'contacto', loadComponent: () => import('./contacto/contacto.component').then(m => m.ContactoComponent) },
  { path: 'zapasideales', loadComponent: () => import('./formulario-zapaideal/formulario-zapaideal.component').then(m => m.FormularioZapaidealComponent) },
  { path: 'productos', loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent) },
  { path: 'success', loadComponent: () => import('./success/success.component').then(m => m.SuccessComponent) },
  { path: 'creacionbalon', loadComponent: () => import('./balon-sueno/crear-balon/crear.component').then(m => m.CrearComponent) },
  { path: 'coomingsoon', loadComponent: () => import('./cooming-soon/cooming-soon.component').then(m => m.CoomingSoonComponent) },
];

