import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule]
})
export class EventManagementComponent implements OnInit, AfterViewInit {
  eventos: any[] = [];
  show = true;
  paginaActual = 1;
  eventosPorPagina = 5;
  isMobile = false;
  expandedIndex = -1;

  constructor(public router: Router) {}

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
    this.checkIsMobile();
    window.addEventListener('resize', this.checkIsMobile.bind(this));
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:4001/api/events/mis-eventos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const eventos = await res.json();
      this.eventos = eventos;
    } else {
      this.eventos = [];
    }
    this.paginaActual = 1;
  }

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 700;
  }

  async eliminarEvento(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4001/api/events/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.eventos = this.eventos.filter(e => e._id !== id);
    } else {
      alert('Error al eliminar el evento');
    }
  }

  editarNombre(evento: any) { evento.editandoNombre = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarNombre(evento: any) { evento.editandoNombre = false; await this.guardarCampo(evento); }

  editarEventDate(evento: any) { evento.editandoEventDate = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarEventDate(evento: any) { evento.editandoEventDate = false; await this.guardarCampo(evento); }

  editarRegStart(evento: any) { evento.editandoRegStart = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarRegStart(evento: any) { evento.editandoRegStart = false; await this.guardarCampo(evento); }

  editarRegEnd(evento: any) { evento.editandoRegEnd = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarRegEnd(evento: any) { evento.editandoRegEnd = false; await this.guardarCampo(evento); }

  editarLocation(evento: any) { evento.editandoLocation = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarLocation(evento: any) { evento.editandoLocation = false; await this.guardarCampo(evento); }

  private focusInput(selector: string) {
    setTimeout(() => {
      const input = document.querySelector(selector) as HTMLInputElement;
      if (input) input.focus();
    });
  }

  async guardarCampo(evento: any) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4001/api/events/update/${evento._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: evento.name,
          location: evento.location,
          eventDate: evento.eventDate,
          registrationDates: {
            start: evento.registrationDates?.start,
            end: evento.registrationDates?.end
          }
        })
      }
    );
  }

  ngAfterViewInit() {
    this.initAnimatedBg();
  }

  initAnimatedBg() {
    const canvas = document.getElementById('gestion-eventos-bg-canvas') as HTMLCanvasElement;
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
      { color: '#ff1a1a', width: 2.8, speed: 0.00035, phase: Math.random() * Math.PI * 2, offset: 0.12 },
      { color: '#fff', width: 2.5, speed: 0.00028, phase: Math.random() * Math.PI * 2, offset: 0.32 },
      { color: '#ff1a1a', width: 2.6, speed: 0.00022, phase: Math.random() * Math.PI * 2 + 1, offset: 0.55 },
      { color: '#fff', width: 2.7, speed: 0.00018, phase: Math.random() * Math.PI * 2 + 2, offset: 0.75 },
      { color: '#ff1a1a', width: 2.5, speed: 0.00017, phase: Math.random() * Math.PI * 2 + 3, offset: 0.9 },
      { color: '#fff', width: 2.9, speed: 0.00013, phase: Math.random() * Math.PI * 2 + 4, offset: 0.6 }
    ];
    function drawCurvedLine(ctx: CanvasRenderingContext2D, color: string, width: number, t: number, phase: number, offset: number, speed: number) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = color === '#fff' ? 0.52 : 0.62;
      ctx.beginPath();
      const amplitude = 220 + 90 * Math.sin(t/60 + phase + offset*2);
      const freq = 2.2 + 0.7 * Math.cos(t/80 + phase + offset*2);
      for (let y = 0; y <= canvas.height; y += 2) {
        const x = (canvas.width * offset) + Math.sin(y / 80 + t * speed + phase) * amplitude * Math.sin(y / 120 + t * speed * freq);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowColor = color;
      ctx.shadowBlur = color === '#fff' ? 22 : 28;
      ctx.stroke();
      ctx.restore();
    }
    let t = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        drawCurvedLine(ctx, l.color, l.width, t, l.phase, l.offset, l.speed);
      });
      t += 0.25;
      requestAnimationFrame(animate);
    }
    animate();
  }
}
