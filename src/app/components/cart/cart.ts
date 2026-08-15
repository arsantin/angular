import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSearchStore } from '../../../store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [JsonPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  router = inject(Router);
  store = inject(ProductSearchStore);
  cart = input<any[]>();

  addOrder(order: any) {
    this.store.addOrder(order);
    const routerLink = this.router.createUrlTree(['/dashboard/review-order']);
    this.router.navigateByUrl(routerLink);
  }
  totalPrice() {
    return this.store.cart().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(id: number) {
    this.store.removeFromCart(id);
  }
}
