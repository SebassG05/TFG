import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { NotificacionService } from '../../notificacion.service';
import { API_URL } from '../../api-url';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit, AfterViewInit {
  productos: any[] = [];
  paginaActual: number = 1;
  productosPorPagina: number = 5;
  isMobile = false;
  expandedIndex: number | null = null;

  constructor(private notificacionService: NotificacionService) {}

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

  ngOnInit() {
    this.isMobile = window.innerWidth <= 700;
    this.productosPorPagina = this.isMobile ? 6 : 5;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 700;
      this.productosPorPagina = this.isMobile ? 6 : 5;
    });
    this.cargarProductos();
  }

  toggleExpand(idx: number) {
    this.expandedIndex = this.expandedIndex === idx ? null : idx;
  }

  async cargarProductos() {
    const token = localStorage.getItem('token');
    // Obtener productos y poblar el proveedor
    const res = await fetch(`${API_URL}/products/search`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (res.ok) {
      // Pide que venga el proveedor poblado
      const productos = await res.json();
      this.productos = productos;
      // Si los productos no traen el proveedor poblado, hacer fetch extra
      if (productos.length && productos[0].proveedor && typeof productos[0].proveedor === 'string') {
        // Hacer fetch de proveedores y mapear
        const usersRes = await fetch(`${API_URL}/admin/usuarios`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (usersRes.ok) {
          const usuarios = await usersRes.json();
          this.productos = productos.map((p: any) => {
            const prov = usuarios.find((u: any) => u._id === p.proveedor);
            return { ...p, proveedor: prov };
          });
        }
      }
    } else {
      this.productos = [];
    }
  }

  async eliminarProducto(id: string) {
    this.notificacionService.mostrar({
      mensaje: '¿Seguro que quieres eliminar este producto?',
      tipo: 'confirm',
      accion: {
        texto: 'Eliminar',
        callback: async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/products/delete/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (res.ok) {
            this.productos = this.productos.filter(p => p._id !== id);
            this.notificacionService.mostrar({ mensaje: 'Producto eliminado correctamente', tipo: 'success' });
          } else {
            this.notificacionService.mostrar({ mensaje: 'Error al eliminar el producto', tipo: 'error' });
          }
        }
      }
    });
  }

  getProveedorNombre(producto: any): string {
    if (producto.proveedor && typeof producto.proveedor === 'object') {
      return producto.proveedor.empresa || producto.proveedor.username || '-';
    }
    return '-';
  }

  ngAfterViewInit() {
    this.initFondoAnimado();
  }

  initFondoAnimado() {
    const canvas = document.getElementById('fondoAnimadoAdmin') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    // Líneas curvas animadas (fluctuando arriba y abajo lentamente)
    const lines = [
      { color: '#ff1a1a', width: 2.8, baseY: 0.35, amp: 3.5, freq: 4.1, speed: 0.045, phase: 0 },
      { color: '#fff', width: 2.5, baseY: 0.55, amp: 3.2, freq: 3.7, speed: 0.035, phase: 1.2 },
      { color: '#ff1a1a', width: 2.6, baseY: 0.65, amp: 3.8, freq: 4.5, speed: 0.027, phase: 2.1 },
      { color: '#fff', width: 2.7, baseY: 0.80, amp: 3.4, freq: 3.9, speed: 0.021, phase: 2.8 },
    ];
    function drawCurvedLine(ctx: CanvasRenderingContext2D, color: string, width: number, t: number, baseY: number, amp: number, freq: number, speed: number, phase: number) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      // Movimiento vertical global lento
      const yOffset = Math.sin(t * speed + phase) * (canvas.height / 12);
      for (let x = 0; x <= canvas.width; x += 4) {
        const percent = x / canvas.width;
        const y = canvas.height * baseY + Math.sin(percent * freq * Math.PI + phase) * (canvas.height / amp) + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    let t = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        drawCurvedLine(ctx, l.color, l.width, t, l.baseY, l.amp, l.freq, l.speed, l.phase);
      });
      t += 0.25;
      requestAnimationFrame(animate);
    }
    animate();
  }
}
