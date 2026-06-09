import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Your Next Adventure</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find the perfect{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              career path
            </span>{' '}
            for you.
          </h1>
          
          <p className="text-lg text-indigo-200/90 max-w-xl font-light leading-relaxed">
            TalentFlow connects leading engineers, product designers, and managers with innovative, high-growth startups and enterprises worldwide.
          </p>
          
          <div className="pt-4 flex flex-wrap gap-4">
            {user ? (
              <Link
                to={profile?.role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Direct Application</h3>
            <p className="text-gray-500 text-sm mt-1">Submit your profile directly to decision makers with no agency middleman.</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Verified Companies</h3>
            <p className="text-gray-500 text-sm mt-1">Every listing on our job board is manually verified for security and accuracy.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Premium Opportunities</h3>
            <p className="text-gray-500 text-sm mt-1">Get access to competitive, high-paying jobs in top-tier global teams.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
