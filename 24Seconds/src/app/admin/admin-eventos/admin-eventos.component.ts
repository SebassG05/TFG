import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion.service';
import { API_URL } from '../../api-url';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './admin-eventos.component.html',
  styleUrls: ['./admin-eventos.component.css']
})
export class AdminEventosComponent implements OnInit {
  eventos: any[] = [];
  paginaActual: number = 1;
  eventosPorPagina: number = 5;
  isMobile = false;
  expandedIndex: number | null = null;

  constructor(private notificacionService: NotificacionService) {}

  get eventosPaginados() {
    const start = (this.paginaActual - 1) * this.eventosPorPagina;
    return this.eventos.slice(start, start + this.eventosPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.eventos.length / this.eventosPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async ngOnInit() {
    this.isMobile = window.innerWidth <= 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 700;
    });
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/events/all`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      this.eventos = await res.json();
    } else {
      this.eventos = [];
    }
    setTimeout(() => this.initFondoAnimado(), 0);
  }

  initFondoAnimado() {
    const canvas = document.getElementById('fondoAnimadoEventos') as HTMLCanvasElement;
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

  toggleExpand(idx: number) {
    this.expandedIndex = this.expandedIndex === idx ? null : idx;
  }

  async eliminarEvento(id: string) {
    this.notificacionService.mostrar({
      mensaje: '¿Seguro que quieres eliminar este evento?',
      tipo: 'confirm',
      accion: {
        texto: 'Eliminar',
        callback: async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/events/delete/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (res.ok) {
            this.eventos = this.eventos.filter(e => e._id !== id);
            this.notificacionService.mostrar({ mensaje: 'Evento eliminado correctamente', tipo: 'success' });
          } else {
            this.notificacionService.mostrar({ mensaje: 'Error al eliminar el evento', tipo: 'error' });
          }
        }
      }
    });
  }
}
