import { Component, ChangeDetectionStrategy, inject, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [UserProfile, JsonPipe],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.css'],
})
export class Home {
  http = inject(HttpClient);

  meusDados: WritableSignal<any[]> = signal([]);

  constructor() {
    this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((config) => {
      console.log('config', config);
      this.meusDados.set(config as any[]);
    });
  }
}
