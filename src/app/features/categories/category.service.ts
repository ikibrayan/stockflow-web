import { Injectable } from '@angular/core';
import { BaseApiService } from '../../core/services/base-api.service';
import {Category, CreateCategoryRequest, UpdateCategoryRequest} from './categories.types';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseApiService {
  getCategories() {
    return this.get<Category[]>('/api/categories');
  }

  getCategory(id: number) {
    return this.get<Category>(`/api/categories/${id}`);
  }

  createCategory(request: CreateCategoryRequest) {
    return this.post<Category, CreateCategoryRequest>(
      '/api/categories',
      request
    );
  }

  updateCategory(id: number, request: UpdateCategoryRequest) {
    return this.put<Category, UpdateCategoryRequest>(
      `/api/categories/${id}`,
      request
    );
  }
}