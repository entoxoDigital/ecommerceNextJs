'use client'
import { useState, useEffect } from 'react'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    revenueByCategory: {},
    ordersByStatus: {},
    revenueByMonth: {},
    recentSales: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders')
      const orders = await ordersRes.json()

      // Fetch products
      const productsRes = await fetch('/api/products')
      const products = await productsRes.json()

      // Calculate Total Revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

      // Calculate Average Order Value
      const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

      // Orders by Status
      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      }

      // Top Selling Products
      const productSales = {}
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = { 
              name: item.name, 
              quantity: 0, 
              revenue: 0 
            }
          }
          productSales[item.id].quantity += item.quantity
          productSales[item.id].revenue += item.price * item.quantity
        })
      })

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Revenue by Category
      const revenueByCategory = {}
      orders.forEach(order => {
        order.items?.forEach(item => {
          const product = products.find(p => p._id === item.id)
          const category = product?.category || 'Other'
          if (!revenueByCategory[category]) {
            revenueByCategory[category] = 0
          }
          revenueByCategory[category] += item.price * item.quantity
        })
      })

      // Revenue by Month (Last 6 months)
      const revenueByMonth = {}
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      orders.forEach(order => {
        const date = new Date(order.orderDate)
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        if (!revenueByMonth[monthYear]) {
          revenueByMonth[monthYear] = 0
        }
        revenueByMonth[monthYear] += order.totalAmount || 0
      })

      // Recent Sales (Last 10)
      const recentSales = orders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 10)

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        averageOrderValue,
        topProducts,
        revenueByCategory,
        ordersByStatus,
        revenueByMonth,
        recentSales
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-green-500"
        />
        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon="📦"
          color="bg-blue-500"
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${analytics.averageOrderValue}`}
          icon="💳"
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 capitalize font-medium">{status}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'pending' ? 'bg-yellow-500' :
                      status === 'processing' ? 'bg-blue-500' :
                      status === 'completed' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${(count / analytics.totalOrders) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Category</h2>
          <div className="space-y-4">
            {Object.entries(analytics.revenueByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, revenue]) => (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{category}</span>
                    <span className="font-bold text-gray-900">₹{revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ 
                        width: `${(revenue / analytics.totalRevenue) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
        {analytics.topProducts.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No sales data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Units Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topProducts.map((product, index) => (
                  <tr key={product.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      } font-bold`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-900">{product.quantity} units</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Timeline</h2>
        {Object.keys(analytics.revenueByMonth).length === 0 ? (
          <p className="text-gray-600 text-center py-8">No revenue data yet</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(analytics.revenueByMonth)
              .sort((a, b) => {
                const dateA = new Date(a[0])
                const dateB = new Date(b[0])
                return dateB - dateA
              })
              .map(([month, revenue]) => (
                <div key={month}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{month}</span>
                    <span className="font-bold text-gray-900">₹{revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{ 
                        width: `${Math.min((revenue / Math.max(...Object.values(analytics.revenueByMonth))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h2>
        {analytics.recentSales.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No sales yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.recentSales.map(sale => (
              <div key={sale._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-900">{sale.orderId}</p>
                  <p className="text-sm text-gray-600">{sale.shippingInfo?.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(sale.orderDate).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">₹{sale.totalAmount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-14 h-14 rounded-lg flex items-center justify-center text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
