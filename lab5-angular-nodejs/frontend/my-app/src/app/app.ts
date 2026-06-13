import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Book Store';

  constructor(private router: Router) {}

  // True when the user is on an admin-only page (excludes the login page itself)
  get isAdminArea(): boolean {
    const url = this.router.url;
    return url.startsWith('/admin/dashboard') ||
           url.startsWith('/insertbook') ||
           url.startsWith('/updatebook');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
