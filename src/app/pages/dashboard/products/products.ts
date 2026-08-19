import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../components/product/product';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  http = inject(HttpClient);

  products = signal<Product[]>([]);

  constructor() {
    //     this.http.get(`${environment.baseUrl}/products`).subscribe((product) => {
    //       console.log('product', product);
    //       this.products.set(product as Products[]);
    //     });
  }
}
