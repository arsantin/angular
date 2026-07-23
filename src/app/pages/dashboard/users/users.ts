import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

interface User {
  id: number;
  username: string;
  email: string;
}

@Component({
  selector: 'app-users',
  imports: [JsonPipe],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users {
  http = inject(HttpClient);

  users = signal<User[]>([]);

  constructor() {
    this.http.get(`${environment.baseUrl}/users`).subscribe((users) => {
      console.log('users', users);
      this.users.set(users as User[]);
    });
  }
}
