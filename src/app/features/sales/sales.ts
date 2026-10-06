import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CustomerService } from '../customers/customer.service';
import { Customer } from '../customers/customers.types';
import { ProductService } from '../products/product.service';
import { Product } from '../products/products.types';
import { SaleForm } from './components/sale-form';
import { SaleService } from './sale.service';
import { CreateSaleRequest, Sale, SaleFormValue } from './sales.types';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, SaleForm],
  templateUrl: './sales.html',
  styleUrl: './sales.scss'
})
export class Sales implements OnInit {
  private readonly saleService=inject(SaleService);
  private readonly customerService=inject(CustomerService);
  private readonly productService=inject(ProductService);
  private readonly authService=inject(AuthService);
  readonly sales=signal<Sale[]>([]);
  readonly customers=signal<Customer[]>([]);
  readonly products=signal<Product[]>([]);
  readonly isLoading=signal(true);
  readonly isSubmitting=signal(false);
  readonly isFormOpen=signal(false);
  readonly errorMessage=signal<string|null>(null);
  readonly successMessage=signal<string|null>(null);
  readonly canViewSales=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager';
  });

  readonly canCreateSales=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager'||role==='Seller';
  });

  ngOnInit():void{
    this.loadData();
  }

  openCreateForm():void{
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  closeForm():void{
    if(this.isSubmitting()) return;
    this.isFormOpen.set(false);
  }

  saveSale(value:SaleFormValue):void{
    const request:CreateSaleRequest={
      customerId:value.customerId,
      items:value.items.map(item=>({
        productId:item.productId,
        quantity:item.quantity
      }))
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.saleService.createSale(request).subscribe({
      next:()=>{
        this.isSubmitting.set(false);
        this.isFormOpen.set(false);
        this.successMessage.set('Sale created successfully.');
        this.loadData();
      },
      error:()=>{
        this.errorMessage.set('Unable to create sale.');
        this.isSubmitting.set(false);
      }
    });
  }

  private loadData():void{
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const salesRequest=this.canViewSales()
      ?this.saleService.getSales()
      :of<Sale[]>([]);

    forkJoin({
      sales:salesRequest,
      customers:this.customerService.getCustomers(),
      products:this.productService.getProducts()
    }).subscribe({
      next:data=>{
        this.sales.set(data.sales);
        this.customers.set(data.customers);
        this.products.set(data.products);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load sales data.');
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages():void{
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}