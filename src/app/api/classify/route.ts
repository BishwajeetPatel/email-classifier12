import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';
import { Email, EmailCategory } from '@/app/types';

/**
 * API endpoint to classify emails using OpenAI GPT-4o via Langchain
 * POST /api/classify
 * Body: { emails: Email[], openaiKey: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { emails, openaiKey } = await req.json();

    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 401 }
      );
    }

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Emails array is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI with Langchain
    const model = new ChatOpenAI({
      modelName: 'gpt-4o',
      openAIApiKey: openaiKey,
      temperature: 0.3,
    });

    // Create prompt template for email classification
    const prompt = PromptTemplate.fromTemplate(`
You are an expert email classifier. Analyze the following email and classify it into ONE of these categories:

Categories:
- Important: Personal or work-related emails requiring immediate attention
- Promotions: Sales, discounts, and marketing campaigns
- Social: Emails from social networks, friends, and family
- Marketing: Marketing emails, newsletters, and notifications
- Spam: Unwanted or unsolicited emails
- General: Everything else that doesn't fit the above categories

Email Details:
From: {from}
Subject: {subject}
Content: {content}

Respond with ONLY the category name, nothing else. Choose the most appropriate single category.
`);

    // Classify each email
    const classificationPromises = emails.map(async (email: Email) => {
      try {
        const formattedPrompt = await prompt.format({
          from: email.from,
          subject: email.subject,
          content: email.snippet || email.body,
        });

        const response = await model.invoke(formattedPrompt);
        const category = response.content.toString().trim() as EmailCategory;

        // Validate category
        const validCategories: EmailCategory[] = [
          'Important',
          'Promotions',
          'Social',
          'Marketing',
          'Spam',
          'General',
        ];

        const finalCategory = validCategories.includes(category)
          ? category
          : 'General';

        return {
          ...email,
          category: finalCategory,
          isClassified: true,
        };
      } catch (error) {
        console.error(`Error classifying email ${email.id}:`, error);
        return {
          ...email,
          category: 'General' as EmailCategory,
          isClassified: true,
        };
      }
    });

    const classifiedEmails = await Promise.all(classificationPromises);

    return NextResponse.json({ emails: classifiedEmails });
  } catch (error: any) {
    console.error('Error classifying emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to classify emails' },
      { status: 500 }
    );
  }
}