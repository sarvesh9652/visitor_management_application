import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VisitorService } from '../../services/visitor.service';

@Component({
  selector: 'app-resident-approvals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resident-approvals.component.html',
  styleUrl: './resident-approvals.component.css'
})
export class ResidentApprovalsComponent {
  constructor(
    public readonly visitorService: VisitorService,
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  approve(id: string): void {
    this.visitorService.updateStatus(id, 'Approved');
  }

  deny(id: string): void {
    this.visitorService.updateStatus(id, 'Denied');
  }

  expire(id: string): void {
    this.visitorService.markExpired(id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
