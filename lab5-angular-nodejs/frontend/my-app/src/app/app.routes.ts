import { Routes } from '@angular/router';

import { Store }          from './store/store';
import { BookDetail }     from './bookdetail/bookdetail';
import { Home }           from './home/home';
import { Insertbook }     from './insertbook/insertbook';
import { Updatebook }     from './updatebook/updatebook';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  // Public routes — no login required
  { path: '',          component: Store },
  { path: 'book/:id',  component: BookDetail },

  // Admin routes — JWT protection handled inside each component
  { path: 'admin/login',     component: LoginComponent },
  { path: 'admin/dashboard', component: Home },
  { path: 'insertbook',      component: Insertbook },
  { path: 'updatebook/:id',  component: Updatebook },

  // Backwards-compatibility redirects
  { path: 'login', redirectTo: 'admin/login',     pathMatch: 'full' },
  { path: 'home',  redirectTo: 'admin/dashboard', pathMatch: 'full' },
];
