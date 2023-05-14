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
import { usernameValidator } from 'src/app/auth/usernameValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  focusedInput: number | null = null;
  showPassword: boolean;
  particlesOptions: ISourceOptions = particlesOptions;
  registerForm: FormGroup;
  emailErrorMessage: string = "You must enter a valid email";
  passwordErrorMessage: string = "You must enter a valid password";
  usernameErrorMessage: string = "You must enter a valid username";
  subscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.subscription = new Subscription();
    this.showPassword = false;
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, emailValidator()]],
      username: [null, [Validators.required, usernameValidator()]],
      password: [null, [Validators.required, passwordValidator()]],
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get username() {
    return this.registerForm.get('username');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm)
      const { email, username, password } = this.registerForm.value;
      // Esegui l'autenticazione dell'utente
      console.log('Esegui la registrazione con email, username e password:', email, username, password);
    }
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log('particles loaded');
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnInit(): void {
    this.subscription = this.registerForm.get('email')?.valueChanges.subscribe(() => {
      const errors = this.registerForm.get('email')?.errors;
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

    this.subscription = this.registerForm.get('username')?.valueChanges.subscribe(() => {
      const errors = this.registerForm.get('username')?.errors;
      if (errors) {
        if (errors['required']) {
          this.usernameErrorMessage = 'This field is required.';
        } else if (errors['lengthTooShort']) {
          this.usernameErrorMessage = 'Username must be at least 1 character long.';
        } else if (errors['lengthTooLong']) {
          this.usernameErrorMessage = 'Username must be at most 20 characters long.';
        } else if (errors['letterInvalid']) {
          this.usernameErrorMessage = 'Username must contain at least one letter.';
        }
      } else {
        this.usernameErrorMessage = '';
      }
    });

    this.subscription = this.registerForm.get('password')?.valueChanges.subscribe(() => {
      const errors = this.registerForm.get('password')?.errors;
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
    });
  }
}
