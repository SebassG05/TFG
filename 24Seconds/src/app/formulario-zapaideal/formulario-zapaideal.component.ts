import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-zapaideal',
  standalone: true,
  templateUrl: './formulario-zapaideal.component.html',
  styleUrls: ['./formulario-zapaideal.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FormularioZapaidealComponent {
  preguntas = [
    { texto: '¿Para qué tipo de uso buscas las zapatillas?', opciones: ['Pista cubierta', 'Pista exterior', 'Ambas', 'Parque'] },
    { texto: '¿Qué color prefieres?', opciones: ['Blanco', 'Negro', 'Colorido', 'Otro'] },
    { texto: '¿Qué rango de precio buscas?', opciones: ['<50€', '50-100€', '100-150€', '>150€'] },
    { texto: '¿Qué marca prefieres?', opciones: ['Nike', 'Adidas', 'Puma', 'Sin preferencia'] }
  ];
  respuestas: string[] = [];
  showResult = false;
  zapatillaIdeal: any = null;
  preguntaActual = 0;

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
    const res = await fetch('http://localhost:4001/api/products/search');
    let zapatillas = [];
    if (res.ok) {
      zapatillas = await res.json();
    }
    // Llamar a la IA real en el backend
    const iaRes = await fetch('http://localhost:4001/api/ia/recomendar-zapatilla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuestas: this.respuestas, zapatillas })
    });
    let recomendada = null;
    if (iaRes.ok) {
      recomendada = await iaRes.json(); // Se espera que devuelva el objeto zapatilla
    }
    this.zapatillaIdeal = recomendada;
    this.showResult = true;
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
}
