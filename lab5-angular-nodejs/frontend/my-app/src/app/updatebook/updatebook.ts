import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';

@Component({
  selector: 'app-updatebook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updatebook.html',
  styleUrls: ['./updatebook.css']
})
export class Updatebook implements OnInit {
  id!: number;
  title       = '';
  description = '';
  price       = 0;
  cata        = '';
  file_pic: File | null = null;
  myImage     = '';
  message     = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(this.id).subscribe(book => {
      this.title       = book.title;
      this.description = book.description;
      this.price       = book.price;
      this.cata        = book.cata;
      this.myImage     = book.image;
    });
  }

  fileChange(event: any) {
    this.file_pic = event.target.files[0] ?? null;
  }

  sendclick() {
    const form = new FormData();
    form.append('title',       this.title);
    form.append('description', this.description);
    form.append('price',       this.price.toString());
    form.append('cata',        this.cata);
    if (this.file_pic) {
      form.append('file_pic', this.file_pic);
    }

    this.bookService.updateBook(this.id, form).subscribe({
      next: () => {
        this.message = 'Book updated successfully!';
        this.router.navigateByUrl('');
      },
      error: () => {
        this.message = 'Error while updating book.';
      }
    });
  }

  deleteclick() {
    if (confirm('Delete this book?')) {
      this.bookService.deleteBook(this.id).subscribe(() => this.router.navigateByUrl(''));
    }
  }
}
