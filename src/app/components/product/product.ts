import { Component, computed, input, output, signal } from '@angular/core';

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
  title = input<string>('');
  description = input<string>('');
  price = input<number>(10);
  quantity = signal(0);
  total = computed(() => this.price() * this.quantity());

  // Emit cart items when "Add to Cart" is clicked
  addToCartOutput = output<CartItem>();

  addToCart() {
    this.addToCartOutput.emit({
      title: this.title(),
      description: this.description(),
      price: this.price(),
      quantity: this.quantity(),
      total: this.total(),
    });
  }
}
