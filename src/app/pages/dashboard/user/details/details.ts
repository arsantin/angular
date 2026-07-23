import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { environment } from '../../../../../environments/environment';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [JsonPipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  activatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  user = signal<User | null>(null);

  constructor() {
    console.log('id:', this.activatedRoute.snapshot.params['id']);

    this.http
      .get(`${environment.baseUrl}/user/${this.activatedRoute.snapshot.params['id']}`)
      .subscribe((user) => {
        console.log('user', user);
        this.user.set(user as User);
      });
  }
}
