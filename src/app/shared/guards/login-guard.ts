import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Location } from '@angular/common';
import { from, map } from 'rxjs';
import { AuthService } from '../../auth/store/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {

  const authSrv = inject(AuthService);
  const location = inject(Location);

  // Check if user is already loaded in memory to avoid async call
  const currentUser = authSrv.user();
  
  if (currentUser) {
    return handleLoginRedirection(authSrv, location, state.url);
  }

  // Only load from storage if user is not in memory
  return from(authSrv.loadUserFromStorage()).pipe(
    map(() => handleLoginRedirection(authSrv, location, state.url))
  );
};

/**
 * Handle login redirection based on user authentication status
 * 
 * @param authSrv 
 * @param location 
 * @param url 
 * @returns {boolean}
 */
function handleLoginRedirection(authSrv: AuthService, location: Location, url: string): boolean {
  if (authSrv.isLoggedIn() && url === '/auth') {
    location.back();
  }
  return !authSrv.isLoggedIn();
}
