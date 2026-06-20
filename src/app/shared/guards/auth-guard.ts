import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { from, map } from 'rxjs';
import { AuthService } from '../../auth/store/auth.service';

export const authGuard: CanActivateFn = (route, state) => {  

  const authSrv = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'];

  // Check if user is already loaded in memory to avoid async call
  const currentUser = authSrv.user();  
  
  if (currentUser) {
    return handleUserAuthorization(currentUser, expectedRoles, router);
  }
  
  // Only load from storage if user is not in memory
  return from(authSrv.loadUserFromStorage()).pipe(
    map(user => handleUserAuthorization(user, expectedRoles, router))
  );
  
};

/**
 * Handle user authorization based on roles
 * 
 * @param user 
 * @param expectedRoles 
 * @param router 
 * @returns {boolean | UrlTree}
*/
function handleUserAuthorization(user: any, expectedRoles: string[] | undefined, router: Router): boolean | UrlTree {
  if (user) {
    return !expectedRoles || expectedRoles.includes(user.role);
  } else {
    return router.parseUrl('/login');
  }
}
