import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  products = input<{ title: string; price: number; quantity: number }[]>([]);
}
