import { Component, ChangeDetectionStrategy, inject, signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../components/user-profile/user-profile';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../components/product/product';
import { Cart } from '../../components/cart/cart';

@Component({
  selector: 'app-home',
  imports: [UserProfile, Product, Cart],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home.css'],
})
export class Home {
  http = inject(HttpClient);

  meusDados: WritableSignal<any[]> = signal([]);
  cart = signal<any[]>([]);

  constructor() {
    this.http.get('https://jsonplaceholder.typicode.com/todos').subscribe((config) => {
      console.log('config', config);
      this.meusDados.set(config as any[]);
    });
  }

  addProductToCart(product: any) {
    console.log('Product added to cart:', product);
    this.cart.update((items) => [...items, product]);
  }
}
