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
        <img [src]="images[current]" alt="Imagen carrusel" />
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
    'assets/logo.png',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
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
}
