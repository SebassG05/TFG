import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function roleGuardFactory(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); // Guarda el rol aquí al hacer login
    if (!token || !userData) {
      window.location.href = '/home';
      return false;
    }
    try {
      const user = JSON.parse(userData);
      if (allowedRoles.includes(user.role)) {
        return true;
      } else {
        window.location.href = '/home';
        return false;
      }
    } catch {
      window.location.href = '/home';
      return false;
    }
  };
}

// Ejemplo de uso en rutas:
// canActivate: [roleGuardFactory(['admin'])] para rutas de admin
// canActivate: [roleGuardFactory(['proveedor'])] para rutas de proveedor
// canActivate: [roleGuardFactory(['user', 'admin', 'proveedor'])] para rutas generales
