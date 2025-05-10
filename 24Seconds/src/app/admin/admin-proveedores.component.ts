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
  styles: [`
    .proveedores-admin-container {
      max-width: 900px;
      margin: 3rem auto 0 auto;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10);
      padding: 2.5rem 2.5rem 2rem 2.5rem;
      min-height: 400px;
      position: relative;
    }
    .proveedores-title {
      font-size: 2.1rem;
      font-weight: 700;
      margin-bottom: 2.2rem;
      color: #23272f;
      text-align: center;
      letter-spacing: 1px;
    }
    .proveedores-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 1.5rem;
    }
    .proveedores-table th, .proveedores-table td {
      padding: 1.1rem 1.2rem;
      text-align: left;
      font-size: 1.08rem;
    }
    .proveedores-table th {
      background: #f4f6fa;
      font-weight: 700;
      color: #23272f;
      border-bottom: 2px solid #e5e7eb;
    }
    .proveedores-table tr {
      transition: background 0.18s;
    }
    .proveedores-table tbody tr:hover {
      background: #f1f5fb;
    }
    .btn-approve {
      background: linear-gradient(90deg, #ff3c00, #ff7b7b);
      color: #fff;
      border: none;
      border-radius: 7px;
      padding: 0.5rem 1.3rem;
      font-weight: 600;
      font-size: 1rem;
      margin-right: 0.7rem;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(255,60,0,0.08);
      transition: background 0.2s, box-shadow 0.2s;
    }
    .btn-approve:hover {
      background: linear-gradient(90deg, #d12e00, #ff3c00);
      box-shadow: 0 4px 16px rgba(255,60,0,0.13);
    }
    .btn-deny {
      background: #23272f;
      color: #fff;
      border: none;
      border-radius: 7px;
      padding: 0.5rem 1.3rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-deny:hover {
      background: #ff3c00;
      color: #fff;
    }
    .proveedores-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2.5rem;
      color: #888;
      font-size: 1.2rem;
    }
    .proveedores-empty-img {
      width: 90px;
      opacity: 0.13;
      margin-bottom: 1.2rem;
    }
  `]
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
