import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Email, GmailMessage } from '@/app/types';

/**
 * API endpoint to fetch emails from Gmail
 * POST /api/emails
 * Body: { accessToken: string, maxResults?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const { accessToken, maxResults = 15 } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 401 }
      );
    }

    // Initialize Gmail API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch message IDs
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({ emails: [] });
    }

    // Fetch full message details for each email
    const emailPromises = messages.map(async (message) => {
      const msgResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      return msgResponse.data as GmailMessage;
    });

    const fullMessages = await Promise.all(emailPromises);

    // Parse emails into our format
    const emails: Email[] = fullMessages.map((msg) => {
      const headers = msg.payload.headers;
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';
      const date = new Date(parseInt(msg.internalDate)).toISOString();

      // Extract email body
      let body = '';
      if (msg.payload.body.data) {
        body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8');
      } else if (msg.payload.parts) {
        const textPart = msg.payload.parts.find(
          (part) => part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      // Clean body text (remove HTML tags for better classification)
      body = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

      return {
        id: msg.id,
        subject,
        from,
        snippet: msg.snippet,
        date,
        body: body.substring(0, 500), // Limit body length for classification
        isClassified: false,
      };
    });

    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}