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
  DocumentData,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { user } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private database;
  public user: user | null;

  constructor(
    public firestore: Firestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.database = collection(firestore, 'users');
    this.user = null;
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.user = null;
      this.router.navigate(['/login']);
    });
  }

  /* Sign Up */
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
          this.createUser(
            result.data.email,
            result.data.username,
            result.data.data.uid,
            result.data.password
          );
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

  async signUpWithGoogle(): Promise<any> {
    try {
      const data = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      this.createUser(data.user?.email ?? '', '', data.user?.uid ?? '', '');
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
  }

  //i sign-in sono uguali solo che non chiedono l'username
  async signUpWithFacebook(): Promise<any> {
    try {
      const data = await this.afAuth.signInWithPopup(
        new FacebookAuthProvider()
      );
      this.createUser(data.user?.email ?? '', '', data.user?.uid ?? '', '');
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
  }

  async signUpWithTwitter(): Promise<any> {
    try {
      const data = await this.afAuth.signInWithPopup(new TwitterAuthProvider());
      this.createUser(data.user?.email ?? '', '', data.user?.uid ?? '', '');
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
  }

  async completeRegister(username: string): Promise<any> {
    const user = await this.usernameExists(username);
    if (!user) {
      try {
        const result = await this.addUserToFirestore(
          this.user?.email,
          username,
          this.user?.uid,
          ''
        );
        if (result.status === 'success') {
          this.createUser(
            result.data.email,
            result.data.username,
            result.data.uid,
            result.data.password
          );
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
      const usernameExists = await this.usernameExists(username);
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

  createUser(email: string, username: string, uid: string, password: string) {
    this.user = new user(email, username, uid, password);
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
    password: string | undefined
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

  getFirestoreUser(email: string): Promise<any> {
    const userQuery = query(this.database, where('email', '==', email));
    return getDocs(userQuery).then((results) => {
      if (results.empty) {
        return {};
      } else {
        return results.docs[0].data();
      }
    });
  }
}
