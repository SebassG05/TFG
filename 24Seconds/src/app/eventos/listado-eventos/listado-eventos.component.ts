import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../notificacion.service';

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ListadoEventosComponent implements OnInit {
  eventos: any[] = [];
  cargando = true;
  error = '';
  inscripciones: { [eventId: string]: boolean } = {};

  private notiSrv = inject(NotificacionService);

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      let headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('http://localhost:4001/api/events/all', { headers });
      if (!res.ok) throw new Error('No se pudieron cargar los eventos');
      this.eventos = await res.json();
      // Marcar eventos en los que el usuario ya está inscrito
      if (token) {
        const perfilRes = await fetch('http://localhost:4001/api/auth/profile', { headers });
        if (perfilRes.ok) {
          const user = await perfilRes.json();
          const inscritos = user.registeredEvents?.map((ev: any) => ev._id) || [];
          for (const evento of this.eventos) {
            if (inscritos.includes(evento._id)) {
              evento.inscrito = true;
              this.inscripciones[evento._id] = true;
            }
          }
        }
      }
      this.cargando = false;
    } catch (err: any) {
      this.error = 'No hay eventos disponibles';
      this.eventos = [];
      this.cargando = false;
    }
  }

  get eventosDisponibles() {
    const hoy = new Date();
    return this.eventos.filter(e => {
      const inicio = new Date(e.registrationDates?.start);
      const fin = new Date(e.registrationDates?.end);
      return hoy >= inicio && hoy <= fin;
    }).sort((a, b) => new Date(a.registrationDates.start).getTime() - new Date(b.registrationDates.start).getTime());
  }

  get eventosBloqueados() {
    const hoy = new Date();
    return this.eventos.filter(e => {
      const inicio = new Date(e.registrationDates?.start);
      const fin = new Date(e.registrationDates?.end);
      return hoy < inicio || hoy > fin;
    }).sort((a, b) => new Date(b.registrationDates.start).getTime() - new Date(a.registrationDates.start).getTime());
  }

  async inscribirse(evento: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notiSrv.mostrar({ mensaje: 'Debes iniciar sesión para inscribirte.', tipo: 'warning' });
      return;
    }
    if (this.inscripciones[evento._id]) {
      this.notiSrv.mostrar({ mensaje: 'Ya estás inscrito a este evento', tipo: 'info' });
      return;
    }
    try {
      const res = await fetch(`http://localhost:4001/api/events/register/${evento._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al inscribirse');
      this.inscripciones[evento._id] = true;
      evento.inscrito = true;
      this.notiSrv.mostrar({ mensaje: 'Inscripción exitosa. Puedes ver el evento en tu perfil.', tipo: 'success' });
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('ya estás inscrito')) {
        this.inscripciones[evento._id] = true;
        evento.inscrito = true;
      }
      this.notiSrv.mostrar({ mensaje: err.message || 'Error al inscribirse', tipo: 'error' });
    }
  }

  isInscrito(evento: any): boolean {
    // Si ya se marcó en esta sesión o el usuario ya está inscrito (por backend)
    return this.inscripciones[evento._id] || (evento.inscrito === true);
  }
}
