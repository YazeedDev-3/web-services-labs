import { Component, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-bookdetail',
  standalone: true,
  imports: [NgIf, CurrencyPipe, RouterLink],
  templateUrl: './bookdetail.html',
  styleUrls: ['./bookdetail.css']
})
export class BookDetail implements OnInit {
  book: Book | null = null;
  message = '';

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id).subscribe({
      next: data  => { this.book = data; },
      error: ()   => { this.message = 'Book not found.'; }
    });
  }
}
