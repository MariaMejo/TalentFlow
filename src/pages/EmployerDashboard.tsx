import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Job } from '../types';
import {
  User, Mail, Shield, PlusCircle, List, XCircle,
  Pencil, Loader2, MapPin, DollarSign, AlertCircle, Users
} from 'lucide-react';

const formatSalary = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const EmployerDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [applicantCount, setApplicantCount] = useState(0);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (!error && data) {
      const fetchedJobs = data as Job[];
      setJobs(fetchedJobs);

      // Fetch applicant count for all employer jobs
      if (fetchedJobs.length > 0) {
        const jobIds = fetchedJobs.map(j => j.id);
        const { count } = await supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .in('job_id', jobIds);
        setApplicantCount(count ?? 0);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCloseJob = async (jobId: string) => {
    setClosingId(jobId);
    setActionError(null);
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', jobId)
      .eq('employer_id', user!.id);

    setClosingId(null);
    if (error) {
      setActionError(error.message);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'closed' } : j)));
    }
  };

  const openCount = jobs.filter((j) => j.status === 'open').length;
  const closedCount = jobs.filter((j) => j.status === 'closed').length;

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, {profile?.name || 'Employer'}!
            </h1>
            <p className="text-purple-100 font-light text-sm max-w-md">
              Create listings, manage applications, and hire elite engineering and design talent.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/employer/jobs/create"
              className="bg-white text-purple-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Job
            </Link>
            <Link
              to="/employer/applicants"
              className="bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-xl font-semibold transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Applicants
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
            <List className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{openCount}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Active Listings</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-slate-50 p-3 rounded-xl text-slate-500">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{closedCount}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Closed Listings</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">{applicantCount}</span>
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Total Applicants</span>
          </div>
        </div>
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {actionError}
        </div>
      )}

      {/* Job Listings */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Job Listings</h2>
          <Link
            to="/employer/jobs/create"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Post New
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
              <List className="w-7 h-7" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No jobs posted yet.</p>
            <Link
              to="/employer/jobs/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{job.title}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                        job.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)} / yr
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  {job.status === 'open' && (
                    <button
                      onClick={() => handleCloseJob(job.id)}
                      disabled={closingId === job.id}
                      className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {closingId === job.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Company Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <span className="block text-xs text-gray-400">Employer Name</span>
              <span className="font-semibold">{profile?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <span className="block text-xs text-gray-400">Email Address</span>
              <span className="font-semibold">{profile?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <span className="block text-xs text-gray-400">Role Status</span>
              <span className="font-semibold capitalize">{profile?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
