import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
  User, Mail, Shield, FileText, UploadCloud, CheckCircle,
  AlertCircle, Download, ExternalLink, Loader2, ArrowLeft, Edit2, Check
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [name, setName] = useState(profile?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Guard: Only candidates should access this page
  if (profile.role !== 'candidate') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only candidates can access this profile page.</p>
        <Link to="/employer/dashboard" className="text-indigo-600 hover:underline text-sm font-medium">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    setUpdatingName(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      setNameError(err.message || 'Failed to update name.');
    } finally {
      setUpdatingName(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      setUploadSuccess(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum allowed size is 5 MB.');
      setUploadSuccess(null);
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Setup file path in storage
      // Use clean path format: userId/timestamp_filename
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}.${fileExt}`;

      setUploadProgress(30);

      // Upload file to Supabase Storage resumes bucket
      const { error: uploadErr } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Save public URL to user profile
      const { error: dbErr } = await supabase
        .from('users')
        .update({ resume_url: publicUrl })
        .eq('id', user.id);

      if (dbErr) throw dbErr;

      setUploadProgress(100);
      setUploadSuccess('Resume uploaded and profile updated successfully!');
      await refreshProfile();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };



  const getFileNameFromUrl = (url: string | null | undefined) => {
    if (!url) return '';
    try {
      const decoded = decodeURIComponent(url);
      const parts = decoded.split('/');
      const lastPart = parts[parts.length - 1];
      // Strip timestamp prefix if it's there
      return lastPart.replace(/^\d+_\d*_?/, '') || lastPart;
    } catch {
      return 'resume.pdf';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Back navigation */}
      <Link
        to="/candidate/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header Profile Title */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-2xl border border-white/20">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{profile.name}</h1>
              <p className="text-indigo-100 text-sm font-light">Candidate Profile & Documents</p>
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Core Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Side: General Profile Card */}
        <div className="md:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3">Account Details</h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Name
              </span>
              {isEditingName ? (
                <form onSubmit={handleUpdateName} className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    placeholder="Your Name"
                    disabled={updatingName}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setName(profile.name);
                        setIsEditingName(false);
                        setNameError(null);
                      }}
                      className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg font-medium cursor-pointer"
                      disabled={updatingName}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                      disabled={updatingName}
                    >
                      {updatingName ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      Save
                    </button>
                  </div>
                  {nameError && (
                    <p className="text-xs text-red-500 font-medium">{nameError}</p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between group">
                  <span className="font-bold text-gray-800 text-sm">{profile.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-semibold text-gray-700 text-sm break-all">{profile.email}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Role
              </span>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                {profile.role}
              </span>
            </div>
          </div>

          {nameSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-xl">
              <CheckCircle className="w-3.5 h-3.5" />
              Name updated successfully!
            </div>
          )}
        </div>

        {/* Right Side: Resume Upload & Management */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3">Resume Document</h3>

          {/* Current Resume Status */}
          <div className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume Status</span>
                  {profile.resume_url ? (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Not Uploaded
                    </span>
                  )}
                </div>
              </div>

              {profile.resume_url && (
                <div className="flex gap-2">
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-100 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                  <a
                    href={profile.resume_url}
                    download={getFileNameFromUrl(profile.resume_url)}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              )}
            </div>

            {profile.resume_url && (
              <div className="text-xs text-gray-500 bg-white border border-gray-100/80 rounded-xl px-3.5 py-2.5 break-all flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-700 truncate">{getFileNameFromUrl(profile.resume_url)}</span>
              </div>
            )}
          </div>

          {/* Upload Widget */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800">
              {profile.resume_url ? 'Replace Resume' : 'Upload New Resume'}
            </h4>

            <input
              id="resume-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf"
              className="sr-only"
            />

            <label
              htmlFor="resume-upload"
              className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploading
                  ? 'border-indigo-300 bg-indigo-50/10 pointer-events-none'
                  : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/10'
                }`}
            >
              <div className="space-y-3 max-w-sm mx-auto">
                {uploading ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                    <div>
                      <p className="font-bold text-gray-700 text-sm">Uploading document...</p>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2 border border-gray-200">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">{uploadProgress}% complete</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        Drag and drop or <span className="text-indigo-600 hover:underline">browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supported file formats: PDF, DOC, DOCX
                      </p>
                      <p className="text-xs text-gray-400">
                        Maximum file size: 5 MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>

            {/* Upload Messages */}
            {uploadError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-xs font-semibold shadow-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 text-xs font-semibold shadow-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {uploadSuccess}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
