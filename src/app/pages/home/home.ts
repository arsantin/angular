import { Component, ChangeDetectionStrategy, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../components/cart/cart';
import { ProductSearchStore } from '../../../store';
import { JsonPipe } from '@angular/common';
import { Product } from '../../components/product/product';

@Component({
  selector: 'app-home',
  imports: [Product, Cart, JsonPipe],
  providers: [],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home.css'],
})
export class Home {
  http = inject(HttpClient);
  store = inject(ProductSearchStore);

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
