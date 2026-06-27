import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

type UserRole = 'Security' | 'Resident';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as UserRole | undefined;
  const routeRole = requiredRole ?? (state.url.includes('resident-approvals') ? 'Resident' : 'Security');

  if (!auth.isAuthenticated) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (!auth.hasRole(routeRole)) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
