import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../shared/product.service';
import {MatSelectModule} from '@angular/material/select';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, MatSelectModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  productForm : FormGroup;
  addToCart: any;
  
  constructor(private fb : FormBuilder, private productService : ProductService){
    this.productForm = this.fb.group({
      title :['', Validators.required], 
      price :['', [Validators.required, Validators.min(0)]],
      description :['', Validators.required],
      category: ['', Validators.required],
      image : ['', Validators.required]
    })
  }

  submit() : void {
    if(this.productForm.valid){
      this.productService.addProduct(this.productForm.value).subscribe(() =>{
        alert('Product added successfully');
        this.productForm.reset();
      })
    }
    (error: { message: string; }) => {
      alert('Error adding product: ' + error.message);
    }
  }
  hasError(controlName: string, error: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control?.hasError(error) && (control?.dirty || control?.touched);
  }
}
