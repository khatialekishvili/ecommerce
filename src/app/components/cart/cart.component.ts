
import { Component } from '@angular/core';
import { IProduct } from '../../model/product.model';
import { CartService } from '../../shared/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems : IProduct[] =[];

  constructor(private cartservice : CartService){}

  ngOnInit(): void{
    this.cartservice.getCartItems().subscribe(items => this.cartItems = items);
  }

  removeFromCart(productId : number): void{
    this.cartservice.removeFromCart(productId);
    this.cartservice.getCartItems().subscribe(items => this.cartItems = items);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }

  updateQuantity(itemId: number, quantity: number | undefined) {
    if (quantity === undefined || quantity < 1) {
      quantity = 1;
    }
  }
}
  



