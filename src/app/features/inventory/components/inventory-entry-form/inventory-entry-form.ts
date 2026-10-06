import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../products/products.types';
import { InventoryEntryFormValue } from '../../inventory.types';

@Component({
  selector: 'app-inventory-entry-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-entry-form.html',
  styleUrl: './inventory-entry-form.scss'
})
export class InventoryEntryForm {
  private readonly fb=inject(FormBuilder);
  readonly products=input<Product[]>([]);
  readonly isSubmitting=input(false);
  readonly save=output<InventoryEntryFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.nonNullable.group({
    productId:[0,[Validators.required,Validators.min(1)]],
    quantity:[1,[Validators.required,Validators.min(1)]],
    reference:['',[Validators.required,Validators.maxLength(200)]]
  });

  submit():void{
    if(this.form.invalid||this.isSubmitting()){
      this.form.markAllAsTouched();
      return;
    }

    const value=this.form.getRawValue();

    this.save.emit({
      productId:value.productId,
      quantity:value.quantity,
      reference:value.reference.trim()
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }
}