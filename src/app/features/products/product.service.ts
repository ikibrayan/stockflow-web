import { Injectable } from '@angular/core';
import { BaseApiService } from '../../core/services/base-api.service';
import {CreateProductRequest, Product, UpdateProductRequest} from './products.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService {
  getProducts() {
    return this.get<Product[]>('/api/products');
  }

  getProduct(id: number) {
    return this.get<Product>(`/api/products/${id}`);
  }

  createProduct(request: CreateProductRequest) {
    return this.post<Product, CreateProductRequest>(
      '/api/products',
      request
    );
  }

  updateProduct(id: number, request: UpdateProductRequest) {
    return this.put<Product, UpdateProductRequest>(
      `/api/products/${id}`,
      request
    );
  }
}