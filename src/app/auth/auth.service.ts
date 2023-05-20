import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/compat';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { user } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private database;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  public user: user | null;

  constructor(
    public firestore: Firestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.database = collection(firestore, 'users');
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    this.user = null;
  }

  setLoggedIn(loggedIn: boolean) {
    this.isLoggedInSubject.next(loggedIn);
  }

  logout() {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['login']);
  }

  // Sign up with email/password
  async register(
    email: string,
    password: string,
    username: string
  ): Promise<any> {
    const user = await this.checkUserExists(email, username);
    if (!user) {
      //user does not exists in firestore
      try {
        const data = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
        );
        const tokenData = await this.getTokenData(data);
        const result = await this.addUserToFirestore(
          email,
          username,
          data.user?.uid != undefined ? data.user?.uid : '',
          password,
          tokenData.token,
          tokenData.refreshToken,
          tokenData.expirationTime
        );
        if (result.status === 'success') {
          this.isLoggedInSubject.next(true);
          //localstorage memorization
          this.createUser(
            result.data.email,
            result.data.uid,
            result.data.token,
            result.data.refreshToken,
            result.data.expirationTime
          );
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return result;
      } catch (error) {
        this.isLoggedInSubject.next(false);
        return {
          status: 'failed',
          errors: {
            email: false,
            username: false,
          },
          message: 'Something went wrong.',
        };
      }
    } else {
      const emailExists = await this.emailExists(email);
      const usernameExists = await this.usernameExists(username);
      this.isLoggedInSubject.next(false);
      return {
        status: 'failed',
        errors: {
          email: emailExists,
          username: usernameExists,
        },
        message: emailExists
          ? usernameExists
            ? 'Email or Username already exists.'
            : 'Email already exists.'
          : usernameExists
          ? 'Username already exists.'
          : 'Something went wrong',
      };
    }
  }

  async signUpWithGoogle(): Promise<any> {
    try {
      const data = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      const tokenData = await this.getTokenData(data);
      this.createUser(
        data.user?.email ?? '',
        data.user?.uid ?? '',
        tokenData.token,
        tokenData.refreshToken,
        tokenData.expirationTime
      );
      localStorage.setItem('user', JSON.stringify(this.user));
      return {
        status: 'success',
        errors: {
          email: false,
          username: false,
        },
        data: {
          email: data.user?.email != undefined ? data.user?.email : '',
          username: '',
          uid: data.user?.uid != undefined ? data.user?.uid : '',
          password: '',
          token: tokenData.token,
          refreshToken: tokenData.refreshToken,
          expirationTime: tokenData.expirationTime,
          setting: {},
          profile: {},
        },
        message: 'Registration successful.',
      };
    } catch (err) {
      return {
        status: 'failed',
        errors: {
          email: false,
          username: false,
        },
        message: 'Something went wrong.',
      };
    }
    /*this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(value => async () => {
      //quando auth completa salvo su localstorage e poi chiedo username
      console.log(value);
      const email = value.user?.email != undefined ? value.user?.email : '';
      //dobbiamo mostrargli un overlay che gli chiede di inserire un username

      //dopo che l'username è stato inserito inseriamo il nuovo utente nel firestore.
      //altrimenti se non lo inserisce quando si logga gli verrà chiesto di inserirlo
      //quando un utente viene nel sito se ha dati nel localstorage potremmo (token) verifichiamo se il token è valido e se lo è lo logghiamo automaticamente
      //po prendiamo i dati da firestore e li mettiamo in localstorage
      //se i dati di firestore non ci sono vuol dire che l'utente deve creare un username quindi glielo chiediamo.
      //poi usiamo la funzione sotto per creare un nuovo utente nel firestore
      return {
        status: 'success',
        data: {
          email: email,
          username: '',
        },
      };

    }).catch(() => {
      return {
        status: 'failed',
        errors: {
          email: false,
          username: false,
        },
        message: 'Something went wrong.',
      };
    });*/
  }

  //i sign-in sono uguali solo che non chiedono l'username
  /*async signUpWithFacebook(username: string): Promise<any> {
  }

  async signUpWithTwitter(username: string): Promise<any> {
  }*/

  async completeRegister(username: string): Promise<any> {
    const user = await this.usernameExists(username);
    console.log(user);
    if (!user) {
      try {
        const result = await this.addUserToFirestore(
          this.user?.email,
          username,
          this.user?.uid,
          '',
          this.user?.token,
          this.user?.refreshToken,
          this.user?.expirationTime
        );
        if (result.status === 'success') {
          this.isLoggedInSubject.next(true);
        }
        return result;
      } catch (error) {
        this.isLoggedInSubject.next(false);
        return {
          status: 'failed',
          errors: {
            email: false,
            username: false,
          },
          message: 'Something went wrong.',
        };
      }
    } else {
      const usernameExists = await this.usernameExists(username);
      this.isLoggedInSubject.next(false);
      return {
        status: 'failed',
        errors: {
          username: usernameExists,
        },
        message: usernameExists
          ? 'Username already exists.'
          : 'Something went wrong',
      };
    }
  }

  createUser(
    email: string,
    uid: string,
    token: string,
    refreshToken: string,
    expirationTime: Date
  ) {
    this.user = new user(email, uid, token, refreshToken, expirationTime);
  }

  async getTokenData(data: any) {
    const tokenData = await data.user?.getIdTokenResult();
    const expirationTime = tokenData?.expirationTime;
    const date = new Date(expirationTime != undefined ? expirationTime : 0);
    return {
      token: tokenData?.token != undefined ? tokenData?.token : '',
      refreshToken:
        data.user?.refreshToken != undefined ? data.user?.refreshToken : '',
      expirationTime: date,
    };
  }

  async emailExists(email: string): Promise<boolean> {
    const emailQuery = query(this.database, where('email', '==', email));
    return !(await getDocs(emailQuery)).empty;
  }

  async usernameExists(username: string): Promise<boolean> {
    const usernameQuery = query(
      this.database,
      where('username', '==', username)
    );
    return !(await getDocs(usernameQuery)).empty;
  }

  async checkUserExists(email: string, username: string): Promise<boolean> {
    const emailExists = await this.emailExists(email);
    const usernameExists = await this.usernameExists(username);
    return emailExists || usernameExists;
  }

  async addUserToFirestore(
    email: string | undefined,
    username: string | undefined,
    uid: string | undefined,
    password: string | undefined,
    token: string | undefined,
    refreshToken: string | undefined,
    expirationTime: Date | undefined
  ): Promise<any> {
    try {
      await setDoc(doc(this.database, uid), {
        email: email,
        username: username,
        uid: uid,
        password: password,
        setting: {},
        profile: {},
      });
      return {
        status: 'success',
        errors: {
          email: false,
          username: false,
        },
        data: {
          email: email,
          username: username,
          uid: uid,
          password: password,
          token: token,
          refreshToken: refreshToken,
          expirationTime: expirationTime,
          setting: {},
          profile: {},
        },
        message: 'Registration successful.',
      };
    } catch (error) {
      return {
        status: 'failed',
        errors: {
          email: false,
          username: false,
        },
        message: 'Something went wrong.',
      };
    }
  }
}
