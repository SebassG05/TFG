import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balon-sueno',
  standalone: true,
  templateUrl: './balon-sueno.component.html',
  styleUrls: ['./balon-sueno.component.css']
})
export class BalonSuenoComponent {
  constructor(private router: Router) {}

  irACreacionBalon() {
    this.router.navigate(['/creacionbalon']);
  }
}
