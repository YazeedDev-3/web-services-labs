import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-insertbook',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './insertbook.html',
  styleUrls: ['./insertbook.css']
})
export class Insertbook {
  title       = '';
  description = '';
  price       = 0;
  cata        = '';
  file_pic: File | null = null;
  message     = '';

  constructor(private bookService: BookService, private router: Router) {}

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

    this.bookService.insertBook(form).subscribe({
      next: () => {
        this.message = 'Book inserted successfully!';
        this.router.navigateByUrl('');
      },
      error: () => {
        this.message = 'Error while inserting book.';
      }
    });
  }
}
