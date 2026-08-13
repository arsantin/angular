import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ProductSearchStore } from '../../../store';

interface CartItem {
  title: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  // Emit cart items when "Add to Cart" is clicked
  store = inject(ProductSearchStore);
  addToCartOutput = output<CartItem>();
  product = input<any>();

  addToCart() {
    const cartItem = {
      productId: this.product().id,
      title: this.product().title,
      description: this.product().description,
      price: this.product().price,
      quantity: this.product().quantity,
    };

    this.addToCartOutput.emit({
      title: cartItem.title,
      description: cartItem.description,
      price: cartItem.price,
      quantity: cartItem.quantity,
      total: cartItem.quantity * cartItem.price,
    });

    this.store.addToCart(cartItem as any);
  }
}
