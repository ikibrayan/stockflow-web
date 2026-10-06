import { Injectable } from '@angular/core';
import { BaseApiService } from '../../core/services/base-api.service';
import {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest
} from './customers.types';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseApiService {
  getCustomers() {
    return this.get<Customer[]>('/api/customers');
  }

  getCustomer(id: number) {
    return this.get<Customer>(`/api/customers/${id}`);
  }

  createCustomer(request: CreateCustomerRequest) {
    return this.post<Customer, CreateCustomerRequest>(
      '/api/customers',
      request
    );
  }

  updateCustomer(id: number, request: UpdateCustomerRequest) {
    return this.put<Customer, UpdateCustomerRequest>(
      `/api/customers/${id}`,
      request
    );
  }
}