import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { JsonPipe } from '@angular/common';
// signal is not re-imported here (already imported above if needed)

interface IUser {
  id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-details',
  imports: [JsonPipe],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  activatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  // Use a signal so the template updates reactively when the value arrives
  user = signal<IUser | null>(null);

  constructor() {
    console.log('id:', this.activatedRoute.snapshot.params['id']);

    this.http
      .get(`${environment.baseUrl}/user/${this.activatedRoute.snapshot.params['id']}`)
      .subscribe(
        (user) => {
          console.log('user', user);
          this.user.set(user as IUser);
        },
        (err) => {
          console.error('Failed to load user', err);
        },
      );
  }

  updateUser(id: string) {
    console.log('updateUser called with id:', id);
    console.log('current user:', this.user());

    if (!this.user()) {
      console.error('No user data available');
      return;
    }
    if (!id) {
      console.error('No user ID provided');
      return;
    }
    const payload = {
      username: this.user()?.username,
      email: this.user()?.email,
    };
    console.log('payload', payload);
    console.log('Updating user with payload:', payload);
    this.http.put(`${environment.baseUrl}/user/${id}`, payload).subscribe(
      (user) => {
        console.log('user updated', user);
        this.user.set(user as IUser);
      },
      (err) => {
        console.error('Failed to update user', err);
      },
    );
  }
}
