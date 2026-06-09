import React from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '../types';
import { MapPin, DollarSign, Calendar, ArrowRight, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const formatSalary = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
      <div className="flex gap-4 items-start flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
          {job.title.charAt(0)}
        </div>

        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
            {job.title}
          </h3>
          {job.employer && (
            <p className="text-indigo-500 text-sm font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {job.employer.name}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-gray-400">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {job.location}
            </span>
            <span className="flex items-center text-emerald-600 font-semibold">
              <DollarSign className="w-3.5 h-3.5 mr-0.5" />
              {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)} / yr
            </span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDate(job.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Open
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/btn"
        >
          View details
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
