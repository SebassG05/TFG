import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-sorteo',
  templateUrl: './crear-sorteo.component.html',
  styleUrls: ['./crear-sorteo.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CrearSorteoComponent implements AfterViewInit {
  sorteoForm: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.sorteoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      expirationDate: ['', Validators.required],
      hoopCoinsCost: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  ngAfterViewInit() {
    this.initParticlesBg();
  }

  initParticlesBg() {
    const canvas = document.getElementById('particles-bg') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    // Configuración de partículas
    const colors = ['#bfa14a', '#ff00cc', '#00eaff', '#fff', '#b266ff', '#ffb347'];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1.5,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3
    }));
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.sorteoForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.sorteoForm.valid) {
      const formData = new FormData();
      formData.append('title', this.sorteoForm.get('title')?.value);
      formData.append('description', this.sorteoForm.get('description')?.value);
      formData.append('expirationDate', this.sorteoForm.get('expirationDate')?.value);
      formData.append('hoopCoinsCost', this.sorteoForm.get('hoopCoinsCost')?.value);
      if (this.sorteoForm.get('image')?.value) {
        formData.append('image', this.sorteoForm.get('image')?.value);
      }
      fetch('http://localhost:4001/sorteos', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(() => {
        alert('Sorteo creado correctamente');
        this.router.navigate(['/proveedor']);
      })
      .catch(err => {
        alert('Error al crear sorteo: ' + err.message);
      });
    }
  }
}
