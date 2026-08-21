import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { firstValueFrom, Observable } from 'rxjs';
import { ProductService } from '../app/services/product-service';
//import { Book } from './book';

export interface IProduct {
  id: number;
  title: string;
  pic: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ICartItem {
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

type ProductSearchState = {
  products: Array<IProduct> | null;
  cart: Array<ICartItem> | null;
  orders: Array<IOrder> | null;
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ProductSearchState = {
  products: null,
  cart: (() => {
    // Load cart from localStorage immediately during initialization
    const savedCart = localStorage.getItem('app_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart) as Array<ICartItem>;
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('app_cart');
        return null;
      }
    }
    return null;
  })(),
  orders: null,
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ProductSearchStore = signalStore(
  // 👇 Providing `ProductSearchStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    productCount: computed(() => state?.products?.length),
  })),
  withProps(() => ({
    _productService: inject(ProductService),
  })),
  withMethods((store) => {
    const saveCartToLocalStorage = () => {
      const cart = store.cart();
      if (cart) {
        localStorage.setItem('app_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('app_cart');
      }
    };

    const loadCartFromLocalStorage = () => {
      const savedCart = localStorage.getItem('app_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart) as Array<ICartItem>;
          patchState(store, { cart });
          console.log('Loaded cart from localStorage:', cart);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          localStorage.removeItem('app_cart');
        }
      }
    };

    return {
      addProduct(product: IProduct) {
        patchState(store, (state) => ({
          products: state.products ? [...state.products, product] : [product],
        }));
      },
      addToCart(cartItem: ICartItem) {
        patchState(store, (state) => ({
          cart: state.cart ? [...state.cart, cartItem] : [cartItem],
        }));
        saveCartToLocalStorage();
      },
      removeFromCart(id: number) {
        console.log('Removing item with id:', id);
        patchState(store, (state) => ({
          cart: state.cart ? state.cart.filter((item) => item.id !== id) : null,
        }));
        saveCartToLocalStorage();
        console.log('Current cart after removal:', store.cart());
      },
      loadCartFromLocalStorage,
      addOrder(order: any) {
        console.log('Adding order:', order);
        patchState(store, (state) => ({
          orders: state.orders ? [...state.orders, order] : [order],
        }));
        console.log('Current orders after addition:', store.orders());
      },
      getOrders() {
        return store.orders();
      },
      async loadAll() {
        patchState(store, { isLoading: true });
        try {
          const products = await firstValueFrom(
            store._productService.getProducts() as unknown as Observable<IProduct[]>,
          );
          patchState(store, { products, isLoading: false });
          console.log('Fetched products:', products);
        } catch (error) {
          console.error('Error loading products:', error);
          patchState(store, { isLoading: false });
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadAll(); // Fetches data automatically when the store initializes
    },
  }),
);
