import { signalStore, withState } from '@ngrx/signals';
//import { Book } from './book';

type ProductSearchState = {
  products: Array<{
    id: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
  }>;
  cart: Array<{
    id: number;
    productId: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  orders: Array<{
    id: number;
    productId: number;
    quantity: number;
    totalPrice: number;
  }>;
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ProductSearchState = {
  products: [
    {
      id: 1,
      title: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      quantity: 1,
    },
  ],
  cart: [
    {
      id: 1,
      productId: 1,
      title: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      quantity: 1,
      totalPrice: 100,
    },
  ],
  orders: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ProductSearchStore = signalStore(
  // 👇 Providing `ProductSearchStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
);
