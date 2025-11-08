'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

// Separate component that uses useSearchParams
function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(p => p.category))]
        setCategories(uniqueCategories)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <p className="text-gray-600">Loading products...</p>
      </div>
    )
  }

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
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">No products yet!</p>
          <a href="/admin" className="text-blue-600 hover:underline">
            Go to Admin Panel to add products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={{ ...product, id: product._id }} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No products found. Try a different search or category.
          </p>
        </div>
      )}
    </div>
  )
}

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
