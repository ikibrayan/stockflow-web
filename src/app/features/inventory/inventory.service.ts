import { Injectable } from '@angular/core';
import { BaseApiService } from '../../core/services/base-api.service';
import {
  CreateInventoryAdjustmentRequest,
  CreateInventoryEntryRequest,
  InventoryMovement
} from './inventory.types';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseApiService {
  getMovements() {
    return this.get<InventoryMovement[]>('/api/inventory/movements');
  }

  getProductMovements(productId: number) {
    return this.get<InventoryMovement[]>(
      `/api/inventory/movements/product/${productId}`
    );
  }

  createEntry(request: CreateInventoryEntryRequest) {
    return this.post<InventoryMovement, CreateInventoryEntryRequest>(
      '/api/inventory/entry',
      request
    );
  }

  createAdjustment(request: CreateInventoryAdjustmentRequest) {
    return this.post<InventoryMovement, CreateInventoryAdjustmentRequest>(
      '/api/inventory/adjustment',
      request
    );
  }
}