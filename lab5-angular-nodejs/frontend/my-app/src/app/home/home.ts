import { Component, OnInit } from '@angular/core';
import { NgFor, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  books: Book[] = [];
  message = '';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.bookService.getBooks().subscribe({
      next: (data: any) => {
        if (data?.error === 1) {
          this.message = data.msg;
        } else {
          this.books = data;
        }
      },
      error: err => {
        if (err.status === 403) {
          alert('Session has ended, please log in again.');
          localStorage.removeItem('token');
          this.router.navigate(['/admin/login']);
        }
      }
    });
  }
}
