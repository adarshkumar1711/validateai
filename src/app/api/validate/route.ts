import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { extract } from '@extractus/article-extractor'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder')

export async function POST(request: NextRequest) {
  try {
    const { idea, anonymousId } = await request.json()

    if (!idea || !anonymousId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if required APIs are configured
    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'placeholder'
    
    if (!hasGemini) {
      return NextResponse.json({
        error: 'Gemini AI not configured',
        analysis: {
          oneLiner: "Configure Gemini AI API to validate startup ideas",
          marketSize: "Gemini API key required for market analysis",
          monetization: ["Set up Gemini AI in your .env.local file"],
          competitors: ["API configuration needed"],
          moat: "Add GEMINI_API_KEY to environment variables", 
          targetAudience: "Configure APIs first",
          risks: ["Missing Gemini API credentials"],
          swotAnalysis: {
            strengths: ["Check environment setup"],
            weaknesses: ["Missing API configuration"], 
            opportunities: ["Add Gemini API key"],
            threats: ["Incomplete setup"]
          },
          investorFit: "Fix configuration to get analysis",
          nextSteps: ["Get Gemini API key from Google AI Studio", "Add to .env.local", "Restart server"],
          viabilityScore: "Configuration Required"
        },
        searchResults: [
          {
            title: "Setup Required",
            link: "https://aistudio.google.com/",
            snippet: "Get your Gemini API key from Google AI Studio to enable AI-powered startup validation.",
            displayLink: "aistudio.google.com"
          }
        ]
      }, { status: 200 })
    }

    let userId = null
    let canValidate = true

    // Only check database limits if Supabase is configured
    if (isSupabaseConfigured) {
      // Get or create user
      const { data: userData, error: userError } = await supabaseAdmin
        .rpc('get_or_create_user_by_anonymous_id', { anon_id: anonymousId })

      if (userError) {
        console.error('Error getting/creating user:', userError)
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        )
      }

      userId = userData

      // Check if user can validate
      const { data: validateCheck, error: validateError } = await supabaseAdmin
        .rpc('can_user_validate', { anon_id: anonymousId })

      if (validateError) {
        console.error('Error checking validation permission:', validateError)
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        )
      }

      canValidate = validateCheck

      if (!canValidate) {
        return NextResponse.json(
          { error: 'Validation limit reached. Please upgrade to continue.' },
          { status: 403 }
        )
      }
    } else {
      console.log('Supabase not configured, skipping user validation checks')
    }

    // Get search results from Google CSE first
    let searchResults = []
    try {
      // Debug environment variables
      console.log('Google CSE Debug:', {
        hasApiKey: !!process.env.GOOGLE_CSE_API_KEY,
        hasSearchId: !!process.env.GOOGLE_CSE_ID,
        apiKeyFirst10: process.env.GOOGLE_CSE_API_KEY?.substring(0, 10),
        searchIdFirst10: process.env.GOOGLE_CSE_ID?.substring(0, 10)
      })
      
      // Check if Google CSE credentials are configured
      if (process.env.GOOGLE_CSE_API_KEY && process.env.GOOGLE_CSE_ID && 
          process.env.GOOGLE_CSE_API_KEY !== 'test_key' && process.env.GOOGLE_CSE_ID !== 'test_id') {
        
        const searchQuery = encodeURIComponent(`${idea} startup market research`)
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CSE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${searchQuery}&num=3`
        
        console.log('Fetching Google CSE results...')
        const searchResponse = await fetch(searchUrl)
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          console.log('Google CSE response:', { 
            totalResults: searchData.searchInformation?.totalResults,
            itemsCount: searchData.items?.length 
          })
          
          const rawResults = searchData.items?.slice(0, 3) || []
          
          // Extract content from each URL
          const resultsWithContent = await Promise.all(
            rawResults.map(async (item: any) => {
              let extractedContent = ''
              try {
                console.log(`Extracting content from: ${item.link}`)
                const article = await extract(item.link)
                extractedContent = article?.content || article?.description || ''
                console.log(`Extracted ${extractedContent.length} characters from: ${item.link}`)
              } catch (extractError) {
                console.error(`Content extraction failed for ${item.link}:`, extractError)
                extractedContent = item.snippet || 'Content extraction failed'
              }

              return {
                title: item.title || 'No title',
                link: item.link || '#',
                snippet: item.snippet || 'No description available',
                displayLink: item.displayLink || 'Unknown source',
                extractedContent
              }
            })
          )
          
          searchResults = resultsWithContent
        } else {
          const errorData = await searchResponse.text()
          console.error('Google CSE API error:', {
            status: searchResponse.status,
            statusText: searchResponse.statusText,
            response: errorData
          })
          
          // Create dummy search results for demo purposes
          searchResults = [
            {
              title: "Market Research - Google CSE Not Configured",
              link: "#",
              snippet: "Please configure Google Custom Search Engine API for real market research results.",
              displayLink: "demo.example.com"
            }
          ]
        }
      } else {
        console.log('Google CSE not configured, using dummy data')
        // Create dummy search results when CSE is not configured
        searchResults = [
          {
            title: "Market Research Demo",
            link: "#",
            snippet: "Configure Google Custom Search Engine API to get real market research results for your startup idea.",
            displayLink: "setup-required.com"
          },
          {
            title: "Competitor Analysis Demo",
            link: "#", 
            snippet: "Real competitor data will appear here once Google CSE is properly configured with valid API keys.",
            displayLink: "setup-required.com"
          }
        ]
      }
    } catch (searchError) {
      console.error('Error fetching search results:', searchError)
      // Fallback search results
      searchResults = [
        {
          title: "Search Error - Using Fallback Data",
          link: "#",
          snippet: "Unable to fetch live market research. Please check your Google CSE configuration.",
          displayLink: "error.fallback.com"
        }
      ]
    }

    // Generate AI analysis using Gemini with scraped content
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      systemInstruction: `You are an expert startup advisor. Analyze startup ideas and provide comprehensive evaluations using provided market research data.

ALWAYS respond in the following JSON format:
{
  "oneLiner": "A concise one-line pitch for this startup",
  "marketSize": "Estimated market size and opportunity (use research data)",
  "monetization": ["List of suggested monetization models based on market research"],
  "competitors": ["Key competitors identified from research data"],
  "moat": "Analysis of potential competitive advantages/moats considering competition",
  "targetAudience": "Primary target audience description based on market data",
  "risks": ["Key risks and red flags identified from research"],
  "swotAnalysis": {
    "strengths": ["List of strengths based on market analysis"],
    "weaknesses": ["List of weaknesses considering competition"],
    "opportunities": ["List of opportunities found in research"],
    "threats": ["List of threats identified from market data"]
  },
  "investorFit": "Analysis of investor attractiveness based on market research",
  "nextSteps": ["Recommended immediate next steps based on findings"],
  "viabilityScore": "Score from 1-10 with brief explanation based on all data"
}

Provide realistic, actionable insights based on the provided market research and current market conditions. Reference specific insights from the research data where relevant.`
    })

    // Prepare market research context from scraped content
    const marketResearchContext = searchResults.map((result, index) => {
      if (result.extractedContent && result.extractedContent !== 'Content extraction failed') {
        return `Research Source ${index + 1}:
Title: ${result.title}
URL: ${result.link}
Content: ${result.extractedContent}`
      }
      return `Research Source ${index + 1}:
Title: ${result.title}
URL: ${result.link}
Snippet: ${result.snippet}`
    }).join('\n\n---\n\n')

    // User input with startup idea and market research data
    const userInput = `Please analyze this startup idea using the provided market research data:

STARTUP IDEA:
${idea}

MARKET RESEARCH DATA:
${marketResearchContext}`

    const result = await model.generateContent(userInput)
    const response = await result.response
    const analysis = response.text()

    // Parse the JSON response
    let geminiAnalysis
    try {
      geminiAnalysis = JSON.parse(analysis.replace(/```json|```/g, '').trim())
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError)
      geminiAnalysis = {
        oneLiner: "Unable to generate structured analysis",
        marketSize: "Analysis not available",
        monetization: ["Contact support for detailed analysis"],
        competitors: ["Analysis not available"],
        moat: "Analysis not available", 
        targetAudience: "Analysis not available",
        risks: ["Analysis not available"],
        swotAnalysis: {
          strengths: ["Analysis not available"],
          weaknesses: ["Analysis not available"], 
          opportunities: ["Analysis not available"],
          threats: ["Analysis not available"]
        },
        investorFit: "Analysis not available",
        nextSteps: ["Contact support for detailed analysis"],
        viabilityScore: "N/A",
        rawResponse: analysis
      }
    }

    // Save validation to database (only if Supabase is configured)
    if (isSupabaseConfigured && userId) {
      const { error: saveError } = await supabaseAdmin
        .from('validations')
        .insert({
          user_id: userId,
          idea_description: idea,
          gemini_analysis: geminiAnalysis,
          search_results: searchResults
        })

      if (saveError) {
        console.error('Error saving validation:', saveError)
      }

      // Update validation count/credits based on user type
      const { data: currentUser, error: getUserError } = await supabaseAdmin
        .from('users')
        .select('is_paid, validation_count, validation_credits')
        .eq('id', userId)
        .single()

      if (!getUserError && currentUser) {
        if (currentUser.is_paid) {
          // Paid user: decrement validation_credits
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ 
              validation_credits: Math.max(0, currentUser.validation_credits - 1),
              validation_count: currentUser.validation_count + 1 // Track total validations used
            })
            .eq('id', userId)
          
          if (updateError) {
            console.error('Error updating validation credits:', updateError)
          }
        } else {
          // Free user: increment validation_count
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ validation_count: currentUser.validation_count + 1 })
            .eq('id', userId)
            
          if (updateError) {
            console.error('Error updating validation count:', updateError)
          }
        }
      }
    } else {
      console.log('Supabase not configured, validation not saved to database')
    }

    return NextResponse.json({
      analysis: geminiAnalysis,
      searchResults: searchResults || [],
      success: true
    })

  } catch (error) {
    console.error('Validation API error:', error)
    
    // Return a structured error response that the frontend can handle
    return NextResponse.json({
      error: 'Validation failed. Please check your configuration.',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      // Provide fallback data so the UI doesn't break
      analysis: {
        oneLiner: "Unable to validate idea due to configuration error",
        marketSize: "Please check your API keys and try again",
        monetization: ["Configure Gemini AI API"],
        competitors: ["API configuration required"],
        moat: "Check environment variables", 
        targetAudience: "Configuration needed",
        risks: ["Missing API credentials"],
        swotAnalysis: {
          strengths: ["Check Gemini API key"],
          weaknesses: ["Verify Supabase connection"], 
          opportunities: ["Configure Google CSE"],
          threats: ["Review environment setup"]
        },
        investorFit: "Fix configuration to get analysis",
        nextSteps: ["Check .env.local file", "Verify API keys", "Restart development server"],
        viabilityScore: "Configuration Error"
      },
      searchResults: [
        {
          title: "Configuration Error",
          link: "#",
          snippet: "Please check your environment variables and API configuration.",
          displayLink: "config.error.com"
        }
      ]
    }, { status: 500 })
  }
}