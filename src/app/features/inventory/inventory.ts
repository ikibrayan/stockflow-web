import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../products/product.service';
import { Product } from '../products/products.types';
import { InventoryAdjustmentForm } from './components/inventory-adjustment-form/inventory-adjustment-form';
import { InventoryEntryForm } from './components/inventory-entry-form/inventory-entry-form';
import { InventoryService } from './inventory.service';
import { CreateInventoryAdjustmentRequest, CreateInventoryEntryRequest, InventoryAdjustmentFormValue, InventoryEntryFormValue, InventoryMovement } from './inventory.types';

type InventoryFormMode='entry'|'adjustment'|null;

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [DatePipe, InventoryEntryForm, InventoryAdjustmentForm],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class Inventory implements OnInit {
  private readonly inventoryService=inject(InventoryService);
  private readonly productService=inject(ProductService);
  private readonly authService=inject(AuthService);
  readonly movements=signal<InventoryMovement[]>([]);
  readonly products=signal<Product[]>([]);
  readonly selectedProductId=signal(0);
  readonly formMode=signal<InventoryFormMode>(null);
  readonly isLoading=signal(true);
  readonly isSubmitting=signal(false);
  readonly errorMessage=signal<string|null>(null);
  readonly successMessage=signal<string|null>(null);
  readonly canManageInventory=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager';
  });

  ngOnInit():void{
    this.loadInitialData();
  }

  openEntryForm():void{
    this.clearMessages();
    this.formMode.set('entry');
  }

  openAdjustmentForm():void{
    this.clearMessages();
    this.formMode.set('adjustment');
  }

  closeForm():void{
    if(this.isSubmitting()) return;
    this.formMode.set(null);
  }

  filterByProduct(productId:number):void{
    const id=Number(productId);

    this.selectedProductId.set(id);
    this.errorMessage.set(null);

    if(id===0){
      this.loadMovements();
      return;
    }

    this.isLoading.set(true);

    this.inventoryService.getProductMovements(id).subscribe({
      next:movements=>{
        this.movements.set(movements);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load product movements.');
        this.isLoading.set(false);
      }
    });
  }

  saveEntry(value:InventoryEntryFormValue):void{
    const request:CreateInventoryEntryRequest={
      productId:value.productId,
      quantity:value.quantity,
      reference:value.reference
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.inventoryService.createEntry(request).subscribe({
      next:()=>{
        this.successMessage.set('Stock entry registered successfully.');
        this.finishOperation();
      },
      error:()=>{
        this.errorMessage.set('Unable to register stock entry.');
        this.isSubmitting.set(false);
      }
    });
  }

  saveAdjustment(value:InventoryAdjustmentFormValue):void{
    const request:CreateInventoryAdjustmentRequest={
      productId:value.productId,
      newStock:value.newStock,
      reference:value.reference
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.inventoryService.createAdjustment(request).subscribe({
      next:()=>{
        this.successMessage.set('Inventory adjusted successfully.');
        this.finishOperation();
      },
      error:()=>{
        this.errorMessage.set('Unable to adjust inventory.');
        this.isSubmitting.set(false);
      }
    });
  }

  private finishOperation():void{
    this.isSubmitting.set(false);
    this.formMode.set(null);
    this.selectedProductId.set(0);
    this.loadInitialData(false);
  }

  private loadInitialData(showLoading=true):void{
    if(showLoading) this.isLoading.set(true);

    this.productService.getProducts().subscribe({
      next:products=>{
        this.products.set(products);
        this.loadMovements();
      },
      error:()=>{
        this.errorMessage.set('Unable to load inventory data.');
        this.isLoading.set(false);
      }
    });
  }

  private loadMovements():void{
    this.inventoryService.getMovements().subscribe({
      next:movements=>{
        this.movements.set(movements);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load inventory movements.');
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages():void{
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}