import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { User, Mail, Shield, FileText, CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';

interface AppStats {
  total: number;
  applied: number;
  shortlisted: number;
  rejected: number;
}

export const CandidateDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState<AppStats>({ total: 0, applied: 0, shortlisted: 0, rejected: 0 });

  const fetchStats = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('applications')
      .select('status')
      .eq('candidate_id', user.id);

    if (data) {
      setStats({
        total: data.length,
        applied: data.filter(a => a.status === 'applied').length,
        shortlisted: data.filter(a => a.status === 'shortlisted').length,
        rejected: data.filter(a => a.status === 'rejected').length,
      });
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.name || 'Candidate'}!
            </h1>
            <p className="text-indigo-100 font-light text-sm max-w-md">
              Find openings, track applications, and optimize your candidate profile from your custom space.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/candidate/profile"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link
              to="/candidate/applications"
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              My Applications
            </Link>
            <button
              onClick={signOut}
              className="bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{stats.total}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Total</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{stats.applied}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Applied</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{stats.shortlisted}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Shortlisted</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-red-50 p-3 rounded-xl text-red-500">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{stats.rejected}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Rejected</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/jobs"
              className="flex items-center gap-3 p-4 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100 rounded-2xl transition-colors group"
            >
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">Browse Jobs</p>
                <p className="text-gray-500 text-xs">Find open positions</p>
              </div>
            </Link>

            <Link
              to="/candidate/applications"
              className="flex items-center gap-3 p-4 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 rounded-2xl transition-colors group"
            >
              <div className="bg-emerald-600 p-2.5 rounded-xl text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">My Applications</p>
                <p className="text-gray-500 text-xs">Track your progress</p>
              </div>
            </Link>

            <Link
              to="/candidate/profile"
              className="flex items-center gap-3 p-4 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 rounded-2xl transition-colors group"
            >
              <div className="bg-purple-600 p-2.5 rounded-xl text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">Manage Profile</p>
                <p className="text-gray-500 text-xs">Update resume & info</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <span className="block text-xs text-gray-400">Name</span>
                <span className="font-semibold">{profile?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <span className="block text-xs text-gray-400">Email</span>
                <span className="font-semibold">{profile?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <span className="block text-xs text-gray-400">Role</span>
                <span className="font-semibold capitalize">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
