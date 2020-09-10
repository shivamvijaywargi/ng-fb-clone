import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  defaultAvatar =
    'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png';

  private userData: Observable<firebase.User>;

  private currentUser: UserData;
  private currentUser$ = new BehaviorSubject<UserData>(null);

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.userData = afAuth.authState;

    this.userData.subscribe((user) => {
      if (user) {
        this.afs
          .collection<UserData>('users')
          .doc<UserData>(user.uid)
          .valueChanges()
          .subscribe((currentUser) => {
            if (currentUser !== undefined) {
              this.currentUser = currentUser;
              this.currentUser$.next(this.currentUser);
            } else {
              this.currentUser = null;
              this.currentUser$.next(this.currentUser);
            }
          });
      }
    });
  }

  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }

  SignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar: string
  ): void {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (res) {
          if (avatar === undefined || avatar === '') {
            avatar = this.defaultAvatar;
          }
          this.afs
            .collection('users')
            .doc(res.user.uid)
            .set({
              firstName,
              lastName,
              email,
              avatar,
            })
            .then(() => {
              this.afs
                .collection<UserData>('users')
                .doc<UserData>(res.user.uid)
                .valueChanges()
                .subscribe((user) => {
                  if (user) {
                    this.currentUser = user;
                    this.currentUser$.next(this.currentUser);
                  }
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  get UserData(): Observable<firebase.User> {
    return this.userData;
  }

  SignIn(email: string, password: string): void {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.userData = this.afAuth.authState;

        this.afs
          .collection<UserData>('users')
          .doc<UserData>(res.user.uid)
          .valueChanges()
          .subscribe((user) => {
            if (user) {
              this.currentUser = user;
              this.currentUser$.next(this.currentUser);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  Logout(): void {
    this.afAuth.signOut().then((res) => {
      this.currentUser = null;
      this.currentUser$.next(this.currentUser);
      this.router.navigateByUrl('/login').then();
    });
  }

  // tslint:disable-next-line: variable-name
  SearchUserinDB(user_id: string): Observable<UserData> {
    return this.afs
      .collection<UserData>('users')
      .doc<UserData>(user_id)
      .valueChanges();
  }
}

export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  id?: string;
}
