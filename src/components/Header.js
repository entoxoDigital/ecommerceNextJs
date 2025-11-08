'use client'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { getTotalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4 md:mb-0">
          <a href="/" className="text-2xl font-bold text-gray-900">
            Sarikar Prakritik
          </a>
          <nav className="flex gap-6 items-center">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
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
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
      </div>
    </header>
  )
}
