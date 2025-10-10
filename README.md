# Email Classifier - AI-Powered Gmail Organization

> An intelligent email classification system built with Next.js, OpenAI GPT-4o, and Gmail API. Automatically organize your inbox into categories like Important, Promotions, Social, Marketing, Spam, and General.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- **Google OAuth Authentication**: Secure login using Google accounts
- **Gmail Integration**: Fetch up to 15 recent emails from your Gmail inbox
- **AI-Powered Classification**: Use OpenAI GPT-4o to intelligently categorize emails
- **Six Email Categories**: Important, Promotions, Social, Marketing, Spam, General
- **Local Storage**: Keep your data private—everything stored in browser localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Filter & Search**: View emails by category with real-time filtering
- **Lightning-Fast**: Classify multiple emails in seconds

## 🛠 Tech Stack

**Frontend**
- Next.js 14.2+ (React framework)
- TypeScript
- Tailwind CSS (styling)
- Lucide React (icons)
- NextAuth.js (authentication)
- Zustand (state management)

**Backend**
- Next.js API Routes
- Node.js

**External APIs**
- Google OAuth 2.0
- Gmail API v1
- OpenAI GPT-4o API
- LangChain.js (for LLM orchestration)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (package manager)
- **Git** (version control)

You'll also need accounts for:
- **Google Cloud Account** (for OAuth and Gmail API)
- **OpenAI Account** (for GPT-4o API access)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/email-classifier.git
cd email-classifier
```

Replace `yourusername` with your actual GitHub username.

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click "Select a Project" > "New Project"
   - Enter project name: "Email Classifier"
   - Click "Create"

3. Enable required APIs:
   - Search for "Gmail API" and enable it
   - Search for "Google+ API" and enable it

4. Create OAuth 2.0 Credentials:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for local development)
     - `http://localhost:3000/api/auth/callback/google`
     - Your production domain (when deploying)
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

### Step 4: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy the generated key (keep it safe—it won't be shown again)

### Step 5: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # if .env.example exists
# or create manually
touch .env.local
```

Add the following variables to `.env.local`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret_here

# NextAuth URL (change for production)
NEXTAUTH_URL=http://localhost:3000

# Optional: OpenAI API Key (can also be provided in the UI)
OPENAI_API_KEY=your_openai_api_key_here
```

**To generate NEXTAUTH_SECRET**, run:

```bash
openssl rand -base64 32
```

Copy the output and paste it into `NEXTAUTH_SECRET`.

## ⚙️ Configuration

### Gmail API Configuration

The application is pre-configured to:
- Fetch up to 15 recent emails (configurable in `src/app/dashboard/page.tsx`)
- Request `gmail.readonly` scope (read-only access)
- Extract sender, subject, date, and email content

To change the number of emails fetched, edit `src/app/dashboard/page.tsx`:

```typescript
maxResults: 15, // Change this value
```

### Email Categories

Currently supported categories (defined in `src/app/types/index.ts`):

```typescript
type EmailCategory = 
  | 'Important'    // Personal/work emails requiring attention
  | 'Promotions'   // Sales, discounts, marketing campaigns
  | 'Social'       // Social networks, friends, family
  | 'Marketing'    // Newsletters, marketing emails
  | 'Spam'         // Unwanted/unsolicited emails
  | 'General';     // Everything else
```

### OpenAI Model Configuration

The application uses **GPT-4o** with the following settings (in `src/app/api/classify/route.ts`):

```typescript
temperature: 0.3  // Lower = more consistent, higher = more creative
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
email-classifier/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts          # NextAuth configuration
│   │   │   ├── emails/
│   │   │   │   └── route.ts          # Gmail API integration
│   │   │   └── classify/
│   │   │       └── route.ts          # OpenAI classification
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   └── types/
│   │       └── index.ts              # TypeScript type definitions
│   └── components/
│       ├── EmailCard.tsx             # Individual email component
│       ├── EmailList.tsx             # Email list container
│       ├── FilterButtons.tsx         # Category filter buttons
│       ├── Navbar.tsx                # Navigation bar
│       └── OpenAIKeyModal.tsx        # API key input modal
├── types/
│   └── next-auth.d.ts               # NextAuth type extensions
├── public/                          # Static assets
├── .env.local                       # Environment variables (not in git)
├── .env.example                     # Example environment variables
├── .gitignore                       # Git ignore rules
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── next.config.mjs                  # Next.js configuration
├── postcss.config.mjs               # PostCSS configuration
└── README.md                        # This file
```

## 🔄 How It Works

### 1. Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Google OAuth dialog opens
    ↓
User grants permissions
    ↓
Google returns auth tokens
    ↓
NextAuth stores tokens securely
    ↓
User redirected to dashboard
```

### 2. Email Fetching Flow

```
User clicks "Fetch Emails"
    ↓
Frontend sends accessToken to backend
    ↓
Backend initializes Gmail API client
    ↓
Backend fetches 15 most recent emails
    ↓
Backend parses email metadata & content
    ↓
Emails stored in browser localStorage
    ↓
Frontend displays email list
```

### 3. Email Classification Flow

```
User clicks "Classify Emails"
    ↓
Frontend sends emails + OpenAI key to backend
    ↓
Backend initializes GPT-4o model via LangChain
    ↓
For each email:
  - Format email into classification prompt
  - Send to GPT-4o for classification
  - Validate category response
  - Return classified email
    ↓
Frontend updates emails with categories
    ↓
User can filter by category
```

## 📖 Usage Guide

### First-Time Setup

1. **Click "Sign in with Google"** on the landing page
2. **Grant permissions** when prompted
3. **Click "Add OpenAI Key"** and paste your OpenAI API key
4. **Click "Fetch Emails"** to load your recent emails
5. **Click "Classify Emails"** to categorize them

### Managing Emails

- **Filter by Category**: Use the filter buttons to view emails by category
- **Update OpenAI Key**: Click "Update OpenAI Key" anytime
- **View Email Details**: Click any email card to see full details
- **Sign Out**: Click "Sign Out" in the top-right corner

### Tips for Better Classification

- GPT-4o works best with complete email content
- Keep your email subject lines descriptive
- Classification accuracy improves with diverse email types
- Re-classify emails if categories seem incorrect

## 🐛 Troubleshooting

### "Access token is required" Error

**Issue**: You're not logged in or session expired
**Solution**: 
- Sign out and sign back in
- Clear browser cookies for localhost
- Refresh the page

### "Gmail API not enabled" Error

**Issue**: Gmail API not activated in Google Cloud Console
**Solution**:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Search for "Gmail API"
- Click "Enable"
- Wait a few minutes for changes to propagate

### "OpenAI API key is invalid" Error

**Issue**: Your OpenAI API key is incorrect or expired
**Solution**:
- Verify key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Generate a new key if needed
- Update in the modal
- Ensure you have API credits

### Emails Not Fetching

**Issue**: No emails appear after clicking "Fetch Emails"
**Solution**:
- Ensure you're signed in with Google
- Check that Gmail API is enabled
- Verify you have emails in your inbox
- Check browser console for error messages

### Classification Fails

**Issue**: "Failed to classify emails" error
**Solution**:
- Verify OpenAI API key is correct
- Check your OpenAI account has credits
- Ensure you have internet connection
- Try with fewer emails first
- Check if OpenAI API is experiencing outages

### localStorage Not Working

**Issue**: Data not persisting after refresh
**Solution**:
- Ensure cookies are enabled in browser
- Check that localStorage isn't disabled
- Use private/incognito window to test
- Clear browser cache and try again

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Select your project

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (your Vercel domain)

4. **Update Google OAuth Redirect URIs**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Add your Vercel domain to authorized redirect URIs:
     - `https://yourdomain.vercel.app`
     - `https://yourdomain.vercel.app/api/auth/callback/google`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Deploy to Other Platforms

**Netlify, Railway, Render**: Similar process—add environment variables and update OAuth credentials.

**Docker Deployment**:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📝 License

This project is open source and available under the MIT License.

## 🙋 Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/email-classifier/issues)
- **Email**: support@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [LangChain.js Docs](https://js.langchain.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---



