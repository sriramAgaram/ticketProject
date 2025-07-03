import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
  });

  onSubmit() {
    console.log(this.signupForm.value);

    this.http
      .post(`${environment.apiUrl}/auth/signup`, this.signupForm.value)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.signupForm.reset();
        },
        error: (err) => {
          console.error('err from signup Form :', err);
        },
      });
  }
}
