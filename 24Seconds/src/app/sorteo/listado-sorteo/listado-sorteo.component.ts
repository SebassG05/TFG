import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion.service';

@Component({
  selector: 'app-listado-sorteo',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './listado-sorteo.component.html',
  styleUrls: ['./listado-sorteo.component.css']
})
export class ListadoSorteoComponent implements OnInit {
  sorteosDisponibles: any[] = [];
  sorteosNoDisponibles: any[] = [];
  cargando = true;
  inscripciones: { [sorteoId: string]: boolean } = {};
  private notiSrv = inject(NotificacionService);

  async ngOnInit() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4001/api/sorteos/public/all', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await res.json();
    const hoy = new Date();
    this.sorteosDisponibles = (data || []).filter((s: any) => new Date(s.expirationDate) >= hoy);
    this.sorteosNoDisponibles = (data || []).filter((s: any) => new Date(s.expirationDate) < hoy);
    // Marcar sorteos como inscritos si el usuario ya está apuntado
    if (token) {
      try {
        const perfilRes = await fetch('http://localhost:4001/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (perfilRes.ok) {
          const user = await perfilRes.json();
          const inscritos = user.registeredRaffles || [];
          for (const sorteo of this.sorteosDisponibles) {
            if (inscritos.some((r: any) => r._id === sorteo._id)) {
              sorteo.inscrito = true;
              this.inscripciones[sorteo._id] = true;
            }
          }
        }
      } catch {}
    }
    this.cargando = false;
  }

  async inscribirse(sorteo: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notiSrv.mostrar({ mensaje: 'Debes iniciar sesión para inscribirte.', tipo: 'warning' });
      return;
    }
    if (this.inscripciones[sorteo._id]) {
      this.notiSrv.mostrar({ mensaje: 'Ya estás inscrito a este sorteo', tipo: 'info' });
      return;
    }
    try {
      const res = await fetch(`http://localhost:4001/api/sorteos/${sorteo._id}/inscribirse`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Error al inscribirse');
      this.inscripciones[sorteo._id] = true;
      sorteo.inscrito = true;
      this.notiSrv.mostrar({ mensaje: 'Inscripción exitosa. ¡Suerte!', tipo: 'success' });
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('ya estás inscrito')) {
        this.inscripciones[sorteo._id] = true;
        sorteo.inscrito = true;
      }
      this.notiSrv.mostrar({ mensaje: err.message || 'Error al inscribirse', tipo: 'error' });
    }
  }

  isInscrito(sorteo: any): boolean {
    return this.inscripciones[sorteo._id] || (sorteo.inscrito === true);
  }
}
