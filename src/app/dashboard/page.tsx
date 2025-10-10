'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Email, EmailCategory } from '@/app/types';
import Navbar from '@/components/Navbar';
import OpenAIKeyModal from '@/components/OpenAIKeyModal';
import FilterButtons from '@/components/FilterButtons';
import EmailList from '@/components/EmailList';
import { Loader2 } from 'lucide-react';

/**
 * Main dashboard page for displaying and managing emails
 * Handles email fetching, classification, and filtering
 */
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'All'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [error, setError] = useState('');

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('openai_key');
      const savedEmails = localStorage.getItem('emails');

      if (savedKey) {
        setOpenaiKey(savedKey);
      }

      if (savedEmails) {
        const parsedEmails = JSON.parse(savedEmails);
        setEmails(parsedEmails);
        setFilteredEmails(parsedEmails);
      }
    }
  }, []);

  // Filter emails when category or emails change
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEmails(emails);
    } else {
      setFilteredEmails(emails.filter(email => email.category === selectedCategory));
    }
  }, [selectedCategory, emails]);

  // Save emails to localStorage whenever they change
  useEffect(() => {
    if (emails.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('emails', JSON.stringify(emails));
    }
  }, [emails]);

  /**
   * Fetch emails from Gmail API
   */
  const fetchEmails = async () => {
    if (!session?.accessToken) {
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: session.accessToken,
          maxResults: 15,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails');
      }

      setEmails(data.emails);
      setFilteredEmails(data.emails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Classify emails using OpenAI
   */
  const classifyEmails = async () => {
    if (!openaiKey) {
      setShowKeyModal(true);
      return;
    }

    if (emails.length === 0) {
      setError('Please fetch emails first');
      return;
    }

    setIsClassifying(true);
    setError('');

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          openaiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to classify emails');
      }

      setEmails(data.emails);
      setFilteredEmails(
        selectedCategory === 'All'
          ? data.emails
          : data.emails.filter((e: Email) => e.category === selectedCategory)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsClassifying(false);
    }
  };

  /**
   * Save OpenAI key to localStorage
   */
  const saveOpenAIKey = (key: string) => {
    setOpenaiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_key', key);
    }
    setShowKeyModal(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const categoryCounts = {
    All: emails.length,
    Important: emails.filter(e => e.category === 'Important').length,
    Promotions: emails.filter(e => e.category === 'Promotions').length,
    Social: emails.filter(e => e.category === 'Social').length,
    Marketing: emails.filter(e => e.category === 'Marketing').length,
    Spam: emails.filter(e => e.category === 'Spam').length,
    General: emails.filter(e => e.category === 'General').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Dashboard</h1>
              <p className="text-gray-600">
                {emails.length > 0
                  ? `${emails.length} emails loaded`
                  : 'No emails loaded yet'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchEmails}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Fetching...' : 'Fetch Emails'}
              </button>

              <button
                onClick={classifyEmails}
                disabled={isClassifying || emails.length === 0}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isClassifying && <Loader2 className="w-4 h-4 animate-spin" />}
                {isClassifying ? 'Classifying...' : 'Classify Emails'}
              </button>

              <button
                onClick={() => setShowKeyModal(true)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {openaiKey ? 'Update' : 'Add'} OpenAI Key
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* OpenAI Key Status */}
          {!openaiKey && emails.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              Please add your OpenAI API key to classify emails.
            </div>
          )}

          {/* Filter Buttons */}
          <FilterButtons
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />

          {/* Email List */}
          <EmailList emails={filteredEmails} />

          {/* Empty State */}
          {emails.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No emails yet
              </h3>
              <p className="text-gray-600 mb-6">
                Click "Fetch Emails" to load your recent emails from Gmail
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OpenAI Key Modal */}
      <OpenAIKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={saveOpenAIKey}
        currentKey={openaiKey}
      />
    </div>
  );
}