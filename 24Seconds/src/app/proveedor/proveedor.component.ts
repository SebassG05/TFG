import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import AOS from 'aos';
import { CrearProductoComponent } from './crear-producto.component';
import { CrearSorteoComponent } from './crear-sorteo.component';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CommonModule } from '@angular/common';
import { VotationTopratedComponent } from '../votation-toprated/votation-toprated.component';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
  imports: [NgIf, CrearProductoComponent, ProductManagementComponent, CommonModule, RouterModule],
})
export class ProveedorComponent implements AfterViewInit, OnInit {
  mostrarCrearProducto = false;
  showProductManagement = false;
  productosProveedor: any[] = [];
  empresa: string | null = null;
  private notificacionService = inject(NotificacionService);

  constructor(private router: Router) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('https://tfg-z7pz.onrender.com/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const user = await res.json();
      this.empresa = user.proveedorData || user.username || null;
    }
  }

  ngAfterViewInit() {
    AOS.init({ once: true });
  }

  irACrearProducto() {
    this.router.navigate(['/proveedor/crear-producto']);
  }

  irACrearEvento() {
    this.router.navigate(['/proveedor/crear-evento']);
  }

  irACrearSorteo() {
    this.router.navigate(['/proveedor/crear-sorteo']);
  }

  mostrarGestionProducto() {
    this.router.navigate(['/proveedor/gestion-producto']);
  }

  mostrarGestionEvento() {
    this.router.navigate(['/proveedor/gestion-evento']);
  }

  mostrarGestionSorteo() {
    this.router.navigate(['/proveedor/gestion-sorteo']);
  }

  cerrarGestionProducto() {
    this.showProductManagement = false;
  }

  logout() {
    fetch('https://tfg-z7pz.onrender.com/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      this.notificacionService.mostrar({ mensaje: 'Sesión cerrada correctamente.', tipo: 'success' });
      setTimeout(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/home']).then(() => {
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    })
    .catch(() => {
      this.notificacionService.mostrar({ mensaje: 'Sesión cerrada.', tipo: 'info' });
      setTimeout(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/home']).then(() => {
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    });
  }
}
