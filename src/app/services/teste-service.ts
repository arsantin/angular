import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TesteService {
  private readonly http = inject(HttpClient);

  constructor() {
    this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((config) => {
      // process the configuration.
      console.log('config', config);
    });
  }
}
