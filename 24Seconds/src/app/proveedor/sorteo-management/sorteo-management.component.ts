import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sorteo-management',
  templateUrl: './sorteo-management.component.html',
  styleUrls: ['./sorteo-management.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule]
})
export class SorteoManagementComponent implements OnInit, AfterViewInit {
  sorteos: any[] = [];
  show = true;
  paginaActual = 1;
  sorteosPorPagina = 5;
  isMobile = false;
  expandedIndex = -1;

  constructor(public router: Router) {}

  get sorteosPaginados() {
    const start = (this.paginaActual - 1) * this.sorteosPorPagina;
    return this.sorteos.slice(start, start + this.sorteosPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.sorteos.length / this.sorteosPorPagina);
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
    const res = await fetch('https://tfg-z7pz.onrender.com/api/sorteos/mis-sorteos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const sorteos = await res.json();
      this.sorteos = sorteos;
    } else {
      this.sorteos = [];
    }
    this.paginaActual = 1;
  }

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 700;
  }

  async eliminarSorteo(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este sorteo?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`https://tfg-z7pz.onrender.com/api/sorteos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.sorteos = this.sorteos.filter(s => s._id !== id);
    } else {
      alert('Error al eliminar el sorteo');
    }
  }

  editarTitle(sorteo: any) {
    sorteo.editandoTitle = true;
    setTimeout(() => this.focusInput('.edit-input'));
  }

  async guardarTitle(sorteo: any) {
    sorteo.editandoTitle = false;
    await this.guardarCampo(sorteo);
  }

  editarExpirationDate(sorteo: any) {
    sorteo.editandoExpirationDate = true;
    setTimeout(() => this.focusInput('.edit-input'));
  }

  async guardarExpirationDate(sorteo: any) {
    sorteo.editandoExpirationDate = false;
    await this.guardarCampo(sorteo);
  }

  editarFinInscripcion(sorteo: any) {
    sorteo.editandoFinInscripcion = true;
    setTimeout(() => this.focusInput('.edit-input'));
  }

  async guardarFinInscripcion(sorteo: any) {
    sorteo.editandoFinInscripcion = false;
    await this.guardarCampo(sorteo);
  }

  editarHoopCoinsCost(sorteo: any) {
    sorteo.editandoHoopCoinsCost = true;
    setTimeout(() => this.focusInput('.edit-input'));
  }

  async guardarHoopCoinsCost(sorteo: any) {
    sorteo.editandoHoopCoinsCost = false;
    await this.guardarCampo(sorteo);
  }

  private focusInput(selector: string) {
    setTimeout(() => {
      const input = document.querySelector(selector) as HTMLInputElement;
      if (input) input.focus();
    });
  }

  async guardarCampo(sorteo: any) {
    const token = localStorage.getItem('token');
    await fetch(`https://tfg-z7pz.onrender.com/api/sorteos/${sorteo._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: sorteo.title,
          expirationDate: sorteo.expirationDate,
          hoopCoinsCost: sorteo.hoopCoinsCost
        })
      }
    );
  }

  ngAfterViewInit() {
    this.initAnimatedBg();
  }

  initAnimatedBg() {
    const canvas = document.getElementById('gestion-sorteos-bg-canvas') as HTMLCanvasElement;
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
