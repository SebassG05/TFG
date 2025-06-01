import { Component, Input } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-mobile-navbar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './admin-mobile-navbar.component.html',
  styleUrls: ['./admin-mobile-navbar.component.css']
})
export class AdminMobileNavbarComponent {
  menuAbierto = false;
  menuItems = [
    { label: 'Aprobar Proveedores', link: '/admin/proveedores' },
    { label: 'Gestión de Usuarios', link: '/admin/usuarios' },
    { label: 'Productos en Tienda', link: '/admin/pedidos' },
    { label: 'Eventos Tienda', link: '/admin/eventos' },
    { label: 'Sorteos Tienda', link: '/admin/sorteos' },
    { label: 'Listado de Inscripciones', link: '/admin/inscripciones' },
  ];

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
  closeMenu() {
    this.menuAbierto = false;
  }
}
