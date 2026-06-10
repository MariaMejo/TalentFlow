import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, Home, LayoutDashboard, LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              TalentFlow
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Home className="w-4 h-4 mr-1" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Briefcase className="w-4 h-4 mr-1" />
              <span>Find Jobs</span>
            </NavLink>

            {/* Dashboard Link if authenticated */}
            {user && profile && (
              <NavLink
                to={profile.role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                <span>Dashboard</span>
              </NavLink>
            )}

            {user && profile && profile.role === 'candidate' && (
              <NavLink
                to="/candidate/profile"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <User className="w-4 h-4 mr-1" />
                <span>Profile</span>
              </NavLink>
            )}
          </div>

          {/* Right-Side Authentication Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-semibold uppercase">{profile?.role}</span>
                  <span className="text-sm font-semibold text-gray-800">{profile?.name}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors gap-1 border border-gray-200 hover:border-red-200 bg-white px-3.5 py-2 rounded-xl shadow-sm hover:shadow cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
