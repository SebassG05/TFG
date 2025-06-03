import { Component, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-formulario-zapaideal',
  standalone: true,
  templateUrl: './formulario-zapaideal.component.html',
  styleUrls: ['./formulario-zapaideal.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FormularioZapaidealComponent implements AfterViewInit {
  preguntas = [
    { texto: '¿Para qué tipo de uso buscas las zapatillas?', opciones: ['Pista cubierta', 'Pista exterior', 'Ambas', 'Aún no lo sé'] },
    { texto: '¿Qué tipo de jugador eres?', opciones: ['Base', 'Alero', 'Pívot', 'Ala-pívot'] },
    { texto: '¿Qué color prefieres?', opciones: ['Blanco', 'Negro', 'Colorido', 'Otro'] },
    { texto: '¿Qué rango de precio buscas?', opciones: ['<50€', '50-100€', '100-150€', '>150€'] },
    { texto: '¿Qué marca prefieres?', opciones: ['Nike', 'Adidas', 'Puma', 'Sin preferencia'] }
  ];
  respuestas: string[] = [];
  showResult = false;
  zapatillaIdeal: any = null;
  preguntaActual = 0;
  mainImageIndex: number = 0;
  hoverResultado: boolean = false;
  private cartService = inject(CartService);

  seleccionarOpcion(opcion: string) {
    this.respuestas[this.preguntaActual] = opcion;
  }

  siguientePregunta() {
    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual++;
    } else {
      this.finalizarTest();
    }
  }

  async finalizarTest() {
    // Obtener todas las zapatillas
    const res = await fetch('https://tfg-z7pz.onrender.com/api/products/search');
    let zapatillas = [];
    if (res.ok) {
      zapatillas = await res.json();
    }
    // Llamar a la IA real en el backend
    const iaRes = await fetch('https://tfg-z7pz.onrender.com/api/ia/recomendar-zapatilla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuestas: this.respuestas, zapatillas })
    });
    let recomendada = null;
    if (iaRes.ok) {
      recomendada = await iaRes.json(); // Se espera que devuelva el objeto zapatilla
    }
    this.zapatillaIdeal = recomendada;
    this.mainImageIndex = 0;
    this.showResult = true;
  }

  setMainImage(idx: number) {
    this.mainImageIndex = idx;
  }

  async addToCart(productId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    try {
      await this.cartService.addToCart(productId, 1, token);
      this.cartService.notifyCartUpdated();
      alert('Producto añadido al carrito');
    } catch (e) {
      alert('Error al añadir al carrito');
    }
  }

  matchPrecio(precio: number, rango: string): boolean {
    if (rango === '<50€') return precio < 50;
    if (rango === '50-100€') return precio >= 50 && precio <= 100;
    if (rango === '100-150€') return precio > 100 && precio <= 150;
    if (rango === '>150€') return precio > 150;
    return true;
  }

  onSubmit() {
    // Aquí se llamaría a la IA o lógica para obtener la zapatilla ideal
    // Por ahora, solo mostramos un resultado de ejemplo
    this.zapatillaIdeal = 'Ejemplo de Zapatilla Ideal';
    this.showResult = true;
  }

  ngAfterViewInit() {
    // Lanza confeti cuando se muestra el resultado
    const observer = new MutationObserver(() => {
      if (this.showResult) {
        this.launchConfetti();
      }
    });
    const target = document.querySelector('.zapaideal-resultado');
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  }

  launchConfetti() {
    const canvasId = 'confetti-canvas';
    let canvas = document.getElementById(canvasId) as HTMLDivElement;
    if (!canvas) return;
    // Limpia confeti anterior
    canvas.innerHTML = '';
    // Simple confetti effect (puedes mejorar con una librería si lo deseas)
    for (let i = 0; i < 80; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'absolute';
      conf.style.width = '12px';
      conf.style.height = '18px';
      conf.style.background = `hsl(${Math.random()*360},90%,60%)`;
      conf.style.left = Math.random()*100 + '%';
      conf.style.top = '-40px';
      conf.style.opacity = '0.85';
      conf.style.borderRadius = '3px';
      conf.style.transform = `rotate(${Math.random()*360}deg)`;
      conf.style.transition = 'top 1.7s cubic-bezier(.4,1.3,.6,1), opacity 0.7s';
      setTimeout(() => {
        conf.style.top = (60 + Math.random()*30) + '%';
        conf.style.opacity = '0';
      }, 30);
      canvas.appendChild(conf);
    }
    setTimeout(() => { if (canvas) canvas.innerHTML = ''; }, 2200);
  }
}
