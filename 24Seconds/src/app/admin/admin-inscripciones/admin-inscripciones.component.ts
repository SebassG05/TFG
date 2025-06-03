import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-inscripciones',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './admin-inscripciones.component.html',
  styleUrls: ['./admin-inscripciones.component.css']
})
export class AdminInscripcionesComponent implements OnInit {
  vista: 'eventos' | 'sorteos' = 'eventos';
  inscripcionesEventos: any[] = [];
  inscripcionesSorteos: any[] = [];
  cargando = false;
  paginaActual = 1;
  inscripcionesPorPagina = 5;
  totalPaginasEventos = 1;
  totalPaginasSorteos = 1;
  expandedIndex: number | null = null;

  get inscripcionesEventosPaginadas() {
    const start = (this.paginaActual - 1) * this.inscripcionesPorPagina;
    return this.inscripcionesEventos.slice(start, start + this.inscripcionesPorPagina);
  }
  get inscripcionesSorteosPaginadas() {
    const start = (this.paginaActual - 1) * this.inscripcionesPorPagina;
    return this.inscripcionesSorteos.slice(start, start + this.inscripcionesPorPagina);
  }

  toggleExpand(idx: number) {
    this.expandedIndex = this.expandedIndex === idx ? null : idx;
  }

  cambiarPagina(delta: number) {
    if (this.vista === 'eventos') {
      const nueva = this.paginaActual + delta;
      if (nueva >= 1 && nueva <= this.totalPaginasEventos) this.paginaActual = nueva;
    } else {
      const nueva = this.paginaActual + delta;
      if (nueva >= 1 && nueva <= this.totalPaginasSorteos) this.paginaActual = nueva;
    }
    this.expandedIndex = null;
  }

  cambiarVista(v: 'eventos' | 'sorteos') {
    this.vista = v;
    this.paginaActual = 1;
    this.expandedIndex = null;
    this.cargarInscripciones();
  }

  ngOnInit() {
    this.cargarInscripciones();
    setTimeout(() => this.initFondoAnimado(), 0);
  }

  async cargarInscripciones() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    if (this.vista === 'eventos') {
      const res = await fetch('https://tfg-z7pz.onrender.com/api/admin/inscripciones/eventos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      this.inscripcionesEventos = res.ok ? await res.json() : [];
      this.totalPaginasEventos = Math.max(1, Math.ceil(this.inscripcionesEventos.length / this.inscripcionesPorPagina));
    } else {
      const res = await fetch('https://tfg-z7pz.onrender.com/api/admin/inscripciones/sorteos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      this.inscripcionesSorteos = res.ok ? await res.json() : [];
      this.totalPaginasSorteos = Math.max(1, Math.ceil(this.inscripcionesSorteos.length / this.inscripcionesPorPagina));
    }
    this.cargando = false;
  }

  initFondoAnimado() {
    const canvas = document.querySelector('.fondo-animado-admin') as HTMLCanvasElement;
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
}
