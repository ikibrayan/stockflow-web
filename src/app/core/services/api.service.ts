import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.post<TResponse>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  put<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}