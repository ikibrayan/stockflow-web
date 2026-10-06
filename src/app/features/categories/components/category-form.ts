import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryFormValue } from '../categories.types';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm {
  private readonly fb=inject(FormBuilder);
  readonly category=input<Category|null>(null);
  readonly isSubmitting=input(false);
  readonly save=output<CategoryFormValue>();
  readonly cancel=output<void>();
  readonly form=this.fb.nonNullable.group({
    name:['',[Validators.required,Validators.maxLength(100)]],
    description:[''],
    isActive:[true]
  });

  constructor(){
    effect(()=>{
      const category=this.category();

      if(category){
        this.form.patchValue({
          name:category.name,
          description:category.description??'',
          isActive:category.isActive
        });
        return;
      }

      this.form.reset({
        name:'',
        description:'',
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
      description:value.description.trim()||null,
      isActive:value.isActive
    });
  }

  close():void{
    if(this.isSubmitting()) return;
    this.cancel.emit();
  }
}