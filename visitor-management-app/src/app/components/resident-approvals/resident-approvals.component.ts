import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { VisitorRecord } from '../../models/visitor.model';
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

  get flatOwnerMobileNumber(): string {
    return this.authService.currentUser()?.username ?? '';
  }

  get visitorsForCurrentResident(): VisitorRecord[] {
    const mobileNumber = this.normalizeMobileNumber(this.flatOwnerMobileNumber);
    if (!mobileNumber) {
      return [];
    }

    return this.visitorService
      .visitors()
      .filter(
        (visitor) => this.normalizeMobileNumber(visitor.residentMobileNumber ?? '') === mobileNumber
      );
  }

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

  private normalizeMobileNumber(value: string): string {
    return value.replace(/\D/g, '');
  }
}
