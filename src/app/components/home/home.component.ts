import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../shared/product.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { IProduct } from '../../model/product.model';
import { HeaderComponent } from '../header/header.component';
import { delay, tap } from 'rxjs';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-home',
  imports: [
    MatGridListModule,
    CommonModule,
    MatCardModule,
    RouterModule,
    // HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products: any[] = [];
  cartService: any;
  spinner: boolean = false;

  constructor(
    private productService: ProductService,
    private cartservice: CartService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    
    this.getProducts();

    this.searchService.searchResults$.subscribe((items) => {
      this.spinner = true;
      this.products = [];
      setTimeout(() => {
        this.products = items;
        this.spinner = false;
      }, 1000);
    });
  }
  addToCart(product: IProduct): void {
    this.cartservice.addToCart(product);
    alert(`${product.title} added to cart!`);
  }

  getProducts() {
    const localProducts = this.productService.getLocalProducts();
    this.spinner = true;
    this.productService
      .getProducts()
      .pipe(tap(console.log), delay(2000))
      .subscribe((data) => {
        this.spinner = false;
        this.products = data;
      });
  }
}
