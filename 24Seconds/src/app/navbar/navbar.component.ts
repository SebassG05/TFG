import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [NgIf, RouterLink, RouterLinkActive],
})
export class NavbarComponent {
  menuOpen = false;

  onUserClick() {
    // Aquí puedes abrir modal de login, perfil, etc.
    // Por defecto, solo cierra el menú móvil si está abierto
    this.menuOpen = false;
  }
}
