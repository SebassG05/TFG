import { Component, AfterViewInit } from '@angular/core';
import AOS from 'aos';
import { CrearProductoComponent } from './crear-producto.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
  imports: [NgIf, CrearProductoComponent],
})
export class ProveedorComponent implements AfterViewInit {
  mostrarCrearProducto = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    AOS.init({ once: true });
  }

  irACrearProducto() {
    this.router.navigate(['/proveedor/crear-producto']);
  }
}
