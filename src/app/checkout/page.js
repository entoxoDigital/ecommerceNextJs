'use client'
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- START OF FIX ---
  // Handle all side effects (like redirection) in useEffect hooks.
  useEffect(() => {
    // If the session is loading, do nothing yet.
    if (status === 'loading') {
      return;
    }

    // If the user is not authenticated, redirect to login.
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    
    // If the cart is empty, redirect to the cart page.
    // We check `cart` dependency to re-run this effect if the cart changes.
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Pre-fill user data from session if available.
    if (session) {
      setShippingInfo(prevInfo => ({
        ...prevInfo,
        fullName: prevInfo.fullName || session.user.name || '',
        email: prevInfo.email || session.user.email || '',
      }));
    }
  }, [status, session, cart, router]);
  // --- END OF FIX ---

  // Show a loading state while session or cart status is being determined.
  if (status === 'loading' || cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading Checkout...</div>;
  }

  // Calculate totals
  const subtotal = getTotalPrice();
  const shippingCost = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    if (!requiredFields.every(field => shippingInfo[field].trim() !== '')) {
      alert('Please fill all required fields');
      setIsProcessing(false);
      return;
    }

    const orderData = {
      items: cart,
      shippingInfo: { ...shippingInfo, userId: session.user.id },
      paymentMethod,
      subtotal, tax, shippingCost,
      totalAmount: total,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to create order');
      const result = await response.json();
      clearCart();
      router.push(`/confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          {/* ... Your form JSX remains the same ... */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <input type="text" name="fullName" placeholder="Full Name *" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" name="email" placeholder="Email *" value={shippingInfo.email} onChange={handleInputChange} className="border border-gray-300 rounded-lg p-3" required />
                    <input type="tel" name="phone" placeholder="Phone Number *" value={shippingInfo.phone} onChange={handleInputChange} className="border border-gray-300 rounded-lg p-3" required />
                  </div>
                  <textarea name="address" placeholder="Address *" value={shippingInfo.address} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg p-3" required />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" name="city" placeholder="City *" value={shippingInfo.city} onChange={handleInputChange} className="border border-gray-300 rounded-lg p-3" required />
                    <input type="text" name="state" placeholder="State *" value={shippingInfo.state} onChange={handleInputChange} className="border border-gray-300 rounded-lg p-3" required />
                    <input type="text" name="pincode" placeholder="Pincode *" value={shippingInfo.pincode} onChange={handleInputChange} className="border border-gray-300 rounded-lg p-3" required />
                  </div>
                </div>
              </div>
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                   <label className="flex items-center p-4 border rounded-lg cursor-pointer"><input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" /><span className="ml-3 font-medium">Cash on Delivery</span></label>
                   <label className="flex items-center p-4 border rounded-lg cursor-pointer"><input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" /><span className="ml-3 font-medium">Online Payment</span></label>
                </div>
              </div>
            </div>
            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1"><div className="bg-white rounded-lg shadow-md p-6 sticky top-4"><h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2><div className="space-y-3 mb-4 max-h-60 overflow-y-auto">{cart.map(item => (<div key={item.id} className="flex gap-3"><div className="relative w-16 h-16 shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover rounded" /></div><div className="grow"><h4 className="text-sm font-semibold">{item.name}</h4><p className="text-xs text-gray-600">Qty: {item.quantity}</p><p className="text-sm font-bold">₹{item.price * item.quantity}</p></div></div>))}</div><div className="border-t pt-4 space-y-2"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div><div className="flex justify-between"><span>Tax (18%)</span><span>₹{tax}</span></div><div className="border-t pt-2 flex justify-between text-lg font-bold"><span>Total</span><span>₹{total}</span></div></div><button type="submit" disabled={isProcessing} className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-green-400">{isProcessing ? 'Processing...' : 'Place Order'}</button></div></div>
          </div>
        </form>
      </div>
    </div>
  );
}
