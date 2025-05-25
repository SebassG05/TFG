import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { Router } from '@angular/router';
import { HistoriaCardComponent } from '../historia-card/historia-card.component';
import { TopZapatillasComponent } from '../top-zapatillas/top-zapatillas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CarouselComponent, HistoriaCardComponent, TopZapatillasComponent]
})
export class HomeComponent {
  constructor(private router: Router) {}

  logout() {
    fetch('http://localhost:4001/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/home']).then(() => {
        window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
      });
    });
  }
}
