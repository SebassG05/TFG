import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService, Notificacion } from './notificacion.service';

@Component({
  selector: 'app-notificacion-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notificacion" class="notificacion-toast" [ngClass]="notificacion.tipo">
      <span class="notificacion-icon" *ngIf="notificacion.tipo === 'success'">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#ffb700" stroke-width="2.5" fill="#1bbf4c"/><path d="M10 17.5L15 22L23 12" stroke="#fffbe6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span class="notificacion-icon" *ngIf="notificacion.tipo === 'error'">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#ffb700" stroke-width="2.5" fill="#ff3b3b"/><path d="M12 12L20 20M20 12L12 20" stroke="#fffbe6" stroke-width="3.5" stroke-linecap="round"/></svg>
      </span>
      <span class="notificacion-icon" *ngIf="notificacion.tipo === 'warning'">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#ffb700" stroke-width="2.5" fill="#ffb700"/><path d="M16 10V18" stroke="#23272f" stroke-width="3.5" stroke-linecap="round"/><circle cx="16" cy="22" r="2" fill="#23272f"/></svg>
      </span>
      <span class="notificacion-icon" *ngIf="notificacion.tipo === 'info'">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#2196f3" stroke-width="2.5" fill="#23272f"/><path d="M16 12V18" stroke="#b3e5fc" stroke-width="3.5" stroke-linecap="round"/><circle cx="16" cy="22" r="2" fill="#b3e5fc"/></svg>
      </span>
      <span class="notificacion-icon" *ngIf="notificacion.tipo === 'confirm'">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#ffb700" stroke-width="2.5" fill="#23272f"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#ffb700" font-family="Montserrat, Arial, sans-serif">?</text></svg>
      </span>
      <span class="notificacion-text">{{ notificacion.mensaje }}</span>
      <button *ngIf="notificacion.accion" class="notif-btn aceptar" (click)="accionar()">{{ notificacion.accion.texto }}</button>
      <button *ngIf="notificacion.tipo === 'confirm'" class="notif-btn cancelar" (click)="cerrar()">Cancelar</button>
    </div>
  `,
  styleUrls: ['./notificacion-toast.component.css']
})
export class NotificacionToastComponent implements OnDestroy {
  notificacion: Notificacion | null = null;
  private timeoutId: any;
  private notiSrv = inject(NotificacionService);

  constructor() {
    this.notiSrv.notificacion$.subscribe(n => {
      this.notificacion = n;
      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (n.tipo !== 'confirm') {
        this.timeoutId = setTimeout(() => this.cerrar(), n.duracion ?? 2200);
      }
    });
  }

  accionar() {
    if (this.notificacion?.accion) {
      this.notificacion.accion.callback();
      this.cerrar();
    }
  }

  cerrar() {
    this.notificacion = null;
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
