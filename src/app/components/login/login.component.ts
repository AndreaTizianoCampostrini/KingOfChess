import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { Subscription } from 'rxjs';
import { emailValidator } from 'src/app/auth/emailValidator';
import { passwordValidator } from 'src/app/auth/passwordValidator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  focusedInput: number | null = null;
  showPassword: boolean;
  particlesOptions: ISourceOptions = particlesOptions;
  loginForm: FormGroup;
  emailErrorMessage: string = "You must enter a valid email";
  passwordErrorMessage: string = "You must enter a valid password";
  subscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.subscription = new Subscription();
    this.showPassword = false;
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, emailValidator()]],
      password: [null, [Validators.required, passwordValidator()]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm)
      const { email, password } = this.loginForm.value;
      // Esegui l'autenticazione dell'utente
      console.log('Esegui il login con email e password:', email, password);
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log('particles loaded');
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnInit(): void {
    this.subscription = this.loginForm.get('email')?.valueChanges.subscribe(() => {
      const errors = this.loginForm.get('email')?.errors;
      if (errors) {
        if (errors['required']) {
          this.emailErrorMessage = 'This field is required.';
        } else if (errors['emailInvalid']) {
          this.emailErrorMessage = 'You must enter a valid email.';
        }
      } else {
        this.emailErrorMessage = '';
      }
    });
    this.subscription = this.loginForm.get('password')?.valueChanges.subscribe(() => {
      const errors = this.loginForm.get('password')?.errors;
      if (errors) {
        if (errors['required']) {
          this.passwordErrorMessage = 'This field is required.';
        } else if (errors['passwordInvalid']) {
          this.passwordErrorMessage = 'Password must be at least 8 characters long.';
        } else if (errors['numberInvalid']) {
          this.passwordErrorMessage = 'Password must contain at least one number.';
        } else if (errors['lowercaseInvalid']) {
          this.passwordErrorMessage = 'Password must contain at least one lowercase letter.';
        } else if (errors['uppercaseInvalid']) {
          this.passwordErrorMessage = 'Password must contain at least one uppercase letter.';
        } else if (errors['specialCharInvalid']) {
          this.passwordErrorMessage = 'Password must contain at least one special character.';
        }
      } else {
        this.passwordErrorMessage = '';
      }
    })
  }
}
