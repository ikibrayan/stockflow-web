import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { ApiService } from '../services/api.service';
import { AuthResponse } from './models/auth-response.model';
import { LoginRequest } from './models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly storageKey = 'stockflow_auth';

  private readonly authState = signal<AuthResponse | null>(
    this.loadStoredSession()
  );

  readonly currentUser = computed(() => this.authState());

  readonly isAuthenticated = computed(() => {
    const session = this.authState();

    if (!session) {
      return false;
    }

    return new Date(session.expiresAt).getTime() > Date.now();
  });

  readonly role = computed(() => this.authState()?.role ?? null);

  login(credentials: LoginRequest) {
    return this.api
      .post<AuthResponse, LoginRequest>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          sessionStorage.setItem(
            this.storageKey,
            JSON.stringify(response)
          );

          this.authState.set(response);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.authState.set(null);
  }

  getToken(): string | null {
    return this.authState()?.token ?? null;
  }

  private loadStoredSession(): AuthResponse | null {
    const storedSession = sessionStorage.getItem(this.storageKey);

    if (!storedSession) {
      return null;
    }

    try {
      const session = JSON.parse(storedSession) as AuthResponse;

      if (new Date(session.expiresAt).getTime() <= Date.now()) {
        sessionStorage.removeItem(this.storageKey);
        return null;
      }

      return session;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }
}