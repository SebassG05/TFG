import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  imports: [NgFor, FooterComponent]
})
export class EventosComponent {
  images = [
    'assets/evento1.png',
    'assets/evento2.png',
    'assets/evento3.png',
    'assets/evento4.png',
    'assets/evento5.png',
    // ...agrega más rutas de imágenes si lo deseas
  ];
  currentIndex = 0;
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  private startX = 0;
  private scrollLeft = 0;
  private isDown = false;

  constructor(private router: Router) {}

  onMouseDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.startX = this.getX(e) - this.sliderRef.nativeElement.offsetLeft;
    this.scrollLeft = this.sliderRef.nativeElement.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = this.getX(e) - this.sliderRef.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.2; // scroll-fast
    this.sliderRef.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  getX(e: MouseEvent | TouchEvent): number {
    if (e instanceof MouseEvent) return e.pageX;
    return e.touches[0].pageX;
  }

  irAInscripcion() {
    this.router.navigate(['/eventos/inscripcion']);
  }
}
