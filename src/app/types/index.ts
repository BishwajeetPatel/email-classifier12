// Type definitions for the application

export type EmailCategory = 
  | 'Important' 
  | 'Promotions' 
  | 'Social' 
  | 'Marketing' 
  | 'Spam' 
  | 'General';

export interface Email {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  body: string;
  category?: EmailCategory;
  isClassified?: boolean;
}

export interface ClassificationResponse {
  category: EmailCategory;
  reasoning?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      data?: string;
    };
    parts?: Array<{
      mimeType: string;
      body: {
        data?: string;
      };
    }>;
  };
  internalDate: string;
}