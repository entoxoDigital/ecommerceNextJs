export const dynamic = 'force-dynamic'

import clientPromise from '../../../../lib/mongodb'
import { sendOrderConfirmationEmail, sendAdminNotification } from '@/lib/email'

// GET - Fetch all orders
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const orders = await db
      .collection('orders')
      .find({})
      .sort({ orderDate: -1 })
      .toArray()
    
    return Response.json(orders)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST - Create new order
// export async function POST(request) {
//   try {
//     const orderData = await request.json()
    
//     const client = await clientPromise
//     const db = client.db('ecommerce')
    
//     const newOrder = {
//       ...orderData,
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }
    
//     const result = await db.collection('orders').insertOne(newOrder)
    
//     // Send email notifications (don't wait for them)
//     if (process.env.RESEND_API_KEY) {
//       sendOrderConfirmationEmail(newOrder).catch(console.error)
//       sendAdminNotification(newOrder).catch(console.error)
//     }
    
//     return Response.json({ 
//       success: true, 
//       orderId: result.insertedId,
//       order: newOrder
//     }, { status: 201 })
//   } catch (error) {
//     return Response.json({ error: 'Failed to create order' }, { status: 500 })
//   }
// }

// POST - Create new order
// POST - Create new order
export async function POST(request) {
  try {
    const orderData = await request.json()
    
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const newOrder = {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('orders').insertOne(newOrder)
    
    // Send only admin notification (customer email requires domain verification)
    if (process.env.RESEND_API_KEY) {
      sendAdminNotification(newOrder).catch(console.error)
    }
    
    return Response.json({ 
      success: true, 
      orderId: result.insertedId,
      order: newOrder
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Order creation error:', error)
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
