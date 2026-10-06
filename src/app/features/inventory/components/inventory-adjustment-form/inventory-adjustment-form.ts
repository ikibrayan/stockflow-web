import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../products/products.types';
import { InventoryAdjustmentFormValue } from '../../inventory.types';

@Component({
  selector: 'app-inventory-adjustment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-adjustment-form.html',
  styleUrl: './inventory-adjustment-form.scss'
})
export class InventoryAdjustmentForm {
  private readonly fb=inject(FormBuilder);
  readonly products=input<Product[]>([]);
  readonly isSubmitting=input(false);
  readonly save=output<InventoryAdjustmentFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.nonNullable.group({
    productId:[0,[Validators.required,Validators.min(1)]],
    newStock:[0,[Validators.required,Validators.min(0)]],
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
      newStock:value.newStock,
      reference:value.reference.trim()
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }
}