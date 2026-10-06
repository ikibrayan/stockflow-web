import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer, CustomerFormValue } from '../customers.types';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerForm {
  private readonly fb=inject(FormBuilder);
  readonly customer=input<Customer|null>(null);
  readonly isSubmitting=input(false);
  readonly save=output<CustomerFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.nonNullable.group({
    name:['',[Validators.required,Validators.maxLength(150)]],
    document:['',[Validators.required,Validators.maxLength(50)]],
    email:['',[Validators.required,Validators.email,Validators.maxLength(150)]],
    phone:['',[Validators.required,Validators.maxLength(30)]]
  });

  constructor(){
    effect(()=>{
      const customer=this.customer();

      if(customer){
        this.form.patchValue({
          name:customer.name,
          document:customer.document,
          email:customer.email,
          phone:customer.phone
        });
        return;
      }

      this.form.reset({
        name:'',
        document:'',
        email:'',
        phone:''
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
      document:value.document.trim(),
      email:value.email.trim(),
      phone:value.phone.trim()
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }
}