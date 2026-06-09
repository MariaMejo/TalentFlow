import React from 'react';
import { Briefcase, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">TalentFlow</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              Discover and apply to top engineering, design, and management opportunities globally. Empowering builders to find their next challenge.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 text-sm tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Career Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Salary Calculator</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm tracking-wider uppercase mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200/50 flex flex-col sm:flex-row justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} TalentFlow Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
