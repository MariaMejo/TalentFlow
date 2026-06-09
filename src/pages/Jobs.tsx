import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Job } from '../types';
import {
  Search, MapPin, DollarSign, SlidersHorizontal,
  Loader2, Briefcase, ArrowRight, Calendar, Building2, X
} from 'lucide-react';

const formatSalary = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('jobs')
      .select('*, employer:users!employer_id(name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    if (locationFilter.trim()) {
      query = query.ilike('location', `%${locationFilter.trim()}%`);
    }

    if (salaryMin !== '') {
      query = query.gte('salary_max', Number(salaryMin));
    }

    if (salaryMax !== '') {
      query = query.lte('salary_min', Number(salaryMax));
    }

    const { data, error } = await query;

    setLoading(false);
    if (!error && data) setJobs(data as Job[]);
  }, [search, locationFilter, salaryMin, salaryMax]);

  // Debounce search/filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const clearFilters = () => {
    setSearch('');
    setLocationFilter('');
    setSalaryMin('');
    setSalaryMax('');
  };

  const hasFilters = search || locationFilter || salaryMin || salaryMax;

  return (
    <div className="space-y-8 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Find Your Next Role</h1>
          <p className="text-indigo-100 text-sm font-light">
            Browse open positions from top employers. Updated in real time.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm mb-1">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          Search &amp; Filter
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Title Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="job-search"
              type="text"
              placeholder="Search job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="location-filter"
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          {/* Salary Min */}
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="salary-min"
              type="number"
              placeholder="Min salary..."
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          {/* Salary Max */}
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="salary-max"
              type="number"
              placeholder="Max salary..."
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 transition"
            />
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 font-medium">
          {jobs.length === 0
            ? 'No jobs match your search.'
            : `Showing ${jobs.length} open position${jobs.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Job List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-300">
            <Briefcase className="w-8 h-8" />
          </div>
          <p className="text-gray-600 font-semibold">No open positions found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:underline text-sm font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                    {job.title.charAt(0)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
                      {job.title}
                    </h3>
                    {job.employer && (
                      <p className="text-indigo-500 text-sm font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.employer.name}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)} / yr
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: badge + button */}
                <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Open
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
