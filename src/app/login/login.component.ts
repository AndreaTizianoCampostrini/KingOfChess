// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from "tsparticles-engine";
import { loadFull } from "tsparticles";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  particlesOptions: ISourceOptions = particlesOptions;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    console.log("particles loaded");
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
