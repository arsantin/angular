import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

/**
 * Protects the /dashboard route by checking for an auth token in localStorage.
 * If a token exists the guard allows navigation, otherwise it redirects to /login
 * and preserves the attempted URL in the `returnUrl` query param.
 */
export const dashboardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  // Try common token keys used in apps. Adjust the key name if your app uses a
  // different storage key (for example 'authToken' or 'access_token').
  const token = localStorage.getItem('token_angular') || null;

  if (!token) {
    // Not authenticated -> redirect to login and preserve return URL
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  // Server-side validation: POST the token to an auth validation endpoint.
  // NOTE: Adjust the URL to match your backend. Many apps use `/api/auth/validate`
  // or `/auth/validate`. The endpoint should return { valid: boolean }.
  return http.post<{ token: string }>('http://localhost:3000/auth/validate', { token }).pipe(
    map((res) => {
      console.log('validation response', res);
      return res && res.token
        ? true
        : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }),
    catchError(() =>
      of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })),
    ),
  );
};
