import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../shared/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { CommonModule } from '@angular/common';
import { IProduct } from '../../model/product.model';
import { CartService } from '../../shared/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [MatCardModule, CommonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  product!: IProduct;
  quantity: number = 1;  

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartservice: CartService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe((data) => {
      this.product = data;
    });
  }

  addToCart(): void {
    const productWithQuantity = { ...this.product, quantity: this.quantity };
    this.cartservice.addToCart(productWithQuantity);
    alert(`${this.product.title} (x${this.quantity}) added to cart!`);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
