import { Injectable } from '@angular/core';
import { BaseApiService } from '../../core/services/base-api.service';
import {CreateSaleRequest, Sale} from './sales.types';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseApiService {
  getSales() {
    return this.get<Sale[]>('/api/sales');
  }

  getSale(id: number) {
    return this.get<Sale>(`/api/sales/${id}`);
  }

  createSale(request: CreateSaleRequest) {
    return this.post<Sale, CreateSaleRequest>(
      '/api/sales',
      request
    );
  }
}