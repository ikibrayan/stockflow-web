import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  protected post<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.post<TResponse>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  protected put<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}