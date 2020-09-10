import { PostService } from './../../services/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserData, AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  images: any[] = [
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
  ];

  posts: any[] = [];
  user: UserData;
  subs: Subscription[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.postService.getAllPosts().subscribe((posts) => {
        this.posts = posts;
      })
    );

    this.subs.push(
      this.authService.CurrentUser().subscribe((user) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  postMessage(form: NgForm): void {
    const { message } = form.value;

    this.postService.postMessage(
      message,
      `${this.user.firstName} ${this.user.lastName}`,
      {
        avatar: this.user.avatar,
        lastName: this.user.lastName,
        firstName: this.user.firstName,
      }
    );

    form.resetForm();
  }

  logout(): void {
    this.authService.Logout();
  }
}
