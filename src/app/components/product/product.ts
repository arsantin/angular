import { Component, inject, input, output } from '@angular/core';
import { IProduct, ProductSearchStore } from '../../../store';

interface CartItem {
  id: number;
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
  product = input<IProduct>();

  addToCart() {
    const product = this.product();
    if (!product) return;
    const cartItem = {
      id: product.id,
      productId: product.id,
      title: product.title,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
    };

    this.addToCartOutput.emit({
      ...cartItem,
      total: cartItem.quantity * cartItem.price,
    });

    this.store.addToCart(cartItem);
  }

  alreadyOnCart(productId: number): boolean {
    const cart = this.store.cart();
    return cart ? cart.some((item) => item.id === productId) : false;
  }
}
