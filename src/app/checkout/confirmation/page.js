'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ConfirmationPage() {
  const { clearCart } = useCart()
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // Get order data from localStorage
    const lastOrder = localStorage.getItem('lastOrder')
    
    if (!lastOrder) {
      router.push('/')
      return
    }

    const order = JSON.parse(lastOrder)
    setOrderData(order)

    // Clear the cart after successful order
    clearCart()

    // Optional: Clear the order from localStorage after displaying
    // localStorage.removeItem('lastOrder')
  }, [router]) // Removed clearCart from dependencies

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Details</h2>
            <p className="text-gray-600">Order ID: <span className="font-semibold">{orderData.orderId}</span></p>
            <p className="text-gray-600">Date: {new Date(orderData.orderDate).toLocaleDateString()}</p>
          </div>

          {/* Shipping Information */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
            <p className="text-gray-600">{orderData.shippingInfo.fullName}</p>
            <p className="text-gray-600">{orderData.shippingInfo.address}</p>
            <p className="text-gray-600">
              {orderData.shippingInfo.city}, {orderData.shippingInfo.state} - {orderData.shippingInfo.pincode}
            </p>
            <p className="text-gray-600">Phone: {orderData.shippingInfo.phone}</p>
            <p className="text-gray-600">Email: {orderData.shippingInfo.email}</p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
            <p className="text-gray-600 capitalize">{orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {orderData.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{orderData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  )
}
