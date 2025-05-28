import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VotacionComponent } from '../top-zapatillas/votacion/votacion.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-votation-toprated',
  standalone: true,
  templateUrl: './votation-toprated.component.html',
  styleUrls: ['./votation-toprated.component.css'],
  imports: [CommonModule, VotacionComponent, HttpClientModule]
})
export class VotationTopratedComponent {
  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/']);
  }
}
