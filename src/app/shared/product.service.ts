import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IProduct } from '../../app/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  public localProducts: BehaviorSubject<IProduct[]> = new BehaviorSubject<
    IProduct[]
  >([]);
  public withoutSearchLocalPorducts: BehaviorSubject<IProduct[]> = new BehaviorSubject<
  IProduct[]
>([]);
  
  private productsEmitted: boolean = false;

  productsSubject: any;

  constructor(private http: HttpClient) {}

  getLocalProducts(): any {
    return this.localProducts;
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      tap((data) => {
        if (this.productsEmitted === false) {
          this.localProducts.next(data);
          this.withoutSearchLocalPorducts.next(data);
          this.productsEmitted = true;
        }
      }),
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
    this.productsEmitted = true;
    this.localProducts.next([...this.localProducts.getValue(), { ...product, added:true, id: this.localProducts.getValue().length + 1 }]);
    this.withoutSearchLocalPorducts.next([...this.withoutSearchLocalPorducts.getValue(), { ...product, added:true, id: this.withoutSearchLocalPorducts.getValue().length + 1 }]);
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
 
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Error deleting product'));
      })
    );
  }
}
