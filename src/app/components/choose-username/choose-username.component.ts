import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { usernameValidator } from 'src/app/auth/usernameValidator';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { loadFull } from 'tsparticles';

@Component({
  selector: 'app-choose-username',
  templateUrl: './choose-username.component.html',
  styleUrls: ['./choose-username.component.css']
})
export class ChooseUsernameComponent {
  usernameForm: FormGroup;
  submitStatus: string | null = null;
  focusedInput: number | null = null;
  particlesOptions: ISourceOptions = particlesOptions;
  usernameErrorMessage: string = 'You must enter a valid username';
  subscription: Subscription | undefined;
  overlayError: boolean = false;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = new Subscription();
    this.errorMessage = '';
    this.usernameForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        usernameValidator(),
      ]),
    });
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log('particles loaded');
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnInit() {
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
}
