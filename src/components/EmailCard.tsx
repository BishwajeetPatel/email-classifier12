'use client';

import { Email, EmailCategory } from '@/app/types';
import { Mail, Calendar, User } from 'lucide-react';

interface EmailCardProps {
  email: Email;
}

/**
 * Individual email card component
 */
export default function EmailCard({ email }: EmailCardProps) {
  const getCategoryColor = (category?: EmailCategory) => {
    switch (category) {
      case 'Important':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Promotions':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Social':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Marketing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Spam':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'General':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {email.subject || 'No Subject'}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="truncate max-w-xs">{email.from}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(email.date)}</span>
            </div>
          </div>
        </div>

        {email.category && (
          <span
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap
              ${getCategoryColor(email.category)}
            `}
          >
            {email.category}
          </span>
        )}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
        {email.snippet}
      </p>

      {!email.isClassified && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Mail className="w-3.5 h-3.5" />
          <span>Not classified yet</span>
        </div>
      )}
    </div>
  );
}