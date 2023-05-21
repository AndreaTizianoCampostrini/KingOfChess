import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { Subscription } from 'rxjs';
import { emailValidator } from 'src/app/auth/emailValidator';
import { passwordValidator } from 'src/app/auth/passwordValidator';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  submitStatus: string | null = null;
  focusedInput: number | null = null;
  showPassword: boolean;
  particlesOptions: ISourceOptions = particlesOptions;
  loginForm: FormGroup;
  emailErrorMessage: string = 'You must enter a valid email';
  passwordErrorMessage: string = 'You must enter a valid password';
  usernameErrorMessage: string = 'You must enter a valid username';
  subscription: Subscription | undefined;
  overlayError: boolean = false;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.subscription = new Subscription();
    this.showPassword = false;
    this.errorMessage = '';
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, emailValidator()]),
      password: new FormControl(null, [
        Validators.required,
        passwordValidator(),
      ]),
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.submitStatus = 'pending';
      await this.authService.login(email, password).then((status) => {
        //se il login ha avuto successo faccio l'animazione di successo altrimenti di errore
        if (status.status == 'success') {
          setTimeout(() => {
            this.submitStatus = 'success';
            setTimeout(async () => {
              this.submitStatus = null;
              this.router.navigate(['/home']);
            }, 1500);
          }, 2250);
        } else if (status.status == 'failed') {
          setTimeout(() => {
            this.submitStatus = 'failed';
            setTimeout(() => {
              this.submitStatus = null;
              if (status.errors.email == true) {
                this.loginForm.get('email')?.setErrors({ emailExists: true });
                this.emailErrorMessage = "Email doesn't exists";
              }
              if (status.errors.password == true) {
                this.loginForm
                  .get('password')
                  ?.setErrors({ passwordIncorrect: true });
                this.passwordErrorMessage = 'Password is incorrect';
              }
              if (
                status.errors.email == false &&
                status.errors.password == false
              ) {
                this.errorMessage =
                  'An unknown error has occurred. Please try to login or use a different email.';
                this.overlayError = true;
              }
            }, 1500);
          }, 2250);
        }
      });
    }
  }

  async googleLogin() {
    this.submitStatus = 'pending';
    await this.authService.signInWithGoogle().then((status) => {
      //se il login ha avuto successo faccio l'animazione di successo altrimenti di errore
      if (status.status == 'success') {
        setTimeout(() => {
          this.submitStatus = 'success';
          setTimeout(async () => {
            this.submitStatus = null;
            this.router.navigate(['/choose-username']);
          }, 1500);
        }, 2250);
      } else if (status.status == 'failed') {
        setTimeout(() => {
          this.submitStatus = 'failed';
          setTimeout(() => {
            this.submitStatus = null;
          }, 1500);
        }, 2250);
      }
    });
  }

  async facebookLogin() {
    this.submitStatus = 'pending';
    await this.authService.signInWithFacebook().then((status) => {
      //se il login ha avuto successo faccio l'animazione di successo altrimenti di errore
      if (status.status == 'success') {
        setTimeout(() => {
          this.submitStatus = 'success';
          setTimeout(async () => {
            this.submitStatus = null;
            this.router.navigate(['/choose-username']);
          }, 1500);
        }, 2250);
      } else if (status.status == 'failed') {
        setTimeout(() => {
          this.submitStatus = 'failed';
          setTimeout(() => {
            this.submitStatus = null;
          }, 1500);
        }, 2250);
      }
    });
  }

  async twitterLogin() {
    this.submitStatus = 'pending';
    await this.authService.signInWithTwitter().then((status) => {
      //se il login ha avuto successo faccio l'animazione di successo altrimenti di errore
      if (status.status == 'success') {
        setTimeout(() => {
          this.submitStatus = 'success';
          setTimeout(async () => {
            this.submitStatus = null;
            this.router.navigate(['/choose-username']);
          }, 1500);
        }, 2250);
      } else if (status.status == 'failed') {
        setTimeout(() => {
          this.submitStatus = 'failed';
          setTimeout(() => {
            this.submitStatus = null;
          }, 1500);
        }, 2250);
      }
    });
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log('particles loaded');
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnInit(): void {
    this.subscription = this.loginForm
      .get('email')
      ?.valueChanges.subscribe(() => {
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

    this.subscription = this.loginForm
      .get('password')
      ?.valueChanges.subscribe(() => {
        const errors = this.loginForm.get('password')?.errors;
        if (errors) {
          if (errors['required']) {
            this.passwordErrorMessage = 'This field is required.';
          } else if (errors['passwordInvalid']) {
            this.passwordErrorMessage =
              'Password must be at least 8 characters long.';
          } else if (errors['numberInvalid']) {
            this.passwordErrorMessage =
              'Password must contain at least one number.';
          } else if (errors['lowercaseInvalid']) {
            this.passwordErrorMessage =
              'Password must contain at least one lowercase letter.';
          } else if (errors['uppercaseInvalid']) {
            this.passwordErrorMessage =
              'Password must contain at least one uppercase letter.';
          } else if (errors['specialCharInvalid']) {
            this.passwordErrorMessage =
              'Password must contain at least one special character.';
          }
        } else {
          this.passwordErrorMessage = '';
        }
      });
  }
}
