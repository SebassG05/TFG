import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion.service';

@Component({
  selector: 'app-admin-sorteos',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './admin-sorteos.component.html',
  styleUrls: ['./admin-sorteos.component.css']
})
export class AdminSorteosComponent implements OnInit {
  sorteos: any[] = [];
  paginaActual = 1;
  sorteosPorPagina = 5;
  totalPaginas = 1;
  isMobile = false;
  expandedIndex: number | null = null;

  constructor(private notificacionService: NotificacionService) {}

  async ngOnInit() {
    this.isMobile = window.innerWidth <= 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 700;
    });
    const token = localStorage.getItem('token');
    const res = await fetch('https://tfg-z7pz.onrender.com/api/sorteos/all', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      this.sorteos = await res.json();
      this.totalPaginas = Math.ceil(this.sorteos.length / this.sorteosPorPagina);
    } else {
      this.sorteos = [];
    }
    setTimeout(() => this.initFondoAnimado(), 0);
  }

  initFondoAnimado() {
    const canvas = document.getElementById('fondoAnimadoSorteos') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
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

  get sorteosPaginados() {
    const start = (this.paginaActual - 1) * this.sorteosPorPagina;
    return this.sorteos.slice(start, start + this.sorteosPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async eliminarSorteo(id: string) {
    this.notificacionService.mostrar({
      mensaje: '¿Seguro que quieres eliminar este sorteo?',
      tipo: 'confirm',
      accion: {
        texto: 'Eliminar',
        callback: async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`https://tfg-z7pz.onrender.com/api/sorteos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            this.sorteos = this.sorteos.filter(s => s._id !== id);
            this.totalPaginas = Math.max(1, Math.ceil(this.sorteos.length / this.sorteosPorPagina));
            if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
            this.notificacionService.mostrar({ mensaje: 'Sorteo eliminado correctamente', tipo: 'success' });
          } else {
            this.notificacionService.mostrar({ mensaje: 'Error al eliminar el sorteo', tipo: 'error' });
          }
        }
      }
    });
  }

  toggleExpand(idx: number) {
    this.expandedIndex = this.expandedIndex === idx ? null : idx;
  }
}
