import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { Subscription } from 'rxjs';
import { emailValidator } from 'src/app/auth/emailValidator';
import { passwordValidator } from 'src/app/auth/passwordValidator';
import { usernameValidator } from 'src/app/auth/usernameValidator';
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
  usernameForm: FormGroup;
  emailErrorMessage: string = 'You must enter a valid email';
  passwordErrorMessage: string = 'You must enter a valid password';
  usernameErrorMessage: string = 'You must enter a valid username';
  subscription: Subscription | undefined;
  overlayError: boolean = false;
  overlayUsername: boolean = false;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
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
    this.usernameForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        usernameValidator(),
      ]),
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.submitStatus = 'pending';
      await this.authService
        .login(email, password)
        .then((status) => {
          //se il login ha avuto successo faccio l'animazione di successo altrimenti di errore
          if (status.status == 'success') {
            setTimeout(() => {
              this.submitStatus = 'success';
              setTimeout(async () => {
                this.submitStatus = null;
                if (await this.authService.emailExists(status.data.email)) {
                  this.router.navigate(['/home']);
                } else {
                  this.overlayUsername = true;
                }
              }, 1500);
            }, 2250);
          } else if (status.status == 'failed') {
            setTimeout(() => {
              this.submitStatus = 'failed';
              setTimeout(() => {
                this.submitStatus = null;
                if (status.errors.email == true) {
                  this.loginForm
                    .get('email')
                    ?.setErrors({ emailExists: true });
                  this.emailErrorMessage = 'Email doesn\'t exists';
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

  async onUsernameFormSubmit() {
    if (this.usernameForm.valid) {
      const { username } = this.usernameForm.value;
      this.submitStatus = 'pending';
      await this.authService.completeRegister(username).then((status) => {
        //se il register ha avuto successo faccio l'animazione di successo altrimenti di errore
        if (status.status == 'success') {
          setTimeout(() => {
            this.submitStatus = 'success';
            setTimeout(() => {
              this.submitStatus = null;
              this.overlayUsername = false;
              this.router.navigate(['/home']);
            }, 1500);
          }, 2250);
        } else if (status.status == 'failed') {
          setTimeout(() => {
            this.submitStatus = 'failed';
            setTimeout(() => {
              this.submitStatus = null;
              if (status.errors.username == true) {
                this.usernameForm
                  .get('username')
                  ?.setErrors({ usernameExists: true });
                this.usernameErrorMessage = 'Username already exists';
              } else {
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
            if (await this.authService.emailExists(status.data.email)) {
              this.router.navigate(['/home']);
            } else {
              this.overlayUsername = true;
            }
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
            if (await this.authService.emailExists(status.data.email)) {
              this.router.navigate(['/home']);
            } else {
              this.overlayUsername = true;
            }
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
            if (await this.authService.emailExists(status.data.email)) {
              this.router.navigate(['/home']);
            } else {
              this.overlayUsername = true;
            }
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

    this.subscription = this.usernameForm
      .get('username')
      ?.valueChanges.subscribe(() => {
        const errors = this.usernameForm.get('username')?.errors;
        if (errors) {
          if (errors['required']) {
            this.usernameErrorMessage = 'This field is required.';
          } else if (errors['lengthTooShort']) {
            this.usernameErrorMessage =
              'Username must be at least 1 character long.';
          } else if (errors['lengthTooLong']) {
            this.usernameErrorMessage =
              'Username must be at most 20 characters long.';
          } else if (errors['letterInvalid']) {
            this.usernameErrorMessage =
              'Username must contain at least one letter.';
          }
        } else {
          this.usernameErrorMessage = '';
        }
      });

      this.afAuth.currentUser.then((user) => {
        //se l'utente è autenticato
        if (user) {
          this.authService.emailExists(user.email ?? '').then((exists) => {
            if (!exists) {
              //se non esiste, l'utente non ha inserito l'usernmae, poichè si è loggato con un servizio
              this.overlayUsername = true;
            }
          });
        }
      });
  }
}
