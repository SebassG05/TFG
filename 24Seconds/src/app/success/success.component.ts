import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { UserService } from '../user.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [NgIf],
  styleUrls: ['./success.component.css'],
  templateUrl: './success.component.html',
  providers: [UserService]
})
export class SuccessComponent implements OnInit {
  hoopCoins = 0;
  private awarded = false;

  constructor(private cartService: CartService, private userService: UserService, private router: Router) {}

  async ngOnInit() {
    const token = localStorage.getItem('token');
    const totalStr = localStorage.getItem('lastOrderTotal');
    const total = totalStr ? parseFloat(totalStr) : 0;
    if (token) {
      await this.cartService.clearCart(token);
      this.cartService.notifyCartUpdated();
      if (!this.awarded && total > 0) {
        const res = await this.userService.addHoopCoins(total, token);
        if (res && res.coinsAdded) {
          this.hoopCoins = res.coinsAdded;
          this.awarded = true;
        }
      }
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
