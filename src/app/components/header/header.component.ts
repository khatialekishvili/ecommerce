import {
  Component,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { CartService } from '../../shared/cart.service';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SearchService } from '../../shared/search.service';
import { ProductService } from '../../shared/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, FormsModule, MatBadgeModule],
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  cartItemCount: number = 0;
  cartItems: any[] = [];
  showCartDropdown: boolean = false;
  showUserDropdown: boolean = false;
  isDarkMode: boolean = false;
  isLoggedIn: boolean = false;

  private searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const savedMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;

      this.cartItemCount = items.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
    });

    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap((query) => {
          return this.productService.withoutSearchLocalPorducts;
        })
      )
      .subscribe((results) => {
        this.searchResults = this.searchQuery.trim()
          ? results.filter((product) =>
              product.category
                .toLowerCase()
                .includes(this.searchQuery.trim().toLowerCase())
            )
          : results;
        console.log('sanam gadava');

        this.searchService.updateSearchResults(this.searchResults);
        this.isLoading = false;
      });
  }

  onSearchInput(): void {
    this.isLoading = true;
    this.searchSubject.next(this.searchQuery);
  }

  goToProductPage(productId: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', productId]).then(() => {
        this.searchQuery = '';
        this.searchResults = [];
      });
    });
  }

  toggleCartDropdown(): void {
    this.showCartDropdown = !this.showCartDropdown;
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToAddProduct() {
    this.router.navigateByUrl('/admin');
  }

  goToHome(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.isLoading = false;

    this.productService.localProducts.next(this.productService.withoutSearchLocalPorducts.getValue());
  
    this.showCartDropdown = false;
    this.showUserDropdown = false;
    this.router.navigate(['/']);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const cartIcon = document.querySelector('.cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (
      cartIcon &&
      !cartIcon.contains(event.target as Node) &&
      cartDropdown &&
      !cartDropdown.contains(event.target as Node)
    ) {
      this.showCartDropdown = false;
    }
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    const searchBar = document.querySelector('.search-bar');
    const searchDropdown = document.querySelector('.search-dropdown');

    if (
      searchBar &&
      searchDropdown &&
      !searchBar.contains(target) &&
      !searchDropdown.contains(target)
    ) {
      this.searchResults = [];
    }
  }
}
