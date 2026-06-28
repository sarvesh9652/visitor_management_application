import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as UserRole | undefined;
  const routeRole = requiredRole ?? getRouteRole(state.url);

  if (!auth.isAuthenticated) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (!auth.hasRole(routeRole)) {
    return router.createUrlTree(['/login']);
  }

  return true;
};

function getRouteRole(url: string): UserRole {
  if (url.includes('resident-approvals')) {
    return 'Resident';
  }

  if (url.includes('resident-master')) {
    return 'Admin';
  }

  return 'Security';
}
