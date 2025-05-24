import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historia-card',
  templateUrl: './historia-card.component.html',
  styleUrls: ['./historia-card.component.css'],
  standalone: true
})
export class HistoriaCardComponent {
  constructor(private router: Router) {}

  irAHistoria() {
    this.router.navigate(['/historia']);
  }
}
