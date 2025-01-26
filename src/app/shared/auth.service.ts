import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.getUsers().subscribe(users => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          observer.next(user);
          observer.complete();
        } else {
          observer.error('Invalid email or password');
        }
      });
    });
  }
}
