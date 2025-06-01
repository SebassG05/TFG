import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { Router } from '@angular/router';
import { HistoriaCardComponent } from '../historia-card/historia-card.component';
import { TopZapatillasComponent } from '../top-zapatillas/top-zapatillas.component';
import { EventosComponent } from '../eventos/eventos.component';
import { BalonSuenoComponent } from '../balon-sueno/balon-sueno.component';
import { ZapaIdealComponent } from '../zapa-ideal/zapa.component';
import { SorteoComponent } from '../sorteo/sorteo.component';
import { FooterComponent } from '../footer/footer.component';
import { NgIf } from '@angular/common';
import { NotificacionService } from '../notificacion.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgIf, CarouselComponent, HistoriaCardComponent, TopZapatillasComponent, EventosComponent, BalonSuenoComponent, ZapaIdealComponent, SorteoComponent, FooterComponent]
})
export class HomeComponent {
  private notificacionService = inject(NotificacionService);

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
      this.notificacionService.mostrar({ mensaje: 'Sesión cerrada correctamente.', tipo: 'success' });
      setTimeout(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/home']).then(() => {
          window.dispatchEvent(new CustomEvent('mostrar-login-modal'));
        });
      }, 1800);
    });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
