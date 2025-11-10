'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product }) {
  const { addToCart, removeFromCart, cart = [] } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Ensure we're using the correct ID
  const productId = product._id || product.id

  // Find if product is already in cart and get its quantity
  const cartItem = cart.find(item => 
    item.id === productId || item._id === productId
  )
  const quantityInCart = cartItem ? cartItem.quantity : 0

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(productId)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, id: productId })
  }

  const handleIncrement = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, id: productId })
  }

  const handleDecrement = (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromCart(productId)
  }

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(productId)
    } else {
      addToWishlist({ ...product, id: productId })
    }
  }

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Badge type
  const getBadge = () => {
    if (product.badge === 'Bestseller') return { text: 'BESTSELLER', bg: 'bg-orange-500' }
    if (product.badge === 'In High Demand') return { text: 'IN HIGH DEMAND', bg: 'bg-red-500' }
    if (product.badge === 'New In' || product.isNew) return { text: 'NEW IN', bg: 'bg-black' }
    return null
  }

  const badge = getBadge()

  // Star rating component
  const StarRating = ({ rating = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400' : 'fill-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <Link href={`/products/${productId}`}>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative">
        {/* Wishlist Heart Icon */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <svg
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : 'fill-none'} stroke-gray-700 stroke-2`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Product Image */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
          
          {/* Badge */}
          {badge && (
            <div className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-bold px-3 py-1 rounded`}>
              {badge.text}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 text-base mb-2">
            {product.name}
          </h3>
          
          <div className="mb-2">
            <StarRating rating={product.rating || 5} />
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-900 font-bold text-lg">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-600 text-sm font-semibold">
                  {discountPercent}% Off
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button OR Quantity Selector */}
          {quantityInCart === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full border-2 border-black text-black font-semibold py-2.5 rounded-full hover:bg-black hover:text-white transition-colors duration-200 text-sm uppercase tracking-wide mt-auto"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-center gap-4 border-2 border-black rounded-full py-2 mt-auto">
              <button
                onClick={handleDecrement}
                className="text-black font-bold text-xl px-3 hover:text-gray-600"
              >
                −
              </button>
              <span className="font-bold text-lg min-w-[20px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="text-black font-bold text-xl px-3 hover:text-gray-600"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
