export const dynamic = 'force-dynamic'

import clientPromise from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    // Await params in Next.js 15+
    const { id } = await params
    
    console.log('Fetching product with ID:', id)
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id)
      return Response.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const product = await db.collection('products').findOne({
      _id: new ObjectId(id)
    })
    
    console.log('Product found:', product ? product.name : 'Not found')
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return Response.json(product, { status: 200 })
  } catch (error) {
    console.error('API ERROR:', error.message)
    console.error('Full error:', error)
    return Response.json({ 
      error: 'Failed to fetch product',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return Response.json({ message: 'Product updated' }, { status: 200 })
  } catch (error) {
    console.error('PUT ERROR:', error)
    return Response.json({ 
      error: 'Failed to update product',
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE - Remove product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return Response.json({ message: 'Product deleted' }, { status: 200 })
  } catch (error) {
    console.error('DELETE ERROR:', error)
    return Response.json({ 
      error: 'Failed to delete product',
      message: error.message 
    }, { status: 500 })
  }
}
