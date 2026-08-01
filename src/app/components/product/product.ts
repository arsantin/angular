import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  title = input<string>('');
  description = input<string>('');
  price = input<number>(0);
  quantity = input<number>(0);
}
