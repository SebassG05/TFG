import { Component, AfterViewInit } from '@angular/core';
import AOS from 'aos';
import { CrearProductoComponent } from './crear-producto.component';
import { CrearSorteoComponent } from './crear-sorteo.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
  imports: [NgIf, CrearProductoComponent],
})
export class ProveedorComponent implements AfterViewInit {
  mostrarCrearProducto = false;
  mensajeLogout: string | null = null;

  constructor(private router: Router) {}

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
          // Usa un evento global para mostrar el login modal tras logout
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    })
    .catch(() => {
      this.mensajeLogout = 'Sesión cerrada correctamente.';
      setTimeout(() => {
        this.mensajeLogout = null;
        localStorage.removeItem('token');
        this.router.navigate(['/home']).then(() => {
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    });
  }
}
