import { supabase } from '../lib/supabase';
import type { ApplicationStatus } from '../types';

interface EmailParams {
  toEmail: string;
  toName: string;
  jobTitle: string;
  status: ApplicationStatus;
}

export const sendEmailNotification = async (params: EmailParams) => {
  const { toEmail, toName, jobTitle, status } = params;
  console.log("Sending email to:", toEmail);
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: toEmail,
      candidateName: toName,
      jobTitle,
      status,
    },
  });

  if (error) {
    console.error('Email sending failed:', error);
    throw error;
  }

  return data;
};