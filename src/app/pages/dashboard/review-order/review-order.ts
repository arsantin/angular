import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductSearchStore } from '../../../../store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-review-order',
  imports: [JsonPipe],
  templateUrl: './review-order.html',
  styleUrl: './review-order.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReviewOrder {
  protected store = inject(ProductSearchStore);
  constructor() {}
}
