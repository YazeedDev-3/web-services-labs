import { Component, OnInit } from '@angular/core';
import { NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [NgFor, CurrencyPipe, RouterLink],
  templateUrl: './store.html',
  styleUrls: ['./store.css']
})
export class Store implements OnInit {
  books: Book[] = [];
  message = '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getPublicBooks().subscribe({
      next: data  => { this.books = data; },
      error: ()   => { this.message = 'Could not load books. Please try again later.'; }
    });
  }
}
