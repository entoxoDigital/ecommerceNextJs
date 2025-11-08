'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/data/products'

// Separate component that uses useSearchParams
function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Our Products
      </h1>
      {searchQuery && (
        <p className="text-gray-600 mb-6">
          Showing results for "{searchQuery}"
        </p>
      )}
      
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No products found. Try a different search or category.
          </p>
        </div>
      )}
    </div>
  )
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }>
        <ProductList />
      </Suspense>
    </div>
  )
}
