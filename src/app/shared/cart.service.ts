import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../../app/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: IProduct[] = [];
  private cartSubject: BehaviorSubject<IProduct[]> = new BehaviorSubject<IProduct[]>(this.cart);

  getCartItems() {
    return this.cartSubject.asObservable(); 
  }

  addToCart(product: IProduct): void {
    console.log('product',product);
    
    const existingProduct = this.cart.find((item) => item.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + (product.quantity || 1);
    } else {
      this.cart.push({ ...product, quantity: product.quantity || 1 });
    }
    this.cartSubject.next(this.cart); 
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.cartSubject.next(this.cart); 
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cart = [];
    this.cartSubject.next(this.cart); 
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const product = this.cart.find((item) => item.id === productId);
    if (product) {
      product.quantity = quantity;
      this.cartSubject.next(this.cart);
      this.saveCartToStorage();
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart); 
    }
  }
}
