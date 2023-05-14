import { NgModule } from '@angular/core';
import { NgParticlesModule } from "ng-particles";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { IntroScreenComponent } from './components/intro-screen/intro-screen.component';
import { AppIntroComponent } from './components/app-intro/app-intro.component';
import { CommonModule } from '@angular/common';
import { CursorComponent } from './components/cursor/cursor.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { CursorService } from './services/cursor/cursor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgxTypedJsModule } from 'ngx-typed-js';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    IntroScreenComponent,
    AppIntroComponent,
    CursorComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    NgParticlesModule,
    CommonModule,
    FontAwesomeModule,
    NgxTypedJsModule,
  ],
  providers: [CursorService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faTwitter,
      faFacebook,
      faGoogle,
      faEyeSlash,
      faEye
    );
  }
}
