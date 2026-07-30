import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: number = 0;
  @Input() quantity: number = 0;
}
