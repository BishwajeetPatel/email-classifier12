'use client';

import { signOut } from 'next-auth/react';
import { Mail, LogOut } from 'lucide-react';

interface NavbarProps {
  user: any;
}

/**
 * Navigation bar component with user info and logout
 */
export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Email Classifier
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {user?.image && (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}