import type { PaginatedResult } from "./order";

export interface Product {
  id: string;
  name: string;
  category: string[];
  description: string;
  imageFile: string;
  price: number;
}

export interface GetProductsResponse {
  products: PaginatedResult<Product>;
}

export interface GetProductByIdResponse {
  product: Product;
}

export interface GetProductByCategoryResponse {
  products: Product[];
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}