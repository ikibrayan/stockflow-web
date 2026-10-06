import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { Customer } from '../customers/customers.types';
import { InventoryMovement } from '../inventory/inventory.types';
import { Product } from '../products/products.types';
import { Sale } from '../sales/sales.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  getDashboardData() {
    return forkJoin({
      products: this.get<Product[]>('/api/products'),
      customers: this.get<Customer[]>('/api/customers'),
      sales: this.get<Sale[]>('/api/sales'),
      movements: this.get<InventoryMovement[]>('/api/inventory/movements')
    }).pipe(
      map(({ products, customers, sales, movements }) => ({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalSales: sales.length,

        lowStockProducts: products
          .filter(product => product.stock <= product.minimumStock)
          .slice(0, 5),

        recentSales: [...sales]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .slice(0, 5),

        recentMovements: [...movements]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .slice(0, 5)
      }))
    );
  }
}