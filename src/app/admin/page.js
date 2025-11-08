'use client'
import { useState, useEffect } from 'react'

export default function AdminPanel() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hair Care',
    description: '',
    price: '',
    image: '',
    details: ''
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const response = await fetch('/api/products')
    const data = await response.json()
    setProducts(data)
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    
    const url = editingProduct 
      ? `/api/products/${editingProduct._id}`
      : '/api/products'
    
    const method = editingProduct ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, price: Number(formData.price) })
    })

    if (response.ok) {
      fetchProducts()
      resetForm()
      alert(editingProduct ? 'Product updated!' : 'Product added!')
    }
  }

  // Delete product
  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      fetchProducts()
      alert('Product deleted!')
    }
  }

  // Edit product
  function handleEdit(product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
      details: product.details
    })
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      name: '',
      category: 'Hair Care',
      description: '',
      price: '',
      image: '',
      details: ''
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex gap-4">
            <a href="/" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
              View Store
            </a>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="border p-2 rounded"
                >
                  <option>Hair Care</option>
                  <option>Body Care</option>
                  <option>Skin Care</option>
                  <option>Lip Care</option>
                </select>
              </div>
              
              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              
              <textarea
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border p-2 rounded w-full h-20"
                required
              />
              
              <textarea
                placeholder="Detailed Description"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="border p-2 rounded w-full h-24"
                required
              />
              
              <button 
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">All Products ({products.length})</h2>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-600">{product.category} - ₹{product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
