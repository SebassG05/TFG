import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:4001/api/cart';
  cartUpdated$ = new Subject<void>();

  async getCart(token: string) {
    const res = await fetch(this.apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  }

  async addToCart(productId: string, quantity: number, token: string) {
    const res = await fetch(this.apiUrl + '/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    return await res.json();
  }

  async removeFromCart(productId: string, token: string) {
    const res = await fetch(this.apiUrl + '/remove/' + productId, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }

  async clearCart(token: string) {
    const res = await fetch(this.apiUrl + '/clear', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }

  async checkoutCart(token: string) {
    const res = await fetch('http://localhost:4001/api/payments/create', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data && data.total) {
      localStorage.setItem('lastOrderTotal', data.total.toString());
    }
    return data;
  }

  notifyCartUpdated() {
    this.cartUpdated$.next();
  }
}
