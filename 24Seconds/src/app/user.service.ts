import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:4001/api/user';

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
