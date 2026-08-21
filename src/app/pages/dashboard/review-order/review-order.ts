import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductSearchStore } from '../../../../store';

@Component({
  selector: 'app-review-order',
  imports: [],
  templateUrl: './review-order.html',
  styleUrl: './review-order.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewOrder {
  protected store = inject(ProductSearchStore);
}
