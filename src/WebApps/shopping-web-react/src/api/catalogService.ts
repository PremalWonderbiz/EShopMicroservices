import type { GetProductByCategoryResponse, GetProductByIdResponse, GetProductsResponse, PaginationParams } from '../types/product';
import apiClient from './client';

export const catalogService = {
  getProducts: async (params?: PaginationParams): Promise<GetProductsResponse> => {
    const { pageNumber = 1, pageSize = 10 } = params || {};
    const response = await apiClient.get<GetProductsResponse>(
      `/catalog-service/products`,
      { params: { pageNumber, pageSize } }
    );
    return response.data;
  },

  getProduct: async (id: string): Promise<GetProductByIdResponse> => {
    const response = await apiClient.get<GetProductByIdResponse>(
      `/catalog-service/products/${id}`
    );
    return response.data;
  },

  getProductsByCategory: async (category: string): Promise<GetProductByCategoryResponse> => {
    const response = await apiClient.get<GetProductByCategoryResponse>(
      `/catalog-service/products/category/${category}`
    );
    return response.data;
  },

  getProductById: async (id: string): Promise<GetProductByIdResponse> => {
    const response = await apiClient.get<GetProductByIdResponse>(
      `/catalog-service/products/${id}`
    );
    return response.data;
  },
};