import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Application } from '../types';
import {
  Briefcase, MapPin, Calendar, Building2, Loader2,
  FileText, ArrowRight, CheckCircle, XCircle, Clock
} from 'lucide-react';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const StatusBadge: React.FC<{ status: Application['status'] }> = ({ status }) => {
  const map = {
    applied: { label: 'Applied', icon: Clock, className: 'bg-blue-50 text-blue-600' },
    shortlisted: { label: 'Shortlisted', icon: CheckCircle, className: 'bg-emerald-50 text-emerald-700' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-50 text-red-600' },
  };
  const { label, icon: Icon, className } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, job_id, candidate_id, status, created_at,
        job:jobs!job_id(id, title, location, employer:users!employer_id(name))
      `)
      .eq('candidate_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (!error && data) setApplications(data as unknown as Application[]);
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">My Applications</h1>
          <p className="text-indigo-100 text-sm font-light">
            Track the status of all your job applications in one place.
          </p>
        </div>
      </div>

      {/* Stats row */}
      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: applications.length, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: 'bg-blue-50 text-blue-600' },
            { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: 'bg-red-50 text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
              <span className={`inline-block text-2xl font-extrabold mb-1 ${color.split(' ')[1]}`}>{value}</span>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Application History</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-300">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-gray-600 font-semibold">No applications yet</p>
            <p className="text-gray-400 text-sm">Browse open jobs and apply to get started.</p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base truncate">
                        {app.job?.title ?? '—'}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {app.job?.employer && (
                        <span className="flex items-center gap-1 text-indigo-500 font-semibold">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.job.employer.name}
                        </span>
                      )}
                      {app.job?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.job.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {formatDate(app.created_at)}
                      </span>
                    </div>
                  </div>

                  {app.job?.id && (
                    <Link
                      to={`/jobs/${app.job.id}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex-shrink-0 group"
                    >
                      View Job
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
