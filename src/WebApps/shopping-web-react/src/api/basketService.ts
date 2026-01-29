import type { CheckoutBasketRequest, CheckoutBasketResponse, DeleteBasketResponse, GetBasketResponse, ShoppingCart, StoreBasketRequest, StoreBasketResponse } from '../types/cart';
import apiClient from './client';

const DEFAULT_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME || 'swn';

export const basketService = {
  getBasket: async (userName: string = DEFAULT_USERNAME): Promise<GetBasketResponse> => {
    const response = await apiClient.get<GetBasketResponse>(
      `/basket-service/basket/${userName}`
    );
    return response.data;
  },

  storeBasket: async (request: StoreBasketRequest): Promise<StoreBasketResponse> => {
    const response = await apiClient.post<StoreBasketResponse>(
      `/basket-service/basket`,
      request
    );
    return response.data;
  },

  deleteBasket: async (userName: string = DEFAULT_USERNAME): Promise<DeleteBasketResponse> => {
    const response = await apiClient.delete<DeleteBasketResponse>(
      `/basket-service/basket/${userName}`
    );
    return response.data;
  },

  checkoutBasket: async (request: CheckoutBasketRequest): Promise<CheckoutBasketResponse> => {
    const response = await apiClient.post<CheckoutBasketResponse>(
      `/basket-service/basket/checkout`,
      request
    );
    return response.data;
  },

  loadUserBasket: async (): Promise<ShoppingCart> => {
    try {
      const response = await basketService.getBasket(DEFAULT_USERNAME);
      return response.cart;
    } catch (error : any) {
      if (error.response?.status === 404) {
        // Return empty basket if not found
        return {
          userName: DEFAULT_USERNAME,
          items: [],
          totalPrice: 0,
        };
      }
      throw error;
    }
  },
};