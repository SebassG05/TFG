import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [FormsModule, NgIf, RouterModule]
})
export class NavbarComponent {
  menuOpen = false;
  searchTerm = '';
  searchMobileOpen = false;
  isAdmin = true; // Cambia esto por la lógica real de autenticación/rol

  onSearch() {
    // Aquí puedes emitir el término de búsqueda o hacer lógica adicional
    console.log('Buscar:', this.searchTerm);
    this.searchMobileOpen = false; // Cierra la búsqueda en móvil tras buscar
  }
}
