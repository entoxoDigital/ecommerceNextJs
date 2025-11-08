export const dynamic = 'force-dynamic'

import clientPromise from '../../../../lib/mongodb'

// GET - Fetch all products
export async function GET() {
  try {
    console.log('API: Attempting to connect to MongoDB...')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
    const client = await clientPromise
    console.log('API: Connected to MongoDB successfully')
    
    const db = client.db('ecommerce')
    console.log('API: Database selected:', db.databaseName)
    
    const products = await db.collection('products').find({}).toArray()
    console.log('API: Found products:', products.length)
    
    return Response.json(products, { status: 200 })
  } catch (error) {
    console.error('API ERROR:', error.message)
    console.error('Full error:', error)
    return Response.json({ 
      error: 'Failed to fetch products',
      message: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}

// POST - Add new product
export async function POST(request) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('ecommerce')
    
    const newProduct = {
      ...body,
      createdAt: new Date()
    }
    
    const result = await db.collection('products').insertOne(newProduct)
    
    return Response.json(
      { message: 'Product created', productId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST ERROR:', error)
    return Response.json({ 
      error: 'Failed to create product',
      message: error.message 
    }, { status: 500 })
  }
}
