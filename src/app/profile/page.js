import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from 'next/link';

// You can create a reusable UserIcon component if you like
const UserIcon = () => (
  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
const OrderIcon = () => (
    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);

export default async function ProfilePage() {
  // Get the server-side session
  const session = await getServerSession(authOptions);

  // If no session exists, redirect the user to the login page
  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  // Extract user details from the session
  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Profile Header */}
          <div className="p-8 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-md text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* My Orders Link */}
              <Link href="/orders">
                <div className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg flex items-center space-x-4 transition-colors">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <OrderIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Orders</h3>
                    <p className="text-sm text-gray-600">View your order history</p>
                  </div>
                </div>
              </Link>
              
              {/* More links can be added here */}
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4 cursor-not-allowed opacity-50">
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Edit Profile</h3>
                    <p className="text-sm text-gray-600">Feature coming soon</p>
                  </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
