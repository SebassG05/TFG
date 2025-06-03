import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="carousel-container">
      <button class="carousel-arrow left" (click)="prev()">&#10094;</button>
      <div class="carousel-slide">
        <img [src]="images[current]" alt="Imagen carrusel" (click)="goToProductos()" style="cursor:pointer;" />
      </div>
      <button class="carousel-arrow right" (click)="next()">&#10095;</button>
      <div class="carousel-dots">
        <span *ngFor="let img of images; let i = index" [class.active]="i === current" (click)="goTo(i)"></span>
      </div>
    </div>
  `,
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  images = [
    'assets/carrusel2.png',
    'assets/carrusel3.png',
    'assets/carrusel4.png',
    'assets/carrusel5.png',
    'assets/carrusel7.png',
    'assets/carrusel9.gif',

    ...(this.isMobile() ? [] : ['assets/carrusel6.png'])
  ];
  current = 0;
  interval: any;

  constructor() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.interval = setInterval(() => this.next(), 4000);
  }
  stopAutoSlide() {
    clearInterval(this.interval);
  }
  next() {
    this.current = (this.current + 1) % this.images.length;
  }
  prev() {
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }
  goTo(i: number) {
    this.current = i;
  }
  goToProductos() {
    window.location.href = '/productos';
  }
  isMobile(): boolean {
    return window.innerWidth <= 700;
  }
}
