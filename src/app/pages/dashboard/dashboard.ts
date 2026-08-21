import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductSearchStore } from '../../../store';
import { Cart } from "../../components/cart/cart";

@Component({
  selector: 'app-dashboard',
  imports: [Cart],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {
  store = inject(ProductSearchStore);
}
