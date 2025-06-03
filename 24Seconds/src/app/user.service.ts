import { Injectable } from '@angular/core';
import { API_URL } from './api-url';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${API_URL}/user`;

  async addHoopCoins(amount: number, token: string) {
    const res = await fetch(this.apiUrl + '/hoopcoins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });
    return await res.json();
  }
}
