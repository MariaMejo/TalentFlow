import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Job } from '../types';
import {
  ArrowLeft, MapPin, DollarSign, Calendar, Building2,
  Loader2, AlertCircle, Send, CheckCircle, LogIn
} from 'lucide-react';

const formatSalary = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*, employer:users!employer_id(name)')
        .eq('id', id)
        .eq('status', 'open')
        .maybeSingle();

      setLoading(false);

      if (fetchError || !data) {
        setError('Job not found or no longer available.');
        return;
      }

      setJob(data as Job);

      // Check if candidate already applied
      if (user && profile?.role === 'candidate') {
        const { data: existingApp } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', id)
          .eq('candidate_id', user.id)
          .maybeSingle();
        if (existingApp) setAlreadyApplied(true);
      }
    };

    fetchJob();
  }, [id, user, profile]);

  const handleApply = async () => {
    if (!user || !id) return;
    setApplying(true);
    setApplyError(null);

    // Duplicate guard at DB level
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('candidate_id', user.id)
      .maybeSingle();

    if (existing) {
      setAlreadyApplied(true);
      setApplying(false);
      return;
    }

    const { error: insertError } = await supabase.from('applications').insert({
      job_id: id,
      candidate_id: user.id,
      status: 'applied',
    });

    setApplying(false);

    if (insertError) {
      setApplyError(insertError.message);
    } else {
      setAlreadyApplied(true);
      setApplySuccess(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">{error || 'Job not found'}</h2>
        <Link to="/jobs" className="text-indigo-600 hover:underline text-sm font-medium">
          ← Back to Job Board
        </Link>
      </div>
    );
  }

  const isCandidate = profile?.role === 'candidate';

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Jobs
      </Link>

      {/* Job Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0">
            {job.title.charAt(0)}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{job.title}</h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Open
              </span>
            </div>
            {job.employer && (
              <p className="text-indigo-600 font-semibold text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {job.employer.name}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-5">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)} / yr
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            Posted {formatDate(job.created_at)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </div>
      </div>

      {/* Apply CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white space-y-4">
        <h2 className="text-xl font-bold">Interested in this role?</h2>

        {/* Not logged in */}
        {!user && (
          <>
            <p className="text-indigo-100 text-sm">Sign in as a candidate to apply for this position.</p>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Apply
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Create Account
              </Link>
            </div>
          </>
        )}

        {/* Logged in as employer */}
        {user && !isCandidate && (
          <p className="text-indigo-100 text-sm">You are logged in as an employer and cannot apply for jobs.</p>
        )}

        {/* Candidate — already applied */}
        {isCandidate && alreadyApplied && (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">
                {applySuccess ? 'Application submitted!' : 'Already applied'}
              </p>
              <p className="text-indigo-100 text-sm">
                {applySuccess
                  ? 'Your application has been received. Track its progress in My Applications.'
                  : 'You have already applied for this job.'}
              </p>
            </div>
          </div>
        )}

        {/* Candidate — apply button */}
        {isCandidate && !alreadyApplied && (
          <>
            {applyError && (
              <p className="text-red-200 text-sm font-medium">{applyError}</p>
            )}
            <button
              onClick={handleApply}
              disabled={applying}
              id="apply-now-btn"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-70 cursor-pointer"
            >
              {applying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {applying ? 'Submitting...' : 'Apply Now'}
            </button>
          </>
        )}

        {isCandidate && applySuccess && (
          <Link
            to="/candidate/applications"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            View My Applications →
          </Link>
        )}
      </div>
    </div>
  );
};
