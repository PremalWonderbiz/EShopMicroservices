import React from 'react';
import type { ShoppingCartItem } from '../../types/cart';

interface CartItemProps {
  item: ShoppingCartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <tr>
      <td>{item.productName}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value))}
          className="form-control"
          style={{ width: '80px' }}
        />
      </td>
      <td>${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button
          onClick={() => onRemove(item.productId)}
          className="btn btn-danger btn-sm"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;