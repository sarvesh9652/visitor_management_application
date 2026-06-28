import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResidentInput, ResidentService } from '../../services/resident.service';

@Component({
  selector: 'app-resident-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resident-master.component.html',
  styleUrl: './resident-master.component.css'
})
export class ResidentMasterComponent {
  form: ResidentInput = {
    name: '',
    buildingNumber: '',
    mobileNumber: ''
  };
  message: string | null = null;

  constructor(
    public readonly residentService: ResidentService,
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  addResident(): void {
    this.residentService.addResident({
      name: this.form.name.trim(),
      buildingNumber: this.form.buildingNumber.trim(),
      mobileNumber: this.form.mobileNumber.trim()
    });

    this.message = `${this.form.name} added to resident master.`;
    this.form = {
      name: '',
      buildingNumber: '',
      mobileNumber: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
