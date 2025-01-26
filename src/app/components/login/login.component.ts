import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  loginError: boolean = false; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Login data:', loginData);
      this.authService.login(loginData.email, loginData.password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Login failed:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
