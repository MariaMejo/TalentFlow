import type { ApplicationStatus } from '../types';

interface EmailParams {
  toEmail: string;
  toName: string;
  jobTitle: string;
  status: ApplicationStatus;
}

/**
 * Simulates sending an email notification to the candidate.
 * Logs a beautifully formatted email block to the browser console.
 */
export const sendEmailNotification = (params: EmailParams) => {
  const { toEmail, toName, jobTitle, status } = params;
  
  let subject = '';
  let body = '';

  if (status === 'shortlisted') {
    subject = `Great news! You have been shortlisted for ${jobTitle}`;
    body = `Dear ${toName},\n\nWe are pleased to inform you that your application for the "${jobTitle}" position has been shortlisted by the employer. The hiring team will be in touch with you shortly to schedule the next steps.\n\nBest regards,\nThe TalentFlow Recruitment Team`;
  } else if (status === 'rejected') {
    subject = `Update regarding your application for ${jobTitle}`;
    body = `Dear ${toName},\n\nThank you for your interest in the "${jobTitle}" position and for taking the time to apply. Unfortunately, after careful consideration of your application, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate your interest in our company and wish you the best in your future career endeavors.\n\nBest regards,\nThe TalentFlow Recruitment Team`;
  } else {
    subject = `Application Received: ${jobTitle}`;
    body = `Dear ${toName},\n\nYour application for the position of "${jobTitle}" has been successfully received by our system and is currently under review.\n\nBest regards,\nThe TalentFlow Recruitment Team`;
  }

  // Beautifully formatted console logs to simulate an SMTP send event
  console.log(
    `%c✉️ [Email Service] Sending simulated email to: ${toEmail}\n` +
    `%cSubject: %c${subject}\n` +
    `%cBody:\n%c${body}`,
    'color: #4f46e5; font-weight: bold; font-size: 13px; padding-top: 8px;',
    'color: #4b5563; font-weight: bold; font-size: 11px;',
    'color: #1f2937; font-weight: bold; font-size: 12px; text-decoration: underline;',
    'color: #4b5563; font-weight: bold; font-size: 11px;',
    'color: #374151; font-weight: normal; font-size: 12px; background-color: #f3f4f6; padding: 10px; border-radius: 6px; display: block; border-left: 4px solid #6366f1; font-family: monospace;'
  );

  return {
    success: true,
    sentAt: new Date().toISOString(),
    details: { subject, toEmail }
  };
};
