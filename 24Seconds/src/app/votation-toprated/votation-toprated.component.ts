import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votation-toprated',
  standalone: true,
  templateUrl: './votation-toprated.component.html',
  styleUrls: ['./votation-toprated.component.css']
})
export class VotationTopratedComponent {
  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/']);
  }
}
