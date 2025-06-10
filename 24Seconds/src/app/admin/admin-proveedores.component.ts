import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NotificacionService } from '../notificacion.service';
import { API_URL } from '../api-url';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-proveedores',
  standalone: true,
  imports: [NgFor, NgIf],
  styleUrls: [
    './admin-usuarios.estetica.css',
    './adminproveedores responsive/admin-proveedores-responsive.css'
  ],
  template: `
    <div class="product-management-bg">
      <canvas class="gestion-bg-canvas" id="gestion-bg-canvas"></canvas>
      <div class="usuarios-admin-table-container">
        <h2 class="usuarios-title">Aprobar o Denegar Proveedores</h2>
        <table class="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let proveedor of proveedores">
              <td data-label="Usuario">{{ proveedor.username }}</td>
              <td data-label="Email">{{ proveedor.email }}</td>
              <td data-label="Acciones">
                <button class="btn-eliminar" (click)="aprobarProveedor(proveedor._id)">Aprobar</button>
                <button class="btn-eliminar" (click)="denegarProveedor(proveedor._id)">Denegar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="proveedores.length === 0" class="usuarios-empty">
          <img src="/assets/logo.png" alt="Sin proveedores" class="usuarios-empty-img" />
          <p>No hay proveedores pendientes por aprobar.</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminProveedoresComponent implements OnInit, AfterViewInit {
  proveedores: any[] = [];

  constructor(private notificacionService: NotificacionService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/auth/proveedores-pendientes`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          this.notificacionService.mostrar({ mensaje: error.message || 'Error al cargar proveedores', tipo: 'error' });
          return [];
        }
        return res.json();
      })
      .then(data => this.proveedores = data || []);
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

  aprobarProveedor(id: string) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/auth/approve-proveedor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ proveedorId: id })
    })
      .then(res => res.json())
      .then(data => {
        this.proveedores = this.proveedores.filter(p => p._id !== id);
        this.notificacionService.mostrar({ mensaje: data.message || 'Proveedor aprobado correctamente', tipo: 'success' });
        setTimeout(() => {
          this.router.navigate(['/proveedores']);
        }, 1200);
      });
  }

  denegarProveedor(id: string) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/auth/reject-proveedor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ proveedorId: id })
    })
      .then(res => res.json())
      .then(() => this.proveedores = this.proveedores.filter(p => p._id !== id));
  }
}
