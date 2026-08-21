import { Component, inject } from '@angular/core';
import { Product } from '../../../components/product/product';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../../components/cart/cart';
import { ProductSearchStore } from '../../../../store';

@Component({
  selector: 'app-products',
  imports: [Product, Cart],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  http = inject(HttpClient);
  store = inject(ProductSearchStore);
}
