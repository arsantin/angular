import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSearchStore } from '../../../store';

@Component({
  selector: 'app-cart',
  imports: [],
  providers: [ProductSearchStore],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  router = inject(Router);
  store = inject(ProductSearchStore);
  cart = input<any[]>();
  orderDetails = output<{
    products: { title: string; price: number; quantity: number }[];
  }>();

  finalizarCompra() {
    this.orderDetails.emit({
      products: this.store
        .cart()
        .map((item) => ({ title: item.title, price: item.price, quantity: item.quantity })),
    });
    this.router.navigate(['/dashboard/review-order']);
  }

  totalPrice() {
    return this.store.cart().reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
