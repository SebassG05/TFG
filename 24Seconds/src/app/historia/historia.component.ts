import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historia',
  standalone: true,
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css'],
  imports: [
    FooterComponent
  ]
})
export class HistoriaComponent {
  constructor(private router: Router) {}

  irAMemorial() {
    this.router.navigate(['/coomingsoon']);
  }
}
