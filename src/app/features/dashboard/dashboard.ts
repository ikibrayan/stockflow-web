import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { InventoryMovement } from '../inventory/inventory.types';
import { Product } from '../products/products.types';
import { Sale } from '../sales/sales.types';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly totalProducts = signal(0);
  readonly totalCustomers = signal(0);
  readonly totalSales = signal(0);
  readonly lowStockProducts = signal<Product[]>([]);
  readonly recentSales = signal<Sale[]>([]);
  readonly recentMovements = signal<InventoryMovement[]>([]);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardService.getDashboardData().subscribe({
      next: data => {
        this.totalProducts.set(data.totalProducts);
        this.totalCustomers.set(data.totalCustomers);
        this.totalSales.set(data.totalSales);
        this.lowStockProducts.set(data.lowStockProducts);
        this.recentSales.set(data.recentSales);
        this.recentMovements.set(data.recentMovements);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load dashboard data.');
        this.isLoading.set(false);
      }
    });
  }
}