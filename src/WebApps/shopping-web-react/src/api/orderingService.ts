import type { GetOrderByIdResponse, GetOrdersByCustomerResponse, GetOrdersByNameResponse, GetOrdersResponse } from '../types/order';
import apiClient from './client';

export const orderingService = {
  getOrders: async (pageIndex: number = 1, pageSize: number = 10): Promise<GetOrdersResponse> => {
    const response = await apiClient.get<GetOrdersResponse>(
      `/ordering-service/orders`,
      { params: { pageIndex, pageSize } }
    );
    return response.data;
  },

  getOrdersByName: async (orderName: string): Promise<GetOrdersByNameResponse> => {
    const response = await apiClient.get<GetOrdersByNameResponse>(
      `/ordering-service/orders/${orderName}`
    );
    return response.data;
  },

  getOrderById: async (orderId?: string): Promise<GetOrderByIdResponse> => {
    const response = await apiClient.get<GetOrderByIdResponse>(
      `/ordering-service/order/${orderId || 'testplaceholder'}`
    );
    return response.data;
  },

  getOrdersByCustomer: async (customerId: string): Promise<GetOrdersByCustomerResponse> => {
    const response = await apiClient.get<GetOrdersByCustomerResponse>(
      `/ordering-service/orders/customer/${customerId}`
    );
    return response.data;
  },
};