import { useState, useEffect } from 'react';
import { orderingService } from '../api/orderingService';
import type { Order, PaginatedResult } from '../types/order';

export const useOrders = (pageIndex: number = 1, pageSize: number = 10) => {
  const [orders, setOrders] = useState<PaginatedResult<Order> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderingService.getOrders(pageIndex, pageSize);
        setOrders(response.orders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pageIndex, pageSize]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderingService.getOrders(pageIndex, pageSize);
      setOrders(response.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
};