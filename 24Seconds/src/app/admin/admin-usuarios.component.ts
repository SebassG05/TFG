import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  styleUrls: ['./admin-usuarios.estetica.css'],
  template: `
    <div class="product-management-bg">
      <canvas class="gestion-bg-canvas" id="gestion-bg-canvas"></canvas>
      <div class="usuarios-admin-table-container">
        <h2 class="usuarios-title">Usuarios Registrados</h2>
        <ng-container *ngIf="!isMobile">
          <table class="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>HoopCoins</th>
                <th>Fecha de Registro</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuariosPaginados">
                <td>{{ usuario.username }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.hoopCoins }}</td>
                <td>{{ usuario.createdAt | date:'short' }}</td>
                <td>
                  <button class="btn-eliminar" (click)="eliminarUsuario(usuario._id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </ng-container>
        <ng-container *ngIf="isMobile">
          <div class="usuarios-list-responsive">
            <div *ngFor="let usuario of usuarios; let i = index" class="usuario-item-responsive">
              <div class="usuario-email-row" (click)="toggleExpand(i)">
                <span class="usuario-email">{{ usuario.email }}</span>
                <span class="expand-icon">{{ expandedIndex === i ? '▲' : '▼' }}</span>
              </div>
              <div class="usuario-details-responsive" *ngIf="expandedIndex === i">
                <div><b>Usuario:</b> {{ usuario.username }}</div>
                <div><b>HoopCoins:</b> {{ usuario.hoopCoins }}</div>
                <div><b>Fecha de Registro:</b> {{ usuario.createdAt | date:'short' }}</div>
                <button class="btn-eliminar" (click)="eliminarUsuario(usuario._id)">Eliminar</button>
              </div>
            </div>
          </div>
        </ng-container>
        <div *ngIf="usuarios.length === 0" class="usuarios-empty">
          <img src="/assets/logo.png" alt="Sin usuarios" class="usuarios-empty-img" />
          <p>No hay usuarios registrados.</p>
        </div>
        <div *ngIf="usuarios.length > tamanoPagina && !isMobile" class="usuarios-paginacion">
          <button (click)="cambiarPagina(-1)" [disabled]="paginaActual === 1">Anterior</button>
          <span>Página {{paginaActual}} de {{totalPaginas}}</span>
          <button (click)="cambiarPagina(1)" [disabled]="paginaActual === totalPaginas">Siguiente</button>
        </div>
      </div>
    </div>
  `,

})
export class AdminUsuariosComponent implements OnInit, AfterViewInit {
  usuarios: any[] = [];
  paginaActual: number = 1;
  tamanoPagina: number = 6;
  isMobile = false;
  expandedIndex: number | null = null;

  constructor(private notificacionService: NotificacionService) {}

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.tamanoPagina);
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.usuarios.slice(inicio, inicio + this.tamanoPagina);
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 700;
    });
    this.cargarUsuarios();
  }

  cargarUsuarios = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4001/api/admin/usuarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.usuarios = await res.json();
    } else {
      this.usuarios = [];
    }
  }

  ngAfterViewInit() {
    this.initAnimatedBg();
  }

  initAnimatedBg() {
    const canvas = document.getElementById('gestion-bg-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    // Líneas curvas animadas (rojo y blanco más vivos, mucho más lentas)
    const lines = [
      { color: '#ff3b3b', width: 2.8, baseY: 0.35, amp: 3.5, freq: 4.1, speed: 0.045, phase: 0 },
      { color: '#fff', width: 2.5, baseY: 0.55, amp: 3.2, freq: 3.7, speed: 0.035, phase: 1.2 },
      { color: '#ff1a1a', width: 2.6, baseY: 0.65, amp: 3.8, freq: 4.5, speed: 0.027, phase: 2.1 },
      { color: '#fff', width: 2.7, baseY: 0.80, amp: 3.4, freq: 3.9, speed: 0.021, phase: 2.8 },
    ];
    function drawCurvedLine(ctx: CanvasRenderingContext2D, color: string, width: number, t: number, baseY: number, amp: number, freq: number, speed: number, phase: number) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      // Movimiento vertical global lento
      const yOffset = Math.sin(t * speed + phase) * (canvas.height / 12);
      for (let x = 0; x <= canvas.width; x += 4) {
        const percent = x / canvas.width;
        const y = canvas.height * baseY + Math.sin(percent * freq * Math.PI + phase) * (canvas.height / amp) + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    let t = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        drawCurvedLine(ctx, l.color, l.width, t, l.baseY, l.amp, l.freq, l.speed, l.phase);
      });
      t += 0.25;
      requestAnimationFrame(animate);
    }
    animate();
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async eliminarUsuario(id: string) {
    this.notificacionService.mostrar({
      mensaje: '¿Seguro que quieres eliminar esta cuenta?',
      tipo: 'confirm',
      accion: {
        texto: 'Eliminar',
        callback: async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:4001/api/admin/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            this.usuarios = this.usuarios.filter(u => u._id !== id);
            this.notificacionService.mostrar({ mensaje: 'Usuario eliminado correctamente', tipo: 'success' });
          } else {
            this.notificacionService.mostrar({ mensaje: 'Error al eliminar el usuario', tipo: 'error' });
          }
        }
      }
    });
  }

  toggleExpand(idx: number) {
    this.expandedIndex = this.expandedIndex === idx ? null : idx;
  }
}
