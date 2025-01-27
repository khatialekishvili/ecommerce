import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private searchResults = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResults.asObservable();

  constructor(private http: HttpClient, private productService: ProductService) {}

  search(query: string): Observable<any[]> {
    console.log('Searching for:', query);
    
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((products) => { 
        this.productService.localProducts.next(products);
      }),
      catchError((err) => {
        console.error('Error fetching products:', err);
        return [];
      })
    );
  }

  updateSearchResults(results: any[]) {
    console.log('Updating search results:', results);
    
    this.searchResults.next(results);
  }
}
