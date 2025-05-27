import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zapa-ideal',
  standalone: true,
  templateUrl: './zapa.component.html',
  styleUrls: ['./zapa.component.css']
})
export class ZapaIdealComponent {
  constructor(private router: Router) {}

  irAFormularioZapaIdeal() {
    this.router.navigate(['/zapasideales']);
  }
}
