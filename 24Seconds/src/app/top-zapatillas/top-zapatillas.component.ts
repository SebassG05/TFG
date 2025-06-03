import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { NotificacionService } from '../notificacion.service';

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
  private notiSrv = inject(NotificacionService);

  async ngOnInit() {
    // Llama a la API para obtener las más votadas, pero si no hay votos, muestra las 4 primeras SOLO de zapatillas
    try {
      const res = await fetch('https://tfg-z7pz.onrender.com/api/products/top');
      if (res.ok) {
        let data = await res.json();
        // Filtrar solo zapatillas (por category === 'shoe')
        data = data.filter((p: any) => p.category && p.category.toLowerCase() === 'shoe');
        if (data.length >= 4) {
          this.zapatillas = data.slice(0, 4);
        } else {
          const resAll = await fetch('https://tfg-z7pz.onrender.com/api/products/search');
          if (resAll.ok) {
            let all = await resAll.json();
            all = all.filter((p: any) => p.category && p.category.toLowerCase() === 'shoe');
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
      this.notiSrv.mostrar({ mensaje: 'Debes iniciar sesión para añadir productos al carrito', tipo: 'warning' });
      return;
    }
    try {
      await this.cartService.addToCart(productId, 1, token);
      this.cartService.notifyCartUpdated();
      this.notiSrv.mostrar({ mensaje: 'Producto añadido al carrito', tipo: 'success' });
    } catch (e) {
      this.notiSrv.mostrar({ mensaje: 'Error al añadir al carrito', tipo: 'error' });
    }
  }
}

// Aquí podrías importar el nuevo componente si lo quieres usar en rutas hijas o lazy loading
