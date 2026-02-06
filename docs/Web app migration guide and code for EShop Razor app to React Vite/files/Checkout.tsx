import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { basketService } from '../../api/basketService';
import { Button, Input, Card, Badge } from '../../components/ui';
import { toast } from '../../components/ui/Toast';
import './Checkout.css';

// Validation Schema
const checkoutSchema = yup.object().shape({
  // Shipping Information
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emailAddress: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  addressLine: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  
  // Payment Information
  cardName: yup.string().required('Cardholder name is required'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
  expiration: yup
    .string()
    .required('Expiration date is required')
    .matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Format: MM/YY'),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^[0-9]{3,4}$/, 'CVV must be 3-4 digits'),
});

type CheckoutFormData = yup.InferType<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    mode: 'onBlur',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      toast.warning('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const steps = [
    { number: 1, label: 'Shipping', icon: MapPin },
    { number: 2, label: 'Payment', icon: CreditCard },
    { number: 3, label: 'Review', icon: CheckCircle },
  ];

  // Calculate totals
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        'firstName',
        'lastName',
        'emailAddress',
        'phone',
        'addressLine',
        'city',
        'state',
        'zipCode',
        'country',
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ['cardName', 'cardNumber', 'expiration', 'cvv'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const checkoutData = {
        userName: cart.userName,
        customerId: 'customer-001', // TODO: Get from auth
        totalPrice: total,
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        addressLine: data.addressLine,
        country: data.country,
        state: data.state,
        zipCode: data.zipCode,
        cardName: data.cardName,
        cardNumber: data.cardNumber,
        expiration: data.expiration,
        cvv: data.cvv,
        paymentMethod: 1, // Credit Card
      };

      await basketService.checkoutBasket({ basketCheckoutDto: checkoutData });
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/confirmation', { state: { orderData: checkoutData } });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="checkout-steps">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className={`step ${isActive ? 'step-active' : ''} ${
                  isCompleted ? 'step-completed' : ''
                }`}
              >
                <div className="step-icon">
                  {isCompleted ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <div className="step-label">{step.label}</div>
                {step.number < steps.length && <div className="step-connector" />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
          <div className="checkout-content">
            {/* Form Section */}
            <div className="checkout-form-section">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <Card className="form-card">
                  <h2 className="form-title">
                    <MapPin size={24} />
                    Shipping Information
                  </h2>

                  <div className="form-grid">
                    <Input
                      label="First Name"
                      {...register('firstName')}
                      error={errors.firstName?.message}
                      leftIcon={<User size={18} />}
                      required
                    />

                    <Input
                      label="Last Name"
                      {...register('lastName')}
                      error={errors.lastName?.message}
                      leftIcon={<User size={18} />}
                      required
                    />
                  </div>

                  <div className="form-grid">
                    <Input
                      label="Email Address"
                      type="email"
                      {...register('emailAddress')}
                      error={errors.emailAddress?.message}
                      leftIcon={<Mail size={18} />}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                      leftIcon={<Phone size={18} />}
                      required
                    />
                  </div>

                  <Input
                    label="Street Address"
                    {...register('addressLine')}
                    error={errors.addressLine?.message}
                    leftIcon={<MapPin size={18} />}
                    required
                  />

                  <div className="form-grid form-grid-3">
                    <Input
                      label="City"
                      {...register('city')}
                      error={errors.city?.message}
                      required
                    />

                    <Input
                      label="State"
                      {...register('state')}
                      error={errors.state?.message}
                      required
                    />

                    <Input
                      label="ZIP Code"
                      {...register('zipCode')}
                      error={errors.zipCode?.message}
                      required
                    />
                  </div>

                  <Input
                    label="Country"
                    {...register('country')}
                    error={errors.country?.message}
                    placeholder="United States"
                    required
                  />
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <Card className="form-card">
                  <h2 className="form-title">
                    <CreditCard size={24} />
                    Payment Information
                  </h2>

                  <Input
                    label="Cardholder Name"
                    {...register('cardName')}
                    error={errors.cardName?.message}
                    leftIcon={<User size={18} />}
                    placeholder="John Doe"
                    required
                  />

                  <Input
                    label="Card Number"
                    {...register('cardNumber')}
                    error={errors.cardNumber?.message}
                    leftIcon={<CreditCard size={18} />}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    required
                  />

                  <div className="form-grid">
                    <Input
                      label="Expiration Date"
                      {...register('expiration')}
                      error={errors.expiration?.message}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />

                    <Input
                      label="CVV"
                      {...register('cvv')}
                      error={errors.cvv?.message}
                      leftIcon={<Lock size={18} />}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="payment-methods">
                    <span className="payment-label">We accept:</span>
                    <div className="payment-icons">
                      <span className="payment-card">💳 Visa</span>
                      <span className="payment-card">💳 Mastercard</span>
                      <span className="payment-card">💳 Amex</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <Card className="form-card">
                  <h2 className="form-title">
                    <CheckCircle size={24} />
                    Review Your Order
                  </h2>

                  <div className="review-section">
                    <h3 className="review-subtitle">Shipping Address</h3>
                    <div className="review-content">
                      <p>
                        {formValues.firstName} {formValues.lastName}
                      </p>
                      <p>{formValues.addressLine}</p>
                      <p>
                        {formValues.city}, {formValues.state} {formValues.zipCode}
                      </p>
                      <p>{formValues.country}</p>
                      <p>{formValues.emailAddress}</p>
                      <p>{formValues.phone}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3 className="review-subtitle">Payment Method</h3>
                    <div className="review-content">
                      <p>💳 Card ending in {formValues.cardNumber?.slice(-4)}</p>
                      <p>{formValues.cardName}</p>
                      <p>Expires: {formValues.expiration}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3 className="review-subtitle">Order Items</h3>
                    <div className="review-items">
                      {cart.items.map((item) => (
                        <div key={item.productId} className="review-item">
                          <span className="review-item-name">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="review-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<ArrowLeft />}
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    rightIcon={<ArrowRight />}
                    onClick={handleNextStep}
                    className="ml-auto"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    rightIcon={<CheckCircle />}
                    isLoading={isSubmitting}
                    className="ml-auto"
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout-summary-section">
              <Card className="summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-items">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="summary-item">
                      <div className="summary-item-details">
                        <span className="summary-item-name">{item.productName}</span>
                        <span className="summary-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="summary-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="success" size="sm">FREE</Badge>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-security">
                  <Lock size={16} />
                  <span>Secure SSL encrypted checkout</span>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
