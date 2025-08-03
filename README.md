# ValidateAI - Startup Idea Validator

A comprehensive full-stack web application that helps entrepreneurs validate their startup ideas using AI-powered insights, real-time market research, and complete web content analysis.

## ✨ What Makes ValidateAI Special

- **🔍 Deep Market Research**: Scrapes and analyzes complete content from top industry sources, not just snippets
- **🤖 Enhanced AI Analysis**: Uses Gemini 2.0 with full web context for more accurate insights
- **💰 Flexible Pricing**: Pay-as-you-go model with custom credit packages instead of rigid subscriptions
- **🚀 Zero Friction**: No sign-up required - start validating ideas immediately
- **📱 Mobile Optimized**: Perfect experience on all devices with responsive dark theme
- **🔒 Privacy First**: Anonymous tracking ensures user privacy while enabling personalization

## 🚀 Features

### Core Functionality
- **AI-Powered Analysis**: Leverages Google's Gemini 2.0 Flash Lite for detailed startup idea evaluations
- **Enhanced Market Research**: Scrapes and analyzes complete content from top 3 search results
- **Anonymous User Tracking**: No sign-up required - uses localStorage for frictionless experience
- **Pay-As-You-Go Model**: 3 free validations, then custom pricing based on usage
- **Gmail Contact Integration**: Direct contact for custom validation packages

### Analysis Components
- One-liner pitch generation
- Market size estimation (based on real web content)
- Monetization model suggestions
- Comprehensive competitor analysis
- SWOT analysis with market insights
- Risk assessment from industry data
- Investor fit evaluation
- Recommended next steps
- Viability scoring (1-10 with explanation)

### Enhanced Features
- **Complete Content Scraping**: Extracts full article content from top 3 search results
- **Rich Context Analysis**: AI analyzes entire web pages, not just snippets  
- **Flexible Credit System**: Custom validation credits for paid users
- **Admin Management**: Built-in functions to manage user credits
- **Real-time Market Data**: Live insights from industry websites and reports

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for database with Row Level Security
- **Content Extraction** with @extractus/article-extractor
- **Tailwind CSS v4** for responsive design
- **Custom Hooks** for state management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **Database**: PostgreSQL with Row Level Security (via Supabase)
- **AI/ML**: Google Gemini 2.0 Flash Lite
- **Search**: Google Custom Search Engine API
- **Content Extraction**: @extractus/article-extractor
- **Contact**: Gmail Integration for custom pricing
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State Management**: React Hooks, Custom Hooks
- **Toast Notifications**: React Hot Toast

## 🏗️ Architecture

### Database Schema
```sql
-- Users table for anonymous tracking and credit management
users (
  id UUID PRIMARY KEY,
  anonymous_id TEXT UNIQUE,
  is_paid BOOLEAN DEFAULT FALSE,
  validation_count INTEGER DEFAULT 0,      -- Total validations used
  validation_credits INTEGER DEFAULT 0,    -- Available credits (paid users)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Validations table for storing analysis results with scraped content
validations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  idea_description TEXT,
  gemini_analysis JSONB,                   -- Structured AI analysis
  search_results JSONB,                    -- Scraped web content + metadata
  created_at TIMESTAMPTZ
)

-- Admin functions for credit management
FUNCTION set_user_credits(anon_id TEXT, credits INTEGER, make_paid BOOLEAN)
FUNCTION can_user_validate(anon_id TEXT) RETURNS BOOLEAN
FUNCTION get_or_create_user_by_anonymous_id(anon_id TEXT) RETURNS UUID
```

### API Endpoints

#### Validation & Analysis
- `POST /api/validate` - Validate startup idea with AI analysis and web scraping
  - Scrapes top 3 Google search results
  - Extracts complete article content
  - Generates comprehensive AI analysis
  - Updates user validation count/credits

#### User Management
- `POST /api/user/status` - Get user status, credits, and validation limits
- `POST /api/user/validations` - Get user's complete validation history

#### Admin Functions (SQL)
```sql
-- Set validation credits for a user
SELECT set_user_credits('anonymous_user_id', 50, true);

-- Check if user can validate
SELECT can_user_validate('anonymous_user_id');
```

