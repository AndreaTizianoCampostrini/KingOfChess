import { NgModule } from '@angular/core';
import { NgParticlesModule } from "ng-particles";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirestoreModule, provideFirestore,getFirestore } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { IntroScreenComponent } from './components/intro-screen/intro-screen.component';
import { AppIntroComponent } from './components/app-intro/app-intro.component';
import { CommonModule } from '@angular/common';
import { CursorComponent } from './components/cursor/cursor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faTwitter, faFacebook, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faArrowRightToBracket, faCaretLeft, faCaretRight, faChessPawn, faEnvelope, faUser, faGamepad, faPlay, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { CursorService } from './services/cursor/cursor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { ChooseUsernameComponent } from './components/choose-username/choose-username.component';
import { environment } from './environments/environment';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    IntroScreenComponent,
    AppIntroComponent,
    CursorComponent,
    HomeComponent,
    NotFoundComponent,
    ChooseUsernameComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    FirestoreModule,
    NgParticlesModule,
    CommonModule,
    FontAwesomeModule,
    NgxTypedJsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
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
      faEye,
      faArrowRightToBracket,
      faCaretRight,
      faCaretLeft,
      faChessPawn,
      faGithub,
      faEnvelope,
      faUser,
      faPlay,
      faCaretDown,
      faCaretUp
    );
  }
}
