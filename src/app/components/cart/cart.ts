import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSearchStore } from '../../../store';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  router = inject(Router);
  store = inject(ProductSearchStore);
  readonly cart = input<any[]>();

  addOrder(order: any) {
    // Add each cart item as an individual order
    (order.orders ?? []).forEach((item: any) => {
      this.store.addOrder(item);
    });
    const routerLink = this.router.createUrlTree(['/dashboard/review-order']);
    this.router.navigateByUrl(routerLink);
  }
  totalPrice() {
    return (this.store.cart() ?? []).reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(id: number) {
    this.store.removeFromCart(id);
  }
}
