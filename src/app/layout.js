import './globals.css'
import Header from '@/components/Header'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

export const metadata = {
  title: 'Sarikar Prakritik',
  description: 'Natural Beauty Products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
