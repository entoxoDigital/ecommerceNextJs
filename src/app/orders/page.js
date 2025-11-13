import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import clientPromise from "../../../lib/mongodb"; // Make sure this path is correct!
import Link from "next/link";

async function getUserOrders(userId) {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");
    const orders = await db.collection("orders")
      .find({ "shippingInfo.userId": userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    // We need to serialize the _id field from ObjectId to a string
    return orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt.toDateString(), // Format date for display
      totalAmount: order.totalAmount.toFixed(2),
    }));
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    redirect("/login?callbackUrl=/orders");
  }

  // Fetch the orders for the logged-in user
  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-semibold text-gray-800">{order.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-gray-800">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-xs text-gray-600">{order._id}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {order.status === 'pending' ? 'Processing Order' : 'Order Shipped'}
                  </h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
