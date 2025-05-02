import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FormsModule, NavbarComponent, AuthModalComponent]
})
export class AppComponent {
  title = '24Seconds';
}
