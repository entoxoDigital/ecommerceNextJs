// 'use client'
// import { useState, useEffect, Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import ProductCard from '@/components/ProductCard'

// // Separate component that uses useSearchParams
// function ProductList() {
//   const [products, setProducts] = useState([])
//   const [categories, setCategories] = useState(["All"])
//   const [selectedCategory, setSelectedCategory] = useState("All")
//   const [loading, setLoading] = useState(true)
//   const searchParams = useSearchParams()
//   const searchQuery = searchParams.get('search') || ''

//   // Fetch products from API
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const response = await fetch('/api/products')
//         const data = await response.json()
//         setProducts(data)
        
//         // Extract unique categories
//         const uniqueCategories = ["All", ...new Set(data.map(p => p.category))]
//         setCategories(uniqueCategories)
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching products:', error)
//         setLoading(false)
//       }
//     }
//     fetchProducts()
//   }, [])

//   const filteredProducts = products.filter(product => {
//     const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
//     const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
//     return matchesCategory && matchesSearch
//   })

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto text-center py-12">
//         <p className="text-gray-600">Loading products...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold text-gray-900 mb-2">
//         Our Products
//       </h1>
//       {searchQuery && (
//         <p className="text-gray-600 mb-6">
//           Showing results for "{searchQuery}"
//         </p>
//       )}
      
//       {/* Category Filter Buttons */}
//       <div className="flex flex-wrap gap-3 mb-8">
//         {categories.map(category => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-6 py-2 rounded-full font-semibold transition-colors ${
//               selectedCategory === category
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Products Grid */}
//       {products.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-gray-600 text-lg mb-4">No products yet!</p>
//           <a href="/admin" className="text-blue-600 hover:underline">
//             Go to Admin Panel to add products
//           </a>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredProducts.map(product => (
//             <ProductCard key={product._id} product={{ ...product, id: product._id }} />
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {filteredProducts.length === 0 && products.length > 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-600 text-lg">
//             No products found. Try a different search or category.
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <Suspense fallback={
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center py-12">
//             <p className="text-gray-600">Loading products...</p>
//           </div>
//         </div>
//       }>
//         <ProductList />
//       </Suspense>
//     </div>
//   )
// }


'use client'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedCategory, searchQuery, sortBy])

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  function filterAndSortProducts() {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const categories = ['All', 'Hair Care', 'Body Care', 'Skin Care', 'Lip Care']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Sarikar Prakritik</h1>
          <p className="text-xl mb-8">Natural Beauty Products for Your Wellness</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            {searchQuery && (
              <p>
                Found <span className="font-bold">{filteredProducts.length}</span> results for "{searchQuery}"
              </p>
            )}
            {!searchQuery && selectedCategory !== 'All' && (
              <p>
                Showing <span className="font-bold">{filteredProducts.length}</span> products in {selectedCategory}
              </p>
            )}
            {!searchQuery && selectedCategory === 'All' && (
              <p>
                Showing all <span className="font-bold">{filteredProducts.length}</span> products
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
