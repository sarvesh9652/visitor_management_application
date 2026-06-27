import { Routes } from '@angular/router';
import { ResidentApprovalsComponent } from './components/resident-approvals/resident-approvals.component';
import { SecurityDeskComponent } from './components/security-desk/security-desk.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'security-desk',
    component: SecurityDeskComponent,
    canActivate: [authGuard],
    data: { role: 'Security' }
  },
  {
    path: 'resident-approvals',
    component: ResidentApprovalsComponent,
    canActivate: [authGuard],
    data: { role: 'Resident' }
  }
];
