import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadFull } from 'tsparticles';
import { ISourceOptions, Container, Engine } from 'tsparticles-engine';
import { particlesOptions } from './particles-config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  particlesOptions: ISourceOptions = particlesOptions;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      // Registra il nuovo utente
      console.log('Registra il nuovo utente con username, email e password:', username, email, password);
    }
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log("particles loaded");
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
