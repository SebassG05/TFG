import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class AuthModalComponent implements OnDestroy {
  activeTab: 'login' | 'register' = 'login';
  show = true;
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  newsletter = false;
  terms = false;
  role: 'user' | 'admin' | 'proveedor' = 'user';
  adminPassword = '';
  proveedorData = '';
  showForgotPassword = false;
  forgotEmail = '';
  waitingApproval = false;
  proveedorApprovalStatus: 'pending' | 'approved' | 'rejected' | null = null;
  proveedorId: string | null = null;
  private approvalInterval: any;

  constructor(private router: Router) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  close() {
    this.show = false;
  }

  async login() {
    const body: any = { email: this.email, password: this.password };
    if (this.role === 'admin') body.adminPassword = this.adminPassword;
    try {
      const res = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
      localStorage.setItem('token', data.token); // Guardar el token para autenticación
      // Redirección según el rol devuelto por el backend
      if (data.role === 'admin') this.router.navigate(['/admin']);
      else if (data.role === 'proveedor') this.router.navigate(['/proveedor']);
      else this.router.navigate(['/home']);
      this.close();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async register() {
    const body: any = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };
    if (this.role === 'admin') body.adminPassword = this.adminPassword;
    if (this.role === 'proveedor') body.proveedorData = this.proveedorData;
    try {
      const res = await fetch('http://localhost:4001/api/auth/register', {
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
        alert(data.message || 'Registro exitoso');
        this.close();
      }
    } catch (err: any) {
      alert(err.message);
    }
  }

  startApprovalPolling() {
    if (!this.proveedorId) return;
    this.approvalInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:4001/api/auth/proveedor-status/${this.proveedorId}`);
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
      const res = await fetch('http://localhost:4001/api/auth/forgot-password', {
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
