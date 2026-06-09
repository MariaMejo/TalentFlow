import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { JobFormData } from '../types';
import { ArrowLeft, Briefcase, MapPin, DollarSign, FileText, Loader2, CheckCircle } from 'lucide-react';

export const CreateJob: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    salary_min: 0,
    salary_max: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'salary_min' || name === 'salary_max' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be logged in to post a job.');
      return;
    }

    if (form.salary_min < 0 || form.salary_max < 0) {
      setError('Salary values must be positive numbers.');
      return;
    }

    if (form.salary_min > form.salary_max) {
      setError('Minimum salary cannot exceed maximum salary.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from('jobs').insert({
      employer_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      salary_min: form.salary_min,
      salary_max: form.salary_max,
      status: 'open',
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/employer/dashboard'), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Post a New Job</h1>
        <p className="text-gray-500 text-sm">Fill in the details below to publish a new job listing.</p>
      </div>

      {/* Success State */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">Job posted successfully! Redirecting...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
        {/* Job Title */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="location"
              name="location"
              type="text"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY or Remote"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="salary_min" className="block text-sm font-semibold text-gray-700">
              Min Salary ($/yr) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="salary_min"
                name="salary_min"
                type="number"
                required
                min={0}
                value={form.salary_min || ''}
                onChange={handleChange}
                placeholder="60000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="salary_max" className="block text-sm font-semibold text-gray-700">
              Max Salary ($/yr) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="salary_max"
                name="salary_max"
                type="number"
                required
                min={0}
                value={form.salary_max || ''}
                onChange={handleChange}
                placeholder="100000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <textarea
              id="description"
              name="description"
              required
              rows={7}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing Job...
            </>
          ) : (
            'Publish Job Listing'
          )}
        </button>
      </form>
    </div>
  );
};
