// Componente de listado y filtrado de productos
import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificacionService } from '../notificacion.service';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  imports: [NgFor, NgIf, FormsModule, RouterModule, FooterComponent]
})
export class ProductosComponent {
  productos: any[] = [];
  filtros = {
    nombre: '',
    marca: '',
    categoria: '',
    precioMin: null as number | null,
    precioMax: null as number | null
  };
  cargando = false;
  mainImageIndexes: number[] = [];

  private notiSrv = inject(NotificacionService);

  async ngOnInit() {
    await this.cargarProductos();
    this.mainImageIndexes = this.productos.map(() => 0);
  }

  async cargarProductos(filtrar = false) {
    this.cargando = true;
    let url = 'http://localhost:4001/api/products/search?';
    if (filtrar) {
      if (this.filtros.nombre) url += `name=${encodeURIComponent(this.filtros.nombre)}&`;
      if (this.filtros.marca) url += `brand=${encodeURIComponent(this.filtros.marca)}&`;
      if (this.filtros.categoria) url += `category=${encodeURIComponent(this.filtros.categoria)}&`;
      if (this.filtros.precioMin != null) url += `priceMin=${this.filtros.precioMin}&`;
      if (this.filtros.precioMax != null) url += `priceMax=${this.filtros.precioMax}&`;
    }
    const res = await fetch(url);
    this.productos = res.ok ? await res.json() : [];
    this.cargando = false;
  }

  filtrar() {
    this.cargarProductos(true);
  }

  limpiarFiltros() {
    this.filtros = { nombre: '', marca: '', categoria: '', precioMin: null, precioMax: null };
    this.cargarProductos();
  }

  setMainImage(idx: number, imgIdx: number) {
    this.mainImageIndexes[idx] = imgIdx;
  }

  async addToCart(productId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notiSrv.mostrar({ mensaje: 'Debes iniciar sesión para añadir productos al carrito', tipo: 'warning' });
      return;
    }
    try {
      const res = await fetch('http://localhost:4001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (res.ok) {
        this.notiSrv.mostrar({ mensaje: 'Producto añadido al carrito', tipo: 'success' });
      } else {
        this.notiSrv.mostrar({ mensaje: 'Error al añadir al carrito', tipo: 'error' });
      }
    } catch (e) {
      this.notiSrv.mostrar({ mensaje: 'Error al añadir al carrito', tipo: 'error' });
    }
  }
}
