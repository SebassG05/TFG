import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ZapatillaService } from '../../zapatilla.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-votacion',
  standalone: true,
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class VotacionComponent implements OnInit {
  zapatillas: any[] = [];
  hasVotedToday = false;
  votos: { [key: string]: number } = {};
  chart: any;
  userId: string | null = null;
  private zapatillaService = inject(ZapatillaService);

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
      const res = await fetch('http://localhost:4001/api/auth/profile', {
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
      this.zapatillas = data;
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
    if (this.hasVotedToday) return;
    this.zapatillaService.votar(zapaId).subscribe(() => {
      this.hasVotedToday = true;
      this.getVotos();
      if (this.userId) {
        localStorage.setItem('votoHoy_' + this.userId, new Date().toDateString());
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
    const ctx = (document.getElementById('votacionChart') as HTMLCanvasElement).getContext('2d');
    const isSmall = window.innerWidth <= 820;
    this.chart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: this.zapatillas.map(z => z.name),
        datasets: [{
          label: 'Votos',
          data: this.zapatillas.map(z => this.votos[z._id] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
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
}
