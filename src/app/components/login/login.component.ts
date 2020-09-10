import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.UserData.subscribe((user) => {
        if (user) {
          this.router.navigateByUrl('/').then();
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subs.map((s) => s.unsubscribe());
  }

  login(form: NgForm): void {
    const { email, password } = form.value;

    if (!form.valid) {
      return;
    }
    this.authService.SignIn(email, password);
    form.resetForm();
  }

  openRegister(): void {
    const dialogRef = this.matDialog.open(RegisterComponent, {
      role: 'dialog',
      height: '48rem',
      width: '48rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      const { fname, lname, email, password, avatar } = result;

      if (result !== undefined) {
        this.authService.SignUp(email, password, fname, lname, avatar);
      } else {
        return;
      }
    });
  }
}
