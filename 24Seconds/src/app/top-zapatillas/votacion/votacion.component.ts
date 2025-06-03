import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ZapatillaService } from '../../zapatilla.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificacionService } from '../../notificacion.service';
import { FooterComponent } from "../../footer/footer.component";
import { API_URL } from '../../api-url';

@Component({
  selector: 'app-votacion',
  standalone: true,
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css'],
  imports: [CommonModule, HttpClientModule, FooterComponent]
})
export class VotacionComponent implements OnInit {
  zapatillas: any[] = [];
  hasVotedToday = false;
  votos: { [key: string]: number } = {};
  chart: any;
  userId: string | null = null;
  paginaActual = 1;
  zapatillasPorPagina = 5;
  private zapatillaService = inject(ZapatillaService);
  private notificacionService = inject(NotificacionService);

  constructor() {
    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.loadUserId();
    this.getZapatillas();
    this.checkVotoHoy();
  }

  async loadUserId() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        this.userId = user._id || user.id || user.email;
      }
    } catch {}
  }

  getZapatillas() {
    this.zapatillaService.getAll().subscribe((data: any[]) => {
      // Filtrar solo productos con category === 'shoe'
      this.zapatillas = data.filter((p: any) => p.category && p.category.toLowerCase() === 'shoe');
      this.getVotos();
    });
  }

  getVotos() {
    this.zapatillaService.getVotos().subscribe((votos: any) => {
      this.votos = votos;
      this.renderChart();
    });
  }

  votar(zapaId: string) {
    if (this.hasVotedToday) {
      this.notificacionService.mostrar({ mensaje: 'Ya has votado hoy. ¡Vuelve mañana!', tipo: 'info' });
      return;
    }
    // Validar que el id es un string válido de MongoDB (24 caracteres hexadecimales)
    if (!zapaId || typeof zapaId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(zapaId)) {
      this.notificacionService.mostrar({ mensaje: 'ID de producto inválido', tipo: 'error' });
      return;
    }
    // Asegurarse de que el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      this.notificacionService.mostrar({ mensaje: 'Debes iniciar sesión para votar', tipo: 'error' });
      return;
    }
    this.zapatillaService.votar(zapaId).subscribe({
      next: () => {
        this.hasVotedToday = true;
        this.getVotos();
        if (this.userId) {
          localStorage.setItem('votoHoy_' + this.userId, new Date().toDateString());
        }
        this.notificacionService.mostrar({ mensaje: '¡Voto registrado! Gracias por participar.', tipo: 'success' });
      },
      error: err => {
        let msg = 'Error al registrar el voto';
        if (err && err.error && err.error.message) {
          msg += ': ' + err.error.message;
        }
        this.notificacionService.mostrar({ mensaje: msg, tipo: 'error' });
        console.error('Error al votar:', err);
      }
    });
  }

  checkVotoHoy() {
    if (this.userId) {
      const votoHoy = localStorage.getItem('votoHoy_' + this.userId);
      this.hasVotedToday = votoHoy === new Date().toDateString();
    } else {
      this.hasVotedToday = false;
    }
  }

  renderChart() {
    if (this.chart) this.chart.destroy();
    // Ordenar por votos descendente y tomar las 4 más votadas
    const zapatillasConVotos = this.zapatillas.map(z => ({...z, votos: this.votos[z._id] || 0}));
    const top4 = zapatillasConVotos.sort((a, b) => b.votos - a.votos).slice(0, 4);
    const colores = [
      'rgba(255, 26, 106, 0.8)', // rosa fuerte
      'rgb(34, 130, 255)',  // naranja
      'rgba(0, 212, 255, 0.8)',  // azul claro
      'rgba(80, 68, 255, 0.8)' // amarillo pastel
    ];
    const ctx = (document.getElementById('votacionChart') as HTMLCanvasElement).getContext('2d');
    const isSmall = window.innerWidth <= 820;
    this.chart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: top4.map(z => z.name),
        datasets: [{
          label: 'Votos',
          data: top4.map(z => z.votos),
          backgroundColor: colores.slice(0, top4.length),
          borderRadius: 8
        }]
      },
      options: {
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: {
            display: !isSmall,
            ticks: { display: !isSmall }
          }
        }
      }
    });
  }

  get zapatillasPaginadas() {
    const start = (this.paginaActual - 1) * this.zapatillasPorPagina;
    return this.zapatillas.slice(start, start + this.zapatillasPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.zapatillas.length / this.zapatillasPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }
}
