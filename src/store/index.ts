import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
//import { Book } from './book';

interface IProducts {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

interface ICartItem {
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

interface IOrder {
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

type ProductSearchState = {
  products: Array<IProducts>;
  cart: Array<ICartItem>;
  orders: Array<IOrder>;
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
  cart: [],
  orders: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ProductSearchStore = signalStore(
  // 👇 Providing `ProductSearchStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    productCount: computed(() => state.products.length),
  })),
  withMethods((store) => ({
    addProduct(product: IProducts) {
      patchState(store, (state) => ({
        products: [...state.products, product],
      }));
    },
    addToCart(cartItem: ICartItem) {
      patchState(store, (state) => ({
        cart: [...state.cart, cartItem],
      }));
    },
    removeFromCart(id: number) {
      console.log('Removing item with id:', id);
      patchState(store, (state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      }));
      console.log('Current cart after removal:', store.cart());
    },
  })),
);
