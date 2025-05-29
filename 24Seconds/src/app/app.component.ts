import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FormsModule, NavbarComponent, AuthModalComponent, RouterOutlet, NgIf]
})
export class AppComponent implements AfterViewInit {
  title = '24Seconds';
  @ViewChild(AuthModalComponent) authModal?: AuthModalComponent;

  isAdminRoute(): boolean {
    return window.location.pathname.startsWith('/admin');
  }

  isAdminOrProveedorRoute(): boolean {
    const path = window.location.pathname;
    return path.startsWith('/admin') || path.startsWith('/proveedor');
  }

  mostrarLoginModal() {
    if (this.authModal) {
      this.authModal.activeTab = 'login';
      this.authModal.show = true;
      this.authModal.email = '';
      this.authModal.password = '';
      this.authModal.username = '';
      this.authModal.confirmPassword = '';
      this.authModal.proveedorData = '';
    }
  }

  ngAfterViewInit() {
    window.addEventListener('mostrar-login-modal', () => {
      this.mostrarLoginModal();
    });
    // OCULTAR LOGIN EN RESET
    if (window.location.pathname.startsWith('/reset')) {
      if (this.authModal) {
        this.authModal.show = false;
      }
    }
  }
}
