import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  message: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  login(): void {
    if (!this.username || !this.password) {
      this.message = 'Enter both username and password.';
      return;
    }

    const success = this.authService.login(this.username.trim(), this.password);
    if (!success) {
      this.message = 'Invalid credentials. Please try again.';
      return;
    }

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      (this.authService.currentRole === 'Security' ? '/security-desk' : '/resident-approvals');
    this.router.navigateByUrl(returnUrl);
  }
}
