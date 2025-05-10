import { Component } from '@angular/core';
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
export class AppComponent {
  title = '24Seconds';

  isAdminRoute(): boolean {
    return window.location.pathname.startsWith('/admin');
  }
}
