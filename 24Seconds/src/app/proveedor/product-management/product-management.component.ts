import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, FormsModule]
})
export class ProductManagementComponent implements OnInit {
  productos: any[] = [];
  show = true;

  constructor(public router: Router) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:4001/api/products/mis-productos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const productos = await res.json();
      console.log('Productos recibidos:', productos); // DEBUG
      this.productos = productos;
    } else {
      this.productos = [];
    }
  }

  async eliminarProducto(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4001/api/products/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      this.productos = this.productos.filter(p => p._id !== id);
    } else {
      alert('Error al eliminar el producto');
    }
  }

  actualizarProducto(producto: any) {
    this.router.navigate(['/proveedor/actualizar-producto', producto._id]);
  }

  editarImg(producto: any) { producto.editandoImg = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarImg(producto: any) { producto.editandoImg = false; await this.guardarCampo(producto); }

  editarNombre(producto: any) { producto.editandoNombre = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarNombre(producto: any) { producto.editandoNombre = false; await this.guardarCampo(producto); }

  editarPrecio(producto: any) { producto.editandoPrecio = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarPrecio(producto: any) { producto.editandoPrecio = false; await this.guardarCampo(producto); }

  editarCategoria(producto: any) { producto.editandoCategoria = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarCategoria(producto: any) { producto.editandoCategoria = false; await this.guardarCampo(producto); }

  editarStock(producto: any) { producto.editandoStock = true; setTimeout(() => this.focusInput('.edit-input')); }
  async guardarStock(producto: any) { producto.editandoStock = false; await this.guardarCampo(producto); }

  abrirSelectorImagen(producto: any, event: Event) {
    const tr = (event.target as HTMLElement).closest('tr');
    if (!tr) return;
    const input: HTMLInputElement | null = tr.querySelector('input[type=file]');
    if (input) input.click();
  }

  async onImagenSeleccionada(event: any, producto: any) {
    const file = event.target.files[0];
    if (!file) return;
    // Opcional: feedback visual de carga
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    // Puedes tener un endpoint específico para subir imagen, aquí se asume update
    const res = await fetch(`http://localhost:4001/api/products/update/${producto._id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const updated = await res.json();
      producto.images[0] = updated.images[0];
    } else {
      // feedback de error
    }
  }

  private focusInput(selector: string) {
    setTimeout(() => {
      const input = document.querySelector(selector) as HTMLInputElement;
      if (input) input.focus();
    });
  }

  async guardarCampo(producto: any) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4001/api/products/update/${producto._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: producto.name,
        brand: producto.brand,
        size: producto.size,
        color: producto.color,
        price: producto.price,
        stock: producto.stock,
        category: producto.category,
        images: producto.images
      })
    });
  }
}
