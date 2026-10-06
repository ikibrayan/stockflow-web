import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../customers/customers.types';
import { Product } from '../../products/products.types';
import { SaleFormValue } from '../sales.types';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.scss'
})
export class SaleForm {
  private readonly fb=inject(FormBuilder);
  readonly customers=input<Customer[]>([]);
  readonly products=input<Product[]>([]);
  readonly isSubmitting=input(false);
  readonly save=output<SaleFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.group({
    customerId:this.fb.nonNullable.control(0,[Validators.required,Validators.min(1)]),
    items:this.fb.array([this.createItemGroup()])
  });

  get items(){
    return this.form.controls.items;
  }

  addItem():void{
    this.items.push(this.createItemGroup());
  }

  removeItem(index:number):void{
    if(this.items.length===1) return;
    this.items.removeAt(index);
  }

  getProduct(productId:number):Product|undefined{
    return this.products().find(product=>product.id===productId);
  }

  getSubtotal(index:number):number{
    const item=this.items.at(index).getRawValue();
    const product=this.getProduct(item.productId);

    if(!product||item.quantity<=0) return 0;

    return product.price*item.quantity;
  }

  getTotal():number{
    return this.items.controls.reduce((total,control)=>{
      const item=control.getRawValue();
      const product=this.getProduct(item.productId);

      if(!product||item.quantity<=0) return total;

      return total+product.price*item.quantity;
    },0);
  }

  submit():void{
    if(this.form.invalid||this.isSubmitting()){
      this.form.markAllAsTouched();
      return;
    }

    const value=this.form.getRawValue();

    this.save.emit({
      customerId:value.customerId,
      items:value.items.map(item=>({
        productId:item.productId,
        quantity:item.quantity
      }))
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }

  private createItemGroup(){
    return this.fb.nonNullable.group({
      productId:[0,[Validators.required,Validators.min(1)]],
      quantity:[1,[Validators.required,Validators.min(1)]]
    });
  }
}