import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { CustomerForm } from './components/customer-form';
import { CustomerService } from './customer.service';
import { CreateCustomerRequest, Customer, CustomerFormValue, UpdateCustomerRequest } from './customers.types';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomerForm],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class Customers implements OnInit {
  private readonly customerService=inject(CustomerService);
  private readonly authService=inject(AuthService);
  readonly customers=signal<Customer[]>([]);
  readonly selectedCustomer=signal<Customer|null>(null);
  readonly isLoading=signal(true);
  readonly isSubmitting=signal(false);
  readonly isFormOpen=signal(false);
  readonly errorMessage=signal<string|null>(null);
  readonly successMessage=signal<string|null>(null);
  readonly canCreateCustomers=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager'||role==='Seller';
  });

  readonly canEditCustomers=computed(()=>{
    const role=this.authService.role();
    return role==='Admin'||role==='Manager';
  });

  ngOnInit():void{
    this.loadCustomers();
  }

  openCreateForm():void{
    this.selectedCustomer.set(null);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  openEditForm(customer:Customer):void{
    this.selectedCustomer.set(customer);
    this.clearMessages();
    this.isFormOpen.set(true);
  }

  closeForm():void{
    if(this.isSubmitting()) return;
    this.isFormOpen.set(false);
    this.selectedCustomer.set(null);
  }

  saveCustomer(value:CustomerFormValue):void{
    const customer=this.selectedCustomer();

    if(customer){
      this.updateCustomer(customer.id,value);
      return;
    }

    this.createCustomer(value);
  }

  private createCustomer(value:CustomerFormValue):void{
    const request:CreateCustomerRequest={
      name:value.name,
      document:value.document,
      email:value.email,
      phone:value.phone
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.customerService.createCustomer(request).subscribe({
      next:()=>{
        this.successMessage.set('Customer created successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to create customer.');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateCustomer(id:number,value:CustomerFormValue):void{
    const request:UpdateCustomerRequest={
      name:value.name,
      document:value.document,
      email:value.email,
      phone:value.phone
    };

    this.isSubmitting.set(true);
    this.clearMessages();

    this.customerService.updateCustomer(id,request).subscribe({
      next:()=>{
        this.successMessage.set('Customer updated successfully.');
        this.finishSave();
      },
      error:()=>{
        this.errorMessage.set('Unable to update customer.');
        this.isSubmitting.set(false);
      }
    });
  }

  private finishSave():void{
    this.isSubmitting.set(false);
    this.isFormOpen.set(false);
    this.selectedCustomer.set(null);
    this.loadCustomers();
  }

  private loadCustomers():void{
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.customerService.getCustomers().subscribe({
      next:customers=>{
        this.customers.set(customers);
        this.isLoading.set(false);
      },
      error:()=>{
        this.errorMessage.set('Unable to load customers.');
        this.isLoading.set(false);
      }
    });
  }

  private clearMessages():void{
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}