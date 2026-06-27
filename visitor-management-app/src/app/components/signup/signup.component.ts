import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type UserRole = 'Security' | 'Resident';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username = '';
  password = '';
  confirmPassword = '';
  role: UserRole = 'Security';
  message: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  signup(): void {
    if (!this.username || !this.password) {
      this.message = 'Please enter a username and password.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    const result = this.authService.signup(this.username.trim(), this.password, this.role);
    if (!result) {
      this.message = 'That username is already taken. Please choose another username.';
      return;
    }

    this.message = 'Account created successfully. Please sign in.';
    this.router.navigate(['/login']);
  }
}
