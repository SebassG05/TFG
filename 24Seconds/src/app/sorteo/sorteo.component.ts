import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css'],
  imports: [NgFor]
})
export class SorteoComponent implements OnInit {
  sorteoImg: string[] = ['assets/sorteo1.png', 'assets/sorteo2.png']; // Asegúrate de que los archivos existen en assets

  constructor(private router: Router) {}

  ngOnInit(): void {}

  irAInscripcion() {
    this.router.navigate(['/inscripcion-sorteos']);
  }
}
