import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private searchResults = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResults.asObservable();

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Error fetching products:', err);
        return [];
      })
    );
  }

  updateSearchResults(results: any[]) {
    this.searchResults.next(results);
  }
}
