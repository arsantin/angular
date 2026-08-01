import { HttpClient, httpResource } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface IUser {
  id: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  activatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  // Use httpResource to fetch user data reactively
  userResource = httpResource<IUser>(() => ({
    url: `${environment.baseUrl}/user/${this.activatedRoute.snapshot.params['id']}`,
  }));

  // Use a signal to manage user state
  user = signal<IUser | null>(null);

  constructor() {
    console.log('id:', this.activatedRoute.snapshot.params['id']);

    // Sync userResource value to user signal
    effect(() => {
      const value = this.userResource.value();
      if (value) {
        this.user.set(value);
      }
    });
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
    this.http.put(`${environment.baseUrl}/user/${id}`, payload).subscribe({
      next: (user) => {
        console.log('user updated', user);
        this.user.set(user as IUser);
      },
      error: (err) => {
        console.error('Failed to update user', err);
      },
    });
  }

  deleteUser(id: string) {
    console.log('deleteUser called with id:', id);
    if (!id) {
      console.error('No user ID provided');
      return;
    }
    this.http.delete(`${environment.baseUrl}/user/${id}`).subscribe({
      next: (response) => {
        console.log('user deleted', response);
        // Optionally, you can clear the user data after deletion
        this.user.set(null);
        location.href = '/dashboard/users'; // Redirect to users list after deletion
      },
      error: (err) => {
        console.error('Failed to delete user', err);
      },
    });
  }
}
