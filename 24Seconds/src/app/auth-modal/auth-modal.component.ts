import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Router } from '@angular/router';
import { API_URL } from '../api-url';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class AuthModalComponent implements OnInit, OnDestroy {
  activeTab: 'login' | 'register' = 'login';
  show = false; // Cambiar a false por defecto
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  newsletter = false;
  terms = false;
  proveedorData = '';
  showForgotPassword = false;
  forgotEmail = '';
  waitingApproval = false;
  proveedorApprovalStatus: 'pending' | 'approved' | 'rejected' | null = null;
  proveedorId: string | null = null;
  isProveedor = false;
  disableClose = false;
  private approvalInterval: any;
  private notiSrv = inject(NotificacionService);

  constructor(private router: Router) {}

  ngOnInit() {
    // Si hay un token en localStorage, no mostrar el modal
    const token = localStorage.getItem('token');
    if (token) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  close() {
    if (this.disableClose) return;
    this.show = false;
  }

  async login() {
    const body: any = { email: this.email, password: this.password };
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
      localStorage.setItem('token', data.token); // Guardar el token para autenticación
      localStorage.setItem('user', JSON.stringify({ role: data.role })); // Guardar el rol para el guard
      this.disableClose = false; // Permitir cerrar el modal tras login
      this.show = false; // Cerrar modal siempre tras login
      if (data.role === 'admin') this.router.navigate(['/admin']);
      else if (data.role === 'proveedor') this.router.navigate(['/proveedor']);
      else this.router.navigate(['/home']);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async register() {
    // Validación frontend de contraseña fuerte
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
    if (!passwordRegex.test(this.password)) {
      this.notiSrv.mostrar({
        mensaje: 'La contraseña debe tener al menos 6 caracteres, un número y un carácter especial.',
        tipo: 'error',
        duracion: 3500
      });
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.notiSrv.mostrar({
        mensaje: 'Las contraseñas no coinciden.',
        tipo: 'error',
        duracion: 3000
      });
      return;
    }
    const body: any = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    if (this.isProveedor) body.proveedorData = this.proveedorData;
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrarse');
      if (data.role === 'proveedor') {
        this.waitingApproval = true;
        this.proveedorId = data.proveedorId;
        this.proveedorApprovalStatus = 'pending';
        this.startApprovalPolling();
      } else {
        this.notiSrv.mostrar({
          mensaje: data.message || 'Registro exitoso',
          tipo: 'success',
          duracion: 2500
        });
        this.close();
      }
    } catch (err: any) {
      this.notiSrv.mostrar({
        mensaje: err.message,
        tipo: 'error',
        duracion: 3500
      });
    }
  }

  startApprovalPolling() {
    if (!this.proveedorId) return;
    this.approvalInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/auth/proveedor-status/${this.proveedorId}`);
        const data = await res.json();
        console.log('Proveedor status polling:', data); // DEBUG
        if (res.ok && data.status) {
          if (data.status === 'approved' || data.status === 'rejected') {
            this.proveedorApprovalStatus = data.status;
            clearInterval(this.approvalInterval);
          }
        }
      } catch (e) { console.error('Polling error', e); }
    }, 2500);
  }

  async forgotPassword() {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error enviando el correo');
      alert('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
      // No cierres el modal automáticamente
      // this.showForgotPassword = false;
    } catch (err: any) {
      alert(err.message);
    }
  }

  ngOnDestroy() {
    if (this.approvalInterval) clearInterval(this.approvalInterval);
  }
}
