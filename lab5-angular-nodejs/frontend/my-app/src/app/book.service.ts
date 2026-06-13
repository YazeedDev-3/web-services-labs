import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  price: number;
  description: string;
  cata: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = 'http://127.0.0.1:8085';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Returns all books without authentication (public store)
  getPublicBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/public_books`);
  }

  // Returns all books — requires a valid JWT (admin role enforced on the server)
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/process_index`, {
      headers: this.authHeaders()
    });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/process_detail/${id}`);
  }

  insertBook(form: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/process_insert2`, form);
  }

  updateBook(id: number, form: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/process_update/${id}`, form);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/process_delete/${id}`);
  }
}
