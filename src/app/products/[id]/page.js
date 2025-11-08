'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { products } from '@/data/products'

export default function ProductDetail({ params }) {
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(params.id))

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-96">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-gray-700 mb-6">
                {product.details}
              </p>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{product.price}
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
