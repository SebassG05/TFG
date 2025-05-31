import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificacionTipo = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface Notificacion {
  mensaje: string;
  tipo: NotificacionTipo;
  duracion?: number; // ms
  accion?: {
    texto: string;
    callback: () => void;
  };
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private notificacionSubject = new Subject<Notificacion>();
  notificacion$ = this.notificacionSubject.asObservable();

  mostrar(notificacion: Notificacion) {
    this.notificacionSubject.next(notificacion);
  }
}
