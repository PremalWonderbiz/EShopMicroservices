import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCartStore } from '../store/cartStore';
import { basketService } from '../api/basketService';
import Loading from '../components/common/Loading';
import type { BasketCheckout } from '../types/cart';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emailAddress: yup.string().email('Invalid email').required('Email is required'),
  addressLine: yup.string().required('Address is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  cardName: yup.string().required('Card name is required'),
  cardNumber: yup.string().required('Card number is required'),
  expiration: yup.string().required('Expiration is required'),
  cvv: yup.string().required('CVV is required'),
});

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, loadCart, loading: cartLoading } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const onSubmit = async (data: any) => {
    if (!cart) return;

    setSubmitting(true);
    try {
      const checkoutData: BasketCheckout = {
        ...data,
        userName: cart.userName,
        customerId: '58C49479-EC65-4DE2-86E7-033C546291AA',
        totalPrice: cart.totalPrice,
        paymentMethod: 1,
      };

      await basketService.checkoutBasket({
        basketCheckoutDto: checkoutData,
      });

      await clearCart();
      navigate('/confirmation');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while cart is being loaded
  if (cartLoading) {
    return <Loading fullScreen message="Loading checkout..." />;
  }

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      
      {submitting && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white p-5 rounded shadow">
            <Loading message="Processing your order..." />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0">Shipping Information</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input {...register('emailAddress')} className={`form-control ${errors.emailAddress ? 'is-invalid' : ''}`} />
                  {errors.emailAddress && (
                    <div className="invalid-feedback">{errors.emailAddress.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input {...register('addressLine')} className={`form-control ${errors.addressLine ? 'is-invalid' : ''}`} />
                  {errors.addressLine && (
                    <div className="invalid-feedback">{errors.addressLine.message}</div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input {...register('country')} className={`form-control ${errors.country ? 'is-invalid' : ''}`} />
                    {errors.country && (
                      <div className="invalid-feedback">{errors.country.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input {...register('state')} className={`form-control ${errors.state ? 'is-invalid' : ''}`} />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state.message}</div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Zip Code</label>
                  <input {...register('zipCode')} className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`} />
                  {errors.zipCode && (
                    <div className="invalid-feedback">{errors.zipCode.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="mb-0">Payment Information</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Card Name</label>
                  <input {...register('cardName')} className={`form-control ${errors.cardName ? 'is-invalid' : ''}`} />
                  {errors.cardName && (
                    <div className="invalid-feedback">{errors.cardName.message}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input {...register('cardNumber')} className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`} placeholder="1234 5678 9012 3456" />
                  {errors.cardNumber && (
                    <div className="invalid-feedback">{errors.cardNumber.message}</div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiration</label>
                    <input
                      {...register('expiration')}
                      placeholder="MM/YY"
                      className={`form-control ${errors.expiration ? 'is-invalid' : ''}`}
                    />
                    {errors.expiration && (
                      <div className="invalid-feedback">{errors.expiration.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input {...register('cvv')} className={`form-control ${errors.cvv ? 'is-invalid' : ''}`} placeholder="123" />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv.message}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-light">
                <h4 className="mb-0">Order Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.items.reduce((sum, i) => sum + i.quantity, 0)}):</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-success">${cart.totalPrice.toFixed(2)}</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mt-3"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;