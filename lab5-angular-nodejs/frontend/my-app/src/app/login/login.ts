import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  name    = '';
  pass    = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  loginclick() {
    const body    = { name: this.name, pass: this.pass };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('http://127.0.0.1:8085/loginprocess', body, { headers })
      .subscribe({
        next: data => {
          if (data?.error === 1) {
            this.message = data.msg;
          } else {
            localStorage.setItem('token', data.token);
            this.router.navigate(['/admin/dashboard']);
          }
        },
        error: () => {
          this.message = 'Server error. Please try again.';
        }
      });
  }
}
