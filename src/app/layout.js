// import './globals.css'
// import Header from '@/components/Header'
// import { CartProvider } from '@/context/CartContext'
// import { WishlistProvider } from '@/context/WishlistContext'

// export const metadata = {
//   title: 'Sarikar Prakritik',
//   description: 'Natural Beauty Products',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="antialiased">
//         <CartProvider>
//           <WishlistProvider>
//             <Header />
//             {children}
//           </WishlistProvider>
//         </CartProvider>
//       </body>
//     </html>
//   )
// }

import './globals.css';
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import SessionProvider from '@/components/SessionProvider'; // <-- Use the correct path for your project

export const metadata = {
  title: 'Sarikar Prakritik',
  description: 'Natural Beauty Products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider> {/* <-- Wrap your providers with SessionProvider */}
          <CartProvider>
            <WishlistProvider>
              <Header />
              {children}
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
