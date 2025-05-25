import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css'],
  imports: [NgFor]
})
export class SorteoComponent {
  sorteoImg: string[] = ['assets/sorteo1.png', 'assets/sorteo2.png']; // Asegúrate de que los archivos existen en assets
}
