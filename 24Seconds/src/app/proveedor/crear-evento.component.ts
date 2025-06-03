import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CrearEventoComponent implements AfterViewInit {
  eventoForm: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.eventoForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      hasStands: [false, Validators.required],
      registrationStart: ['', Validators.required],
      registrationEnd: ['', Validators.required],
      eventDate: ['', Validators.required],
      img: [null, Validators.required]
    });
  }

  ngAfterViewInit() {
    this.initStarsBg();
  }

  initStarsBg() {
    const canvas = document.createElement('canvas');
    canvas.id = 'stars-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    let ctx = canvas.getContext('2d');
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
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.eventoForm.patchValue({ img: file });
      // No preview
    }
  }

  submit() {
    if (this.eventoForm.valid) {
      const formData = new FormData();
      formData.append('name', this.eventoForm.get('name')?.value);
      formData.append('description', this.eventoForm.get('description')?.value);
      formData.append('location', this.eventoForm.get('location')?.value);
      formData.append('hasStands', this.eventoForm.get('hasStands')?.value);
      formData.append('registrationDates[start]', this.eventoForm.get('registrationStart')?.value);
      formData.append('registrationDates[end]', this.eventoForm.get('registrationEnd')?.value);
      formData.append('eventDate', this.eventoForm.get('eventDate')?.value);
      formData.append('img', this.eventoForm.get('img')?.value);

      fetch('https://tfg-z7pz.onrender.com/api/events/create', {
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
        alert('Evento creado correctamente');
        this.eventoForm.reset();
        this.imagenPreview = null;
      })
      .catch(err => {
        alert('Error al crear evento: ' + err.message);
      });
    }
  }
}
