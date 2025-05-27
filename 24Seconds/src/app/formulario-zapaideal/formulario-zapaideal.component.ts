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
  zapatillaIdeal: string | null = null;
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

  finalizarTest() {
    this.showResult = true;
  }

  onSubmit() {
    // Aquí se llamaría a la IA o lógica para obtener la zapatilla ideal
    // Por ahora, solo mostramos un resultado de ejemplo
    this.zapatillaIdeal = 'Ejemplo de Zapatilla Ideal';
    this.showResult = true;
  }
}
