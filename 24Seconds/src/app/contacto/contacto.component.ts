import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  imports: [FormsModule, NgIf, FooterComponent]
})
export class ContactoComponent {
  sugerencia: string = '';
  email: string = '';
  enviado: boolean = false;
  error: string = '';

  async enviarSugerencia() {
    this.error = '';
    if (!this.sugerencia || this.sugerencia.trim().length < 3) {
      this.error = 'La sugerencia debe tener al menos 3 caracteres.';
      return;
    }
    try {
      const res = await fetch('https://tfg-z7pz.onrender.com/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, mensaje: this.sugerencia })
      });
      if (res.ok) {
        this.enviado = true;
        setTimeout(() => {
          this.enviado = false;
          this.sugerencia = '';
          this.email = '';
        }, 3000);
      } else {
        const data = await res.json();
        this.error = data?.message || 'Error al enviar sugerencia.';
      }
    } catch (e) {
      this.error = 'No se pudo conectar con el servidor.';
    }
  }
}
