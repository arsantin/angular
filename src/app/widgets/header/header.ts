import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.css',
})
export class Header {
  token = signal<string | null>(localStorage.getItem('token_angular'));
  logout() {
    localStorage.removeItem('token_angular');
    this.token.set(null);
  }
}
