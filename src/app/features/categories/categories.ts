import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { CategoryForm } from './components/category-form';
import { CategoryService } from './category.service';
import { Category, CategoryFormValue, CreateCategoryRequest, UpdateCategoryRequest } from './categories.types';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoryForm],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {
  private readonly categoryService=inject(CategoryService);
  private readonly authService=inject(AuthService);
  readonly categories=signal<Category[]>([]);
  readonly selectedCategory=signal<Category|null>(null);
  readonly isLoading=signal(true);
  readonly isSubmitting=signal(false);
  readonly isFormOpen=signal(false);
  readonly errorMessage=signal<string|null>(null);
  readonly successMessage=signal<string|null>(null);
  readonly canManageCategories=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager';
  });

  ngOnInit():void {
    this.loadCategories();
  }

  openCreateForm():void {
    this.selectedCategory.set(null);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  openEditForm(category:Category):void {
    this.selectedCategory.set(category);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  closeForm():void {
    if(this.isSubmitting()) return;
    this.isFormOpen.set(false);
    this.selectedCategory.set(null);
  }

  saveCategory(value:CategoryFormValue):void {
    const category=this.selectedCategory();
    if(category){
      this.updateCategory(category.id,value);
      return;
    }
    this.createCategory(value);
  }

  private createCategory(value:CategoryFormValue):void {
    const request:CreateCategoryRequest={
      name:value.name,
      description:value.description
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.categoryService.createCategory(request).subscribe({
      next:()=>{
        this.successMessage.set('Category created successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to create category.');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateCategory(id:number,value:CategoryFormValue):void {
    const request:UpdateCategoryRequest={
      name:value.name,
      description:value.description,
      isActive:value.isActive
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.categoryService.updateCategory(id,request).subscribe({
      next:()=>{
        this.successMessage.set('Category updated successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to update category.');
        this.isSubmitting.set(false);
      }
    });
  }

  private finishSave():void {
    this.isSubmitting.set(false);
    this.isFormOpen.set(false);
    this.selectedCategory.set(null);
    this.loadCategories();
  }

  private loadCategories():void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.categoryService.getCategories().subscribe({
      next:categories=>{
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load categories.');
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages():void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}