# ValidateAI - Startup Idea Validator

A comprehensive full-stack web application that helps entrepreneurs validate their startup ideas using AI-powered insights and real-time market research.

## 🚀 Features

### Core Functionality
- **AI-Powered Analysis**: Leverages Google's Gemini AI to provide detailed startup idea evaluations
- **Market Research**: Integrates Google Custom Search Engine for real-time market insights
- **Anonymous User Tracking**: No sign-up required - uses localStorage for frictionless experience
- **Freemium Model**: 3 free validations, then upgrade to Pro for unlimited access
- **Subscription Management**: Integrated with Razorpay for seamless payments

### Analysis Components
- One-liner pitch generation
- Market size estimation
- Monetization model suggestions
- Competitor analysis
- SWOT analysis
- Risk assessment
- Investor fit evaluation
- Recommended next steps
- Viability scoring

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **Razorpay** for subscription payments
- **Tailwind CSS** for responsive design
- **Row Level Security (RLS)** for data protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **AI/ML**: Google Gemini AI
- **Search**: Google Custom Search Engine API
- **Payments**: Razorpay Subscriptions
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State Management**: React Hooks, Custom Hooks

## 🏗️ Architecture

### Database Schema
```sql
-- Users table for anonymous tracking
users (
  id UUID PRIMARY KEY,
  anonymous_id TEXT UNIQUE,
  is_paid BOOLEAN,
  subscription_expires TIMESTAMPTZ,
  razorpay_subscription_id TEXT,
  validation_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Validations table for storing analysis results
validations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  idea_description TEXT,
  gemini_analysis JSONB,
  search_results JSONB,
  created_at TIMESTAMPTZ
)

-- Subscription events for webhook tracking
subscription_events (
  id UUID PRIMARY KEY,
  event_type TEXT,
  subscription_id TEXT,
  user_id UUID REFERENCES users(id),
  payload JSONB,
  processed BOOLEAN,
  created_at TIMESTAMPTZ
)
```

### API Endpoints

#### Validation
- `POST /api/validate` - Validate a startup idea
- `POST /api/user/status` - Get user status and limits
- `POST /api/user/validations` - Get user's validation history

#### Subscription
- `POST /api/subscription/create` - Create Razorpay subscription
- `POST /api/subscription/verify` - Verify payment completion
- `POST /api/subscription/webhook` - Handle Razorpay webhooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd validateai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Google Custom Search Engine
   GOOGLE_CSE_API_KEY=your_google_cse_api_key
   GOOGLE_CSE_ID=your_google_cse_id

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

   # Application Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database-schema.sql`
   - Configure RLS policies as provided in the schema

5. **Configure APIs**
   - **Gemini AI**: Get API key from Google AI Studio
   - **Google CSE**: Create a Custom Search Engine and get API key
   - **Razorpay**: Set up merchant account and create subscription plans

6. **Run the application**
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

The application follows a **Perplexity-inspired** design with:
- Clean, minimalistic interface
- Gradient backgrounds and modern typography
- Responsive design for all devices
- Fast loading and smooth animations
- User-friendly color coding for different information types

## 💳 Subscription Model

### Free Tier
- 3 startup idea validations
- Basic AI analysis
- Search results integration
- Validation history

### Pro Plan (₹1,228/month)
- Unlimited validations
- Advanced analysis features
- Priority support
- Detailed export capabilities

## 🔐 Security Features

- **Row Level Security (RLS)** in Supabase
- **Anonymous user tracking** for privacy
- **Webhook signature verification** for payment security
- **Environment variable protection**
- **CORS configuration** for API security

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## 📊 Analytics & Monitoring

- User validation tracking
- Subscription conversion rates
- API usage monitoring
- Error tracking and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@validateai.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Email notifications for subscription updates
- [ ] Advanced analytics dashboard
- [ ] Integration with more AI models
- [ ] Mobile app development
- [ ] API for third-party integrations
- [ ] Advanced export formats (PDF, CSV)
- [ ] Collaboration features for teams

---

Built with ❤️ by the ValidateAI team