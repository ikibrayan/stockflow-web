import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../categories/categories.types';
import { Product, ProductFormValue } from '../../products.types';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {
  private readonly fb=inject(FormBuilder);
  readonly product=input<Product|null>(null);
  readonly categories=input<Category[]>([]);
  readonly isSubmitting=input(false);
  readonly save=output<ProductFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.nonNullable.group({
    name:['',[Validators.required,Validators.maxLength(200)]],
    sku:['',[Validators.required,Validators.maxLength(100)]],
    description:[''],
    price:[0,[Validators.required,Validators.min(0.01)]],
    stock:[0,[Validators.required,Validators.min(0)]],
    minimumStock:[0,[Validators.required,Validators.min(0)]],
    categoryId:[0,[Validators.required,Validators.min(1)]],
    isActive:[true]
  });

  constructor(){
    effect(()=>{
      const product=this.product();

      if(product){
        this.form.patchValue({
          name:product.name,
          sku:product.sku,
          description:product.description??'',
          price:product.price,
          stock:product.stock,
          minimumStock:product.minimumStock,
          categoryId:product.categoryId,
          isActive:product.isActive
        });
        return;
      }

      this.form.reset({
        name:'',
        sku:'',
        description:'',
        price:0,
        stock:0,
        minimumStock:0,
        categoryId:0,
        isActive:true
      });
    });
  }

  submit():void{
    if(this.form.invalid||this.isSubmitting()){
      this.form.markAllAsTouched();
      return;
    }

    const value=this.form.getRawValue();

    this.save.emit({
      name:value.name.trim(),
      sku:value.sku.trim(),
      description:value.description.trim()||null,
      price:value.price,
      stock:value.stock,
      minimumStock:value.minimumStock,
      categoryId:value.categoryId,
      isActive:value.isActive
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }
}