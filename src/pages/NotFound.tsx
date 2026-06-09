import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="bg-indigo-50 text-indigo-600 p-5 rounded-full">
        <HelpCircle className="w-12 h-12 animate-bounce" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Page Not Found</h1>
        <p className="text-gray-500 text-sm">
          We couldn't find the page you are looking for. It might have been moved, deleted, or never existed in the first place.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 pt-4">
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};
