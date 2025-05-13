import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class ProductManagementComponent implements OnInit, AfterViewInit {
  productos: any[] = [];
  show = true;
  paginaActual = 1;
  productosPorPagina = 5;

  constructor(public router: Router) {}

  get productosPaginados() {
    const start = (this.paginaActual - 1) * this.productosPorPagina;
    return this.productos.slice(start, start + this.productosPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.productos.length / this.productosPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

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
    this.paginaActual = 1;
  }

  ngAfterViewInit() {
    this.initAnimatedBg();
  }

  initAnimatedBg() {
    const canvas = document.getElementById('gestion-bg-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    // Líneas curvas animadas (rojo y blanco más vivos, mucho más lentas)
    const lines = [
      { color: '#ff1a1a', width: 2.8, speed: 0.00035, phase: Math.random() * Math.PI * 2, offset: 0.12 },
      { color: '#fff', width: 2.5, speed: 0.00028, phase: Math.random() * Math.PI * 2, offset: 0.32 },
      { color: '#ff1a1a', width: 2.6, speed: 0.00022, phase: Math.random() * Math.PI * 2 + 1, offset: 0.55 },
      { color: '#fff', width: 2.7, speed: 0.00018, phase: Math.random() * Math.PI * 2 + 2, offset: 0.75 },
      { color: '#ff1a1a', width: 2.5, speed: 0.00017, phase: Math.random() * Math.PI * 2 + 3, offset: 0.9 },
      { color: '#fff', width: 2.9, speed: 0.00013, phase: Math.random() * Math.PI * 2 + 4, offset: 0.6 }
    ];
    function drawCurvedLine(ctx: CanvasRenderingContext2D, color: string, width: number, t: number, phase: number, offset: number, speed: number) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = color === '#fff' ? 0.52 : 0.62;
      ctx.beginPath();
      const amplitude = 220 + 90 * Math.sin(t / 60 + phase + offset * 2);
      const freq = 2.2 + 0.7 * Math.cos(t / 80 + phase + offset * 2);
      for (let y = 0; y <= canvas.height; y += 2) {
        const x = (canvas.width * offset) + Math.sin(y / 80 + t * speed + phase) * amplitude * Math.sin(y / 120 + t * speed * freq);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowColor = color;
      ctx.shadowBlur = color === '#fff' ? 22 : 28;
      ctx.stroke();
      ctx.restore();
    }
    let t = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        drawCurvedLine(ctx, l.color, l.width, t, l.phase, l.offset, l.speed);
      });
      t += 0.25; // Mucho más lento
      requestAnimationFrame(animate);
    }
    animate();
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
