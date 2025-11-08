'use client'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { getTotalItems } = useCart()
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">
          My Store
        </div>
        <nav className="flex gap-6 items-center">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="/products" className="text-gray-600 hover:text-gray-900">Products</a>
          <a href="/cart" className="text-gray-600 hover:text-gray-900 relative">
            Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </a>
        </nav>
      </div>
    </header>
  )
}
