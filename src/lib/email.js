import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(orderData) {
  try {
    const { shippingInfo, items, totalAmount, orderId } = orderData

    const itemsList = items
      .map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `)
      .join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            .total { font-size: 20px; font-weight: bold; color: #667eea; }
            .button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed! 🎉</h1>
              <p>Thank you for your purchase</p>
            </div>
            <div class="content">
              <p>Hi ${shippingInfo.fullName},</p>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h3 style="margin-top: 20px;">Items Ordered:</h3>
                <table>
                  <thead>
                    <tr style="background: #f5f5f5;">
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                      <th style="padding: 10px; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 20px;">
                  <p class="total">Total Amount: ₹${totalAmount}</p>
                </div>
              </div>
              
              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>
                  ${shippingInfo.fullName}<br>
                  ${shippingInfo.address}<br>
                  ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}<br>
                  Phone: ${shippingInfo.phone}
                </p>
              </div>
              
              <p>We'll send you another email when your order ships.</p>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="button">
                  Continue Shopping
                </a>
              </center>
            </div>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // FIXED: Using Resend's verified domain
      to: shippingInfo.email,
      subject: `Order Confirmation - ${orderId}`,
      html: emailHtml,
    })

    if (error) {
      console.error('❌ Customer email error:', error)
      return { success: false, error }
    }

    console.log('✅ Customer email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotification(orderData) {
  try {
    const { shippingInfo, items, totalAmount, orderId } = orderData

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>🛒 New Order Received!</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${shippingInfo.fullName}</p>
          <p><strong>Email:</strong> ${shippingInfo.email}</p>
          <p><strong>Phone:</strong> ${shippingInfo.phone}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          
          <h3>Items:</h3>
          <ul>
            ${items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
          </ul>
          
          <h3>Shipping Address:</h3>
          <p>
            ${shippingInfo.address}<br>
            ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}
          </p>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders" 
             style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            View Order in Admin Panel
          </a>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // FIXED: Using Resend's verified domain
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `New Order: ${orderId} - ₹${totalAmount}`,
      html: emailHtml,
    })

    if (error) {
      console.error('❌ Admin email error:', error)
      return { success: false, error }
    }

    console.log('✅ Admin email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Admin notification failed:', error)
    return { success: false, error }
  }
}
