import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { of, startWith } from 'rxjs';
import { Header } from './widgets/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal<string | null>('angular-21');
  protected readonly noSignal = 'sem signal';

  santinFn() {
    return 'santin';
  }

  updateSignalValue() {
    this.title.set('new title');
  }

  users = [{ name: 'santin' }, { name: 'ana' }, { name: 'joao' }];

  //emit (1,2,3)
  users$ = of(this.users);
  //start with 0
  example = this.users$.pipe(startWith(0));
  //output: 0,1,2,3
  subscribe = this.example.subscribe((val) => console.log('res', val));

  ngOnInit(): void {
    this.users$.subscribe((res) => {
      console.log('users observable', res);
    });
  }
}
