// 'use client';

// import Link from 'next/link';
// import { useCart } from '@/context/CartContext';
// import { useWishlist } from '@/context/WishlistContext';
// import { useSession, signOut } from 'next-auth/react'; // <-- Import useSession and signOut

// export default function Header() {
//   const { cartItems } = useCart();
//   const { wishlist } = useWishlist();
//   const { data: session, status } = useSession(); // <-- Get session data

//   const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Left Section - Logo and Title */}
//           <div className="flex items-center space-x-4">
//             <Link href="/" className="text-2xl font-bold text-gray-900">
//               Sarikar Prakritik
//             </Link>
//           </div>

//           {/* Right Section - Icons and Auth */}
//           <div className="flex items-center space-x-6">
//             {/* Wishlist Icon */}
//             <Link href="/wishlist" className="relative text-gray-600 hover:text-gray-900">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
//               </svg>
//               {wishlist.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {wishlist.length}
//                 </span>
//               )}
//             </Link>

//             {/* Cart Icon */}
//             <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
//               </svg>
//               {totalCartItems > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {totalCartItems}
//                 </span>
//               )}
//             </Link>

//             {/* Authentication Links */}
//             {status === 'loading' ? (
//               <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
//             ) : session ? (
//               // If user is logged in
//               <div className="flex items-center space-x-4">
//                 <Link href="/orders" className="text-sm font-medium text-gray-700 hover:text-gray-900">
//                   My Orders
//                 </Link>
//                 <button
//                   onClick={() => signOut({ callbackUrl: '/' })}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               // If user is logged out
//               <div className="flex items-center space-x-4">
//                 <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
//                   Login
//                 </Link>
//                 <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSession, signOut } from 'next-auth/react';

// A simple User Icon component
const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

export default function Header() {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { data: session, status } = useSession();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Sarikar Prakritik
          </Link>

          {/* Right Section */}
            
            <div className="flex items-center space-x-6">
             {/* Wishlist Icon */}
             <Link href="/wishlist" className="relative text-gray-600 hover:text-gray-900">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
               </svg>
               {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Authentication Section */}
            <div className="relative">
              {status === 'loading' ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : session ? (
                // --- Logged-in User: Profile Dropdown ---
                <div ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center text-gray-600 hover:text-gray-900">
                    <UserIcon />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-semibold">{session.user.name}</p>
                        <p className="text-xs truncate">{session.user.email}</p>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                        My Orders
                      </Link>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // --- Logged-out User: Login/Signup Buttons ---
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
