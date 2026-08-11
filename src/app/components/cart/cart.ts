import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private readonly router = inject(Router);

  products = input<{ title: string; price: number; quantity: number }[]>([]);
  totalPrice = computed(() =>
    this.products().reduce((total, product) => total + product.price * product.quantity, 0),
  );
  orderDetails = output<{
    products: { title: string; price: number; quantity: number }[];
    totalPrice: number;
  }>();

  finalizarCompra() {
    this.orderDetails.emit({ products: this.products(), totalPrice: this.totalPrice() });
    this.router.navigate(['/dashboard/review-order']);
  }
}