## ⚡ Quick Start

Want to test ValidateAI immediately? 

1. **Clone and run with demo data:**
   ```bash
   git clone <repository-url>
   cd validateai
   npm install
   npm run dev
   ```
   
   The app works without any API keys - it provides demo data for testing!

## 📦 Full Installation

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
   # Supabase Configuration (Required for user tracking & data storage)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Gemini AI Configuration (Required for startup analysis)
   GEMINI_API_KEY=your_gemini_api_key

   # Google Custom Search Engine (Required for market research)
   GOOGLE_CSE_API_KEY=your_google_cse_api_key
   GOOGLE_CSE_ID=your_google_cse_id
   ```

   **Note**: The app provides fallback demo data if any service is not configured, allowing you to test functionality gradually.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database-schema.sql`
   - Configure RLS policies as provided in the schema

5. **Configure APIs**
   - **Gemini AI**: Get API key from [Google AI Studio](https://aistudio.google.com/)
   - **Google CSE**: Create a [Custom Search Engine](https://cse.google.com/) and get API key from [Google Cloud Console](https://console.cloud.google.com/)

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

## 💳 Pay-As-You-Go Model

### Free Tier
- **3 startup idea validations**
- Complete AI analysis with web scraping
- Full market research from top 3 sources
- Validation history and analytics
- Anonymous user tracking

### Paid Credits (Custom Pricing)
- **Flexible validation credits** - Set any amount based on user needs
- **Same comprehensive analysis** as free tier
- **Admin-managed credits** - Easy to add/remove credits
- **Gmail contact integration** for custom pricing
- **Usage tracking** for analytics

### Credit Management Examples
```sql
-- Starter Package: 10 validations
SELECT set_user_credits('user_id', 10, true);

-- Professional: 50 validations  
SELECT set_user_credits('user_id', 50, true);

-- Enterprise: 200 validations
SELECT set_user_credits('user_id', 200, true);
```

## 🔐 Security Features

- **Row Level Security (RLS)** in Supabase for data isolation
- **Anonymous user tracking** for maximum privacy
- **Environment variable protection** for sensitive credentials
- **CORS configuration** for API security
- **Admin-only credit management** functions
- **Input validation** and **XSS protection**

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## 📊 Analytics & Monitoring

- **User validation tracking** - Total and remaining credits
- **Content scraping metrics** - Success rates and response times
- **AI analysis quality** - Response parsing and error rates
- **Credit usage patterns** - Usage analytics for paid users
- **API performance monitoring** - Gemini and Google CSE response times
- **Error tracking and logging** - Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Custom Pricing**: Contact adarshkumar1711@gmail.com for validation credit packages
- **Technical Issues**: Create an issue in the repository
- **Feature Requests**: Open a GitHub discussion

## 🎯 Roadmap

### ✅ Completed
- [x] Full content scraping from web sources
- [x] Pay-as-you-go credit system
- [x] Gmail contact integration
- [x] Enhanced AI analysis with real market data
- [x] Admin credit management functions
- [x] Mobile-responsive design with dark theme

### 🔄 In Progress
- [ ] Advanced analytics dashboard for credit usage
- [ ] Email notifications for credit updates
- [ ] PDF export for validation reports

### 🚀 Future Plans
- [ ] Integration with additional AI models (Claude, GPT-4)
- [ ] Mobile app development
- [ ] API for third-party integrations
- [ ] Collaboration features for teams
- [ ] Webhook integrations for automated credit management
- [ ] Multi-language support for global markets

## 📈 Key Metrics & Performance

- **Content Extraction**: Up to 50,000+ characters per validation from real web sources
- **AI Analysis**: Comprehensive 10-point evaluation using full market context
- **Response Time**: Sub-10 second validation with parallel processing
- **Mobile Performance**: Optimized scrolling and responsive design
- **Scalability**: Credit-based system supports any usage volume
- **Privacy**: Zero personal data collection with anonymous tracking

---

**Built with ❤️ by the ValidateAI team**

*Transform your startup ideas into data-driven decisions with ValidateAI's comprehensive analysis platform.*