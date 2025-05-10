import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-proveedores',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="proveedores-admin-container">
      <h2 class="proveedores-title">Aprobar o Denegar Proveedores</h2>
      <table class="proveedores-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let proveedor of proveedores">
            <td>{{ proveedor.username }}</td>
            <td>{{ proveedor.email }}</td>
            <td>
              <button class="btn-approve" (click)="aprobarProveedor(proveedor._id)">Aprobar</button>
              <button class="btn-deny" (click)="denegarProveedor(proveedor._id)">Denegar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="proveedores.length === 0" class="proveedores-empty">
        <img src="/assets/logo.png" alt="Sin proveedores" class="proveedores-empty-img" />
        <p>No hay proveedores pendientes por aprobar.</p>
      </div>
    </div>
  `,
  styleUrls: ['./admin.proveedores.css'],
})
export class AdminProveedoresComponent implements OnInit {
  proveedores: any[] = [];

  ngOnInit() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4001/api/auth/proveedores-pendientes', {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          alert(error.message || 'Error al cargar proveedores');
          return [];
        }
        return res.json();
      })
      .then(data => this.proveedores = data || []);
  }

  aprobarProveedor(id: string) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4001/api/auth/approve-proveedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ proveedorId: id })
    })
      .then(res => res.json())
      .then(() => this.proveedores = this.proveedores.filter(p => p._id !== id));
  }

  denegarProveedor(id: string) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4001/api/auth/reject-proveedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ proveedorId: id })
    })
      .then(res => res.json())
      .then(() => this.proveedores = this.proveedores.filter(p => p._id !== id));
  }
}
