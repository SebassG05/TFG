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
    this.menuOpen = false;
    window.location.href = '/perfil';
  }
}
