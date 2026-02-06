export const OrderStatus = {
  Draft: 1,
  Pending: 2,
  Completed: 3,
  Cancelled: 4,
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Address {
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface Payment {
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}

export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderName: string;
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  status: OrderStatus;
  orderItems: OrderItem[];
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface GetOrdersResponse {
  orders: PaginatedResult<Order>;
}

export interface GetOrdersByNameResponse {
  orders: Order[];
}

export interface GetOrderByIdResponse {
  order: Order;
}

export interface GetOrdersByCustomerResponse {
  orders: PaginatedResult<Order>;
}