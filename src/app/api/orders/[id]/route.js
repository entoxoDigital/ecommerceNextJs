export const dynamic = 'force-dynamic'

import clientPromise from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single order
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const order = await db.collection('orders').findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT - Update order (status, tracking, etc.)
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        } 
      }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return Response.json({ success: true, message: 'Order updated' })
  } catch (error) {
    return Response.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE - Delete order
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const result = await db.collection('orders').deleteOne({ 
      _id: new ObjectId(id) 
    })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return Response.json({ success: true, message: 'Order deleted' })
  } catch (error) {
    return Response.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
