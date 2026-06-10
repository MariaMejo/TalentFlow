import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Application, ApplicationStatus } from '../types';
import {
  Users, Loader2, Calendar, Briefcase, ChevronDown,
  CheckCircle, XCircle, Clock, AlertCircle, Mail, FileText
} from 'lucide-react';
import { sendEmailNotification } from '../services/notificationService';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusConfig: Record<ApplicationStatus, { label: string; className: string; icon: React.FC<{ className?: string }> }> = {
  applied: { label: 'Applied', className: 'bg-blue-50 text-blue-600 border-blue-100', icon: ({ className }) => <Clock className={className} /> },
  shortlisted: { label: 'Shortlisted', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: ({ className }) => <CheckCircle className={className} /> },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600 border-red-100', icon: ({ className }) => <XCircle className={className} /> },
};

export const Applicants: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch all applications for jobs owned by this employer
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, job_id, candidate_id, status, created_at,
        job:jobs!job_id(id, title, employer_id),
        candidate:users!candidate_id(id, name, email, resume_url)
      `)
      .order('created_at', { ascending: false });

    setLoading(false);

    if (!error && data) {
      // Client-side filter: only keep applications for this employer's jobs
      const filtered = (data as unknown as Application[]).filter(
        (a) => (a.job as unknown as { employer_id: string })?.employer_id === user.id
      );
      setApplications(filtered);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    if (!user) return;
    setUpdatingId(appId);
    setActionError(null);
    setSuccessToast(null);

    // First verify this application belongs to one of the employer's jobs
    const app = applications.find(a => a.id === appId);
    if (!app) { setUpdatingId(null); return; }

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    setUpdatingId(null);

    if (error) {
      setActionError(error.message);
    } else {
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
      
      // Trigger simulated email notification to the candidate
      if (app.candidate?.email) {
        sendEmailNotification({
          toEmail: app.candidate.email,
          toName: app.candidate.name || 'Candidate',
          jobTitle: (app.job as any)?.title || 'Job Listing',
          status: newStatus,
        });

        setSuccessToast(`Application status updated to "${newStatus}" & email notification sent to ${app.candidate.email}`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    }
  };

  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Applicants</h1>
          <p className="text-purple-100 text-sm font-light">
            Review and manage candidates who applied to your job listings.
          </p>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: applications.length, colorText: 'text-indigo-600' },
            { label: 'Applied', value: appliedCount, colorText: 'text-blue-600' },
            { label: 'Shortlisted', value: shortlistedCount, colorText: 'text-emerald-600' },
            { label: 'Rejected', value: rejectedCount, colorText: 'text-red-500' },
          ].map(({ label, value, colorText }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
              <span className={`block text-2xl font-extrabold mb-1 ${colorText}`}>{value}</span>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Success Notification Toast */}
      {successToast && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error */}
      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {actionError}
        </div>
      )}

      {/* Applicants List */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">All Applications</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-300">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-gray-600 font-semibold">No applications yet</p>
            <p className="text-gray-400 text-sm">Applications will appear here once candidates apply to your jobs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const cfg = statusConfig[app.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={app.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:border-purple-100 hover:bg-purple-50/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Candidate info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                        {app.candidate?.name?.charAt(0) ?? '?'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {app.candidate?.name ?? 'Unknown Candidate'}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {app.candidate?.email ?? '—'}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 pt-0.5">
                          <span className="flex items-center gap-1 text-indigo-500 font-medium">
                            <Briefcase className="w-3 h-3" />
                            {(app.job as unknown as { title: string })?.title ?? '—'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(app.created_at)}
                          </span>
                          {app.candidate?.resume_url && (
                            <a
                              href={app.candidate.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold transition-colors ml-1 border-l border-gray-200 pl-2"
                              title="Click to view resume in new tab"
                            >
                              <FileText className="w-3 h-3" />
                              View Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status + dropdown */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.className}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>

                      <div className="relative">
                        <select
                          value={app.status}
                          disabled={updatingId === app.id}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:opacity-60 transition"
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        {updatingId === app.id && (
                          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-500 animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
