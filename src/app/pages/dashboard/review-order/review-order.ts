import { Component, input } from '@angular/core';

@Component({
  selector: 'app-review-order',
  imports: [],
  templateUrl: './review-order.html',
  styleUrl: './review-order.css',
})
export class ReviewOrder {
  orderDetails = input<{
    products: { title: string; price: number; quantity: number }[];
    totalPrice: number;
  }>();
}
