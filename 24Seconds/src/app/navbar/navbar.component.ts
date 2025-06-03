import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink, RouterLinkActive],
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  cartOpen = false;
  cartCount = 0;
  cart: any = null;
  private cartSub: Subscription | undefined;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCart();
    this.cartSub = this.cartService.cartUpdated$.subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  async loadCart() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const cart = await this.cartService.getCart(token);
      this.cart = cart;
      this.cartCount = cart && cart.items ? cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;
    } catch (e: any) {
      // Si el backend responde 404 (carrito no existe), mostrar vacío
      this.cart = { items: [], totalPrice: 0 };
      this.cartCount = 0;
    }
  }

  async openCart() {
    this.cartOpen = true;
    await this.loadCart();
  }

  closeCart() {
    this.cartOpen = false;
  }

  onUserClick() {
    this.menuOpen = false;
    window.location.href = '/perfil';
  }

  async removeItem(productId: string) {
    const token = localStorage.getItem('token');
    if (!token) return;
    await this.cartService.removeFromCart(productId, token);
    await this.loadCart();
  }

  async confirmarCompra() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await this.cartService.checkoutCart(token);
      if (res && res.sessionUrl) {
        window.location.href = res.sessionUrl;
      } else {
        alert(res.message || 'Error al iniciar el pago');
      }
    } catch (e) {
      alert('Error al conectar con la pasarela de pago');
    }
  }

  scrollToEventos(event: Event) {
    event.preventDefault();
    this.menuOpen = false;
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        const el = document.querySelector('app-eventos');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    });
  }

  goToEventosInscripcion(event: Event) {
    event.preventDefault();
    window.location.href = '/eventos/inscripcion';
  }

  isEventosActive(): boolean {
    return window.location.pathname === '/eventos/inscripcion';
  }
}
