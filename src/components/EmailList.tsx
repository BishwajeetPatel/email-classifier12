'use client';

import { Email } from '@/app/types';
import EmailCard from './EmailCard';

interface EmailListProps {
  emails: Email[];
}

/**
 * List component to display all emails
 */
export default function EmailList({ emails }: EmailListProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {emails.length} {emails.length === 1 ? 'Email' : 'Emails'}
      </h2>
      <div className="grid gap-4">
        {emails.map((email) => (
          <EmailCard key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
}