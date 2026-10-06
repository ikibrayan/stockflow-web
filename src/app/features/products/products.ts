import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/categories.types';
import { ProductForm } from './components/product-form/product-form';
import { ProductService } from './product.service';
import { CreateProductRequest, Product, ProductFormValue, UpdateProductRequest } from './products.types';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, ProductForm],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private readonly productService=inject(ProductService);
  private readonly categoryService=inject(CategoryService);
  private readonly authService=inject(AuthService);
  readonly products=signal<Product[]>([]);
  readonly categories=signal<Category[]>([]);
  readonly selectedProduct=signal<Product|null>(null);
  readonly isLoading=signal(true);
  readonly isSubmitting=signal(false);
  readonly isFormOpen=signal(false);
  readonly errorMessage=signal<string|null>(null);
  readonly successMessage=signal<string|null>(null);
  readonly canManageProducts=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager';
  });

  ngOnInit():void{
    this.loadProducts();
    this.loadCategories();
  }

  openCreateForm():void{
    this.selectedProduct.set(null);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  openEditForm(product:Product):void{
    this.selectedProduct.set(product);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  closeForm():void{
    if(this.isSubmitting()) return;
    this.isFormOpen.set(false);
    this.selectedProduct.set(null);
  }

  saveProduct(value:ProductFormValue):void{
    const product=this.selectedProduct();

    if(product){
      this.updateProduct(product.id,value);
      return;
    }

    this.createProduct(value);
  }

  private createProduct(value:ProductFormValue):void{
    const request:CreateProductRequest={
      name:value.name,
      sku:value.sku,
      description:value.description,
      price:value.price,
      stock:value.stock,
      minimumStock:value.minimumStock,
      categoryId:value.categoryId
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.productService.createProduct(request).subscribe({
      next:()=>{
        this.successMessage.set('Product created successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to create product.');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateProduct(id:number,value:ProductFormValue):void{
    const request:UpdateProductRequest={
      name:value.name,
      sku:value.sku,
      description:value.description,
      price:value.price,
      stock:value.stock,
      minimumStock:value.minimumStock,
      categoryId:value.categoryId,
      isActive:value.isActive
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.productService.updateProduct(id,request).subscribe({
      next:()=>{
        this.successMessage.set('Product updated successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to update product.');
        this.isSubmitting.set(false);
      }
    });
  }

  private finishSave():void{
    this.isSubmitting.set(false);
    this.isFormOpen.set(false);
    this.selectedProduct.set(null);
    this.loadProducts();
  }

  private loadProducts():void{
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next:products=>{
        this.products.set(products);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load products.');
        this.isLoading.set(false);
      }
    });
  }

  private loadCategories():void{
    this.categoryService.getCategories().subscribe({
      next:categories=>{
        this.categories.set(categories);
      },
      error:()=>{
        this.errorMessage.set('Unable to load categories.');
      }
    });
  }

  private clearMessages():void{
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}