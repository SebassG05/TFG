import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  template: `
    <div class="forgot-overlay">
      <div class="forgot-modal">
        <h3>Restablecer contraseña</h3>
        <form (submit)="resetPassword($event)">
          <label>Nueva contraseña</label>
          <input type="password" [(ngModel)]="newPassword" name="newPassword" required />
          <label>Confirmar nueva contraseña</label>
          <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required />
          <button class="auth-modal__main-btn" type="submit" style="width:100%;margin-top:1rem;">Restablecer</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./auth-modal/auth-modal.component.css', './reset-password.component.css'],
  imports: [FormsModule]
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  constructor(private route: ActivatedRoute, private router: Router) {}

  async resetPassword(event: Event) {
    event.preventDefault();
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      alert('Token inválido');
      return;
    }
    try {
      const res = await fetch(`http://localhost:4001/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: this.newPassword, confirmPassword: this.confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al restablecer la contraseña');
      alert('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
      this.router.navigate(['/home']);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
