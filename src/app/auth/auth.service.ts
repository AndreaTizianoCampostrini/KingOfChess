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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private database;
  isLoggedIn: boolean = false;

  isAuthenticated() {
    return this.isLoggedIn;
  }

  constructor(
    public firestore: Firestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.database = collection(firestore, 'users');
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
        const result = await this.addUserToFirestore(
          email,
          username,
          data.user?.uid != undefined ? data.user?.uid : '',
          password
        );
        if (result.status === 'success') {
          this.isLoggedIn = true;
          //localstorage memoriztion
        }
        return result;
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
    } else {
      const emailExists = await this.emailExists(email);
      const usernameExists = await this.usernameExists(username);
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

  /*async signUpWithGoogle(): Promise<any> {
    this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(value => async () => {
      console.log(value);
      //dobbiamo mostrargli un overlay che gli chiede di inserire un username

      //dopo che l'username è stato inserito inseriamo il nuovo utente nel firestore.
      //altrimenti se non lo inserisce quando si logga gli verrà chiesto di inserirlo
      //quando un utente viene nel sito se ha dati nel localstorage potremmo (token) verifichiamo se il token è valido e se lo è lo logghiamo automaticamente
      //po prendiamo i dati da firestore e li mettiamo in localstorage
      //se i dati di firestore non ci sono vuol dire che l'utente deve creare un username quindi glielo chiediamo.
      //poi usiamo la funzione sotto per creare un nuovo utente nel firestore
      const result = await this.addUserToFirestore(value.user?.email != undefined ? value.user?.email : "", value.user?.displayName !== undefined ? value.user?.displayName : "", value.user?.uid != undefined ? value.user?.uid : "", "");
        if(result.status === 'success') {
          this.isLoggedIn = true;
          //localstorage memoriztion
        }
        return result;
    }).catch((error) => {
      console.log(error);
    });
  }*/
  //i sign-in sono uguali solo che non chiedono l'username
  /*async signUpWithFacebook(username: string): Promise<any> {
  }

  async signUpWithTwitter(username: string): Promise<any> {
  }*/

  async emailExists(email: string): Promise<boolean> {
    const emailQuery = query(this.database, where('email', '==', email));
    return !(await getDocs(emailQuery)).empty;
  }

  async usernameExists(username: string): Promise<boolean> {
    const usernameQuery = query(this.database, where('username', '==', username));
    return !(await getDocs(usernameQuery)).empty;
  }

  async checkUserExists(email: string, username: string): Promise<boolean> {
    const emailExists = await this.emailExists(email);
    const usernameExists = await this.usernameExists(username);
    return emailExists || usernameExists;
  }

  async addUserToFirestore(
    email: string,
    username: string,
    uid: string,
    password: string
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
