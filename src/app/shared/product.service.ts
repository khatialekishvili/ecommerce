import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IProduct } from '../../app/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private localProducts: IProduct[] = [];
  
  productsSubject: any;

  constructor(private http: HttpClient) {}

  getLocalProducts(): IProduct[] {
    return this.localProducts;
  }

  
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Error fetching products'));
      })
    );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching product details:', error);
        return throwError(() => new Error('Error fetching product details'));
      })
    );
  }


  addProduct(product: IProduct): Observable<IProduct> {
    this.localProducts.push(product); // Save to local storage
    return this.http.post<IProduct>(this.apiUrl, product).pipe(
      catchError((error) => {
        console.error('Error adding product:', error);
        return throwError(() => new Error('Error adding product'));
      })
    );
  }

  updateProduct(id: number, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Error updating product'));
      })
    );
  }
 // addProduct(product: IProduct): Observable<IProduct> {
  //   return this.http.post<IProduct>(this.apiUrl, product);
  // }

  // updateProductList(): void {
  //   this.getProducts().subscribe((data) => {
  //     this.productsSubject.next(data); // Update the products list
  //   });
  // }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Error deleting product'));
      })
    );
  }
}
