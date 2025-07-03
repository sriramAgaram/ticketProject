import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { DataService } from '../../data.service';
import { sharedUi } from '../../shared/shared-ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule , ...sharedUi],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {}

  loading :boolean = false

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loginError: string = '';

  onSubmit() {
    this.http
      .post(`${environment.apiUrl}/auth/login`, this.loginForm.value)
      .subscribe({
        next: (data: any) => {
          this.loading=true
          console.log(data);
          if (data.success === true) {
            this.dataService.login(data.token);
            this.dataService.setUser(data.result[0]);
            this.loginForm.reset();
            this.loginError = 'Invalid email or password ';
            this.loading=false
            if (data.result[0]?.role === 'admin') {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/alltickets']);
            }
          }
        },
        error: (err) => {
          console.error('err from login Form :', err);
          this.loginError = 'Something went Wrong ,Please ry again';
        },
      });
  }
}
