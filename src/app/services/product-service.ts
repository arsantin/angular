import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  getProducts() {
    return this.http.get('http://187.77.47.69:3000/products');
  }
}
