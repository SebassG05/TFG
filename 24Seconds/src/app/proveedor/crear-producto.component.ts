import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements AfterViewInit {
  producto = {
    name: '',
    brand: '',
    sizeMin: null,
    sizeMax: null,
    color: '',
    price: null,
    stock: null,
    category: '',
    images: [] as File[]
  };
  loading = false;
  successMsg = '';
  errorMsg = '';
  mainImageIndex = 0;

  ngAfterViewInit() {
    this.initStarsBg();
  }

  initStarsBg() {
    const canvas = document.getElementById('stars-bg') as HTMLCanvasElement;
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    const numStars = Math.floor((window.innerWidth * window.innerHeight) / 1800);
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.4,
      dx: (Math.random() - 0.5) * 0.08,
      dy: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.7 + 0.3,
      fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1)
    }));
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        if (!ctx) continue;
        s.opacity += s.fadeSpeed;
        if (s.opacity > 1) {
          s.opacity = 1;
          s.fadeSpeed *= -1;
        }
        if (s.opacity < 0.15) {
          s.opacity = 0.15;
          s.fadeSpeed *= -1;
          // Opcional: reposicionar la estrella para más dinamismo
          s.x = Math.random() * canvas.width;
          s.y = Math.random() * canvas.height;
        }
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }

  onFileChange(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 4) as File[];
      this.producto.images = files;
    }
  }

  removeImage(index: number) {
    this.producto.images.splice(index, 1);
    if (this.mainImageIndex >= this.producto.images.length) {
      this.mainImageIndex = 0;
    }
  }

  setMainImage(index: number) {
    this.mainImageIndex = index;
  }

  getImagePreview(file: File): string | undefined {
    if (!file) return undefined;
    // Soluciona ExpressionChangedAfterItHasBeenCheckedError usando un objeto URL seguro
    if (!(file as any)._previewUrl) {
      (file as any)._previewUrl = URL.createObjectURL(file);
    }
    return (file as any)._previewUrl;
  }

  async crearProducto() {
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    const formData = new FormData();
    // Asegura que los campos numéricos se envíen como string (para backend FormData)
    for (const key in this.producto) {
      if (key !== 'images') {
        let value = (this.producto as any)[key];
        if (["sizeMin", "sizeMax", "price", "stock"].includes(key)) {
          if (value === null || value === '' || isNaN(Number(value))) {
            this.errorMsg = 'Completa todos los campos numéricos';
            this.loading = false;
            return;
          }
          value = Number(value).toString(); // fuerza string y previene NaN
        }
        formData.append(key, value);
      }
    }
    // Ordenar imágenes: la principal primero
    const orderedImages = [...this.producto.images];
    if (orderedImages.length > 1 && this.mainImageIndex > 0) {
      const [mainImg] = orderedImages.splice(this.mainImageIndex, 1);
      orderedImages.unshift(mainImg);
    }
    orderedImages.forEach(img => formData.append('images', img));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://tfg-z7pz.onrender.com/api/products/create', {
        method: 'POST',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        this.successMsg = 'Producto creado correctamente';
        this.producto = { name: '', brand: '', sizeMin: null, sizeMax: null, color: '', price: null, stock: null, category: '', images: [] };
        this.mainImageIndex = 0;
      } else {
        // Mostrar errores de validación del backend si existen
        if (data.errors && Array.isArray(data.errors)) {
          this.errorMsg = data.errors.map((e: any) => e.message).join(' | ');
        } else {
          this.errorMsg = data.message || 'Error al crear producto';
        }
      }
    } catch (e) {
      this.errorMsg = 'Error de red o servidor';
    }
    this.loading = false;
  }
}
