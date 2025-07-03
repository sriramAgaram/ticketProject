import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.setUser(null);
    this.router.navigate(['/login']);
  }

  islogged() {
    return this.http.get(`${environment.apiUrl}/auth/user`);
  }

  private userSignal = signal<any>(null);

  user = this.userSignal.asReadonly();

  role = computed(() => this.userSignal()?.role || '');

  setUser(user: any) {
    this.userSignal.set(user);
  }
}
