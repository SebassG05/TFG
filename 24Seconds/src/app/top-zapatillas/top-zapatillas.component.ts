import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-top-zapatillas',
  standalone: true,
  templateUrl: './top-zapatillas.component.html',
  styleUrls: ['./top-zapatillas.component.css'],
  imports: [NgFor, NgIf, RouterModule]
})
export class TopZapatillasComponent {
  zapatillas: any[] = [];
  mainImageIndexes: number[] = [];
  private cartService = inject(CartService);

  async ngOnInit() {
    // Llama a la API para obtener las más votadas, pero si no hay votos, muestra las 4 primeras
    try {
      const res = await fetch('http://localhost:4001/api/products/top');
      if (res.ok) {
        const data = await res.json();
        // Si hay menos de 4, pide todos los productos y muestra los primeros 4
        if (data.length >= 4) {
          this.zapatillas = data.slice(0, 4);
        } else {
          const resAll = await fetch('http://localhost:4001/api/products/search');
          if (resAll.ok) {
            const all = await resAll.json();
            this.zapatillas = all.slice(0, 4);
          }
        }
      }
    } catch (e) {
      this.zapatillas = [];
    }
    // Inicializa el índice de imagen principal para cada zapatilla
    this.mainImageIndexes = this.zapatillas.map(() => 0);
  }

  setMainImage(zapatillaIdx: number, imgIdx: number) {
    this.mainImageIndexes[zapatillaIdx] = imgIdx;
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
}

// Aquí podrías importar el nuevo componente si lo quieres usar en rutas hijas o lazy loading
