import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Classifier - AI-Powered Gmail Organization',
  description: 'Automatically classify and organize your Gmail emails using OpenAI GPT-4o',
};

/**
 * Root layout component
 * Wraps entire app with SessionProvider for NextAuth
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}