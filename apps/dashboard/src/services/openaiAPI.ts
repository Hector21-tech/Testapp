/**
 * OpenAI API Service
 * 
 * Handles AI content generation for ad copy
 * Industry-specific prompts for Swedish hantverkare
 * 
 * TODO:
 * - Replace mock with real OpenAI API calls
 * - Add prompt optimization
 * - Implement content quality scoring
 * - Add usage tracking and rate limiting
 */

import type { CompanyProfile } from '../features/campaign/types';
import type { AIGeneratedContent } from '../components/ai/AIContentGenerator';

interface ContentGenerationRequest {
  companyProfile: CompanyProfile;
  tone: 'professional' | 'friendly' | 'urgent';
  targetAudience?: {
    ageMin: number;
    ageMax: number;
    interests: string[];
    goals: string[];
  };
  contentTypes: ('headlines' | 'descriptions' | 'ctas')[];
  count?: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'demo_key';
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4';
  }

  /**
   * Generate ad content using OpenAI
   */
  async generateAdContent(
    companyProfile: CompanyProfile,
    tone: 'professional' | 'friendly' | 'urgent' = 'professional',
    targetAudience?: any
  ): Promise<AIGeneratedContent> {
    try {
      const prompt = this.buildPrompt(companyProfile, tone, targetAudience);
      
      // TODO: Real OpenAI API call
      // const response = await this.callOpenAI(prompt);
      // return this.parseResponse(response, companyProfile, tone);
      
      // Mock response for development
      await this.delay(2500);
      return this.generateMockContent(companyProfile, tone);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }

  /**
   * Generate specific content type (headlines, descriptions, or CTAs)
   */
  async generateSpecificContent(
    type: 'headlines' | 'descriptions' | 'ctas',
    companyProfile: CompanyProfile,
    tone: 'professional' | 'friendly' | 'urgent' = 'professional',
    count: number = 5
  ): Promise<string[]> {
    try {
      const prompt = this.buildSpecificPrompt(type, companyProfile, tone, count);
      
      // TODO: Real OpenAI API call
      // const response = await this.callOpenAI(prompt);
      // return this.parseSpecificResponse(response, type);
      
      // Mock response
      await this.delay(1500);
      return this.generateMockSpecificContent(type, companyProfile, tone, count);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to generate ${type} with AI`);
    }
  }

  /**
   * Build comprehensive prompt for full ad content
   */
  private buildPrompt(
    profile: CompanyProfile,
    tone: string,
    targetAudience?: any
  ): string {
    const industryContext = this.getIndustryContext(profile.industry);
    const toneInstructions = this.getToneInstructions(tone);
    const audienceContext = targetAudience ? this.getAudienceContext(targetAudience) : '';

    return `
Du är en erfaren marknadsföringsexpert som specialiserar sig på svenska hantverksbranschen.

FÖRETAGSINFORMATION:
- Företag: ${profile.companyName}
- Bransch: ${profile.industry}
- Plats: ${profile.location}
- Verksamhetsområde: ${profile.radius} km radie
- Webbplats: ${profile.website || 'Ingen webbplats'}
- Mål: ${profile.goals.join(', ')}
- Beskrivning: ${profile.description || 'Ingen beskrivning'}

MÅLGRUPP:
- Ålder: ${profile.ageRangeMin}-${profile.ageRangeMax} år
- Intressen: ${profile.interests.join(', ')}
${audienceContext}

BRANSCHKONTEXT:
${industryContext}

TONALITET:
${toneInstructions}

UPPGIFT:
Skapa annonsinnehåll på svenska för detta företag. Generera:

1. RUBRIKER (3 st): Korta, fängslande rubriker max 60 tecken
2. BESKRIVNINGAR (3 st): Övertygande beskrivningar 100-150 tecken som förklarar värdet
3. UPPMANINGAR/CTA (5 st): Handlingsorienterade uppmaningar 5-15 tecken

KRAV:
- Använd svensk svenska (inte engelska ord)
- Fokusera på lokal expertis och tillgänglighet
- Inkludera platsinformation när relevant
- Undvik överdrivna superlativ
- Gör innehållet trovärdigt och jordnära
- Anpassa språket efter tonaliteten

FORMAT:
Returnera som JSON:
{
  "headlines": ["rubrik1", "rubrik2", "rubrik3"],
  "descriptions": ["beskrivning1", "beskrivning2", "beskrivning3"], 
  "ctas": ["cta1", "cta2", "cta3", "cta4", "cta5"]
}
`;
  }

  /**
   * Build specific prompt for individual content types
   */
  private buildSpecificPrompt(
    type: 'headlines' | 'descriptions' | 'ctas',
    profile: CompanyProfile,
    tone: string,
    count: number
  ): string {
    const industryContext = this.getIndustryContext(profile.industry);
    const toneInstructions = this.getToneInstructions(tone);

    const typeSpecificInstructions = {
      headlines: `Skapa ${count} fängslande rubriker (max 60 tecken) för ${profile.companyName}`,
      descriptions: `Skapa ${count} övertygande beskrivningar (100-150 tecken) som förklarar värdet av ${profile.companyName}s tjänster`,
      ctas: `Skapa ${count} handlingsorienterade uppmaningar (5-15 tecken) som får kunder att kontakta ${profile.companyName}`
    };

    return `
${industryContext}
${toneInstructions}

Företag: ${profile.companyName}
Bransch: ${profile.industry}
Plats: ${profile.location}

${typeSpecificInstructions[type]}

Returnera som JSON array: ["text1", "text2", ...]
`;
  }

  /**
   * Get industry-specific context and keywords
   */
  private getIndustryContext(industry: string): string {
    const contexts = {
      carpenter: `
BRANSCH: Snickeri & Träarbeten
NYCKELORD: kvalitetsträarbeten, hantverksskicklighet, kök, badrum, inredning, renovering
VÄRDEPROPOSITION: Precist hantverk, personlig service, lokalt förtroende
MÅLGRUPP: Villaägare, lägenhetsmätare, fastighetsägare som värderar kvalitet
`,
      electrician: `
BRANSCH: Elektriker & Elinstallationer  
NYCKELORD: auktoriserad elektriker, säker installation, elreparation, smart hem, belysning
VÄRDEPROPOSITION: Säkerhet, expertis, certifiering, tillgänglighet
MÅLGRUPP: Husägare, företag som behöver säkra elinstallationer
`,
      plumber: `
BRANSCH: VVS & Rörmokeri
NYCKELORD: rörmokare, VVS-expert, akut service, läckage, badrumsrenovering, vattenskador
VÄRDEPROPOSITION: Snabb respons, pålitlig service, akuthjälp
MÅLGRUPP: Fastighetsägare, husägare med akuta eller planerade VVS-behov
`,
      painter: `
BRANSCH: Måleri & Ytbehandling
NYCKELORD: professionell målare, fasadmålning, inomhusmålning, kvalitetsfärg
VÄRDEPROPOSITION: Noggrann förberedelse, kvalitetsmaterial, snyggt resultat
MÅLGRUPP: Husägare, företag som värdesätter kvalitet och estetik
`
    };

    return contexts[industry as keyof typeof contexts] || `
BRANSCH: ${industry}
VÄRDEPROPOSITION: Professionell service, lokal expertis, pålitlig leverans
`;
  }

  /**
   * Get tone-specific instructions
   */
  private getToneInstructions(tone: string): string {
    const instructions = {
      professional: `
TON: Professionell och trovärdig
- Använd formell svenska
- Betona expertis och erfarenhet  
- Fokusera på kvalitet och pålitlighet
- Undvik slang eller vardagsspråk
- Exempel: "Erfaren specialist med certifiering"
`,
      friendly: `
TON: Vänlig och personlig
- Använd varmare, mer personligt språk
- Inkludera "vi" och "våra kunder"
- Visa omtanke och förståelse
- Gör det personligt och tillgängligt
- Exempel: "Vi hjälper dig gärna med ditt projekt"
`,
      urgent: `
TON: Angelägen och handlingsorienterad
- Skapa känsla av brådska
- Använd aktiva verb och direkta uppmaningar
- Betona snabb service och tillgänglighet
- Inkludera tidspress eller begränsningar
- Exempel: "Ring nu - lediga tider tar snabbt slut"
`
    };

    return instructions[tone as keyof typeof instructions] || instructions.professional;
  }

  /**
   * Get target audience context
   */
  private getAudienceContext(audience: any): string {
    return `
SPECIFIK MÅLGRUPP:
- Ålder: ${audience.ageMin}-${audience.ageMax} år
- Intressen: ${audience.interests.join(', ')}
- Mål: ${audience.goals.join(', ')}
`;
  }

  /**
   * Make actual API call to OpenAI (TODO)
   */
  private async callOpenAI(prompt: string): Promise<OpenAIResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på marknadsföring för svenska hantverkare.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Parse OpenAI response (TODO)
   */
  private parseResponse(
    response: OpenAIResponse,
    profile: CompanyProfile,
    tone: string
  ): AIGeneratedContent {
    try {
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        headlines: parsed.headlines || [],
        descriptions: parsed.descriptions || [],
        ctas: parsed.ctas || [],
        tone: tone as any,
        industry: profile.industry,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return this.generateMockContent(profile, tone);
    }
  }

  /**
   * Generate mock content for development
   */
  private generateMockContent(
    profile: CompanyProfile,
    tone: string
  ): AIGeneratedContent {
    const headlines = this.generateMockHeadlines(profile, tone);
    const descriptions = this.generateMockDescriptions(profile, tone);
    const ctas = this.generateMockCTAs(tone);

    return {
      headlines,
      descriptions,
      ctas,
      tone: tone as any,
      industry: profile.industry,
      generatedAt: new Date().toISOString()
    };
  }

  private generateMockHeadlines(profile: CompanyProfile, tone: string): string[] {
    const company = profile.companyName;
    const location = profile.location;
    const industry = this.getIndustryLabel(profile.industry);

    if (tone === 'friendly') {
      return [
        `Hej ${location}! Vi hjälper er gärna`,
        `${company} - Vi löser dina problem med leende`,
        `Din lokala ${industry} som bryr sig`
      ];
    } else if (tone === 'urgent') {
      return [
        `Ring nu! ${industry} med snabb service`,
        `Akut hjälp behövs? ${company} finns här`,
        `Lediga tider - boka idag innan de tar slut!`
      ];
    }

    return [
      `Professionell ${industry} i ${location}`,
      `${company} - 15+ års branschexpertis`,
      `Kvalitet du kan lita på - ${company}`
    ];
  }

  private generateMockDescriptions(profile: CompanyProfile, tone: string): string[] {
    const company = profile.companyName;
    const location = profile.location;
    const industry = this.getIndustryLabel(profile.industry);

    if (tone === 'friendly') {
      return [
        `Vi på ${company} har mångårig erfarenhet av ${industry.toLowerCase()} i ${location}. Kontakta oss så löser vi det tillsammans!`,
        `Behöver du hjälp? ${company} erbjuder personlig service inom ${industry.toLowerCase()}. Vi finns här för dig i ${location}.`,
        `${company} - din pålitliga partner för ${industry.toLowerCase()}. Vi tar hand om allt från start till mål.`
      ];
    } else if (tone === 'urgent') {
      return [
        `${company} - snabb service inom ${industry.toLowerCase()} i ${location}. Ring nu och få hjälp samma dag!`,
        `Akut problem? Ingen panik! ${company} löser det snabbt. Tillgänglig dygnet runt i ${location}.`,
        `Begränsade tider denna månad. Boka ${company} nu för professionell ${industry.toLowerCase()} i ${location}.`
      ];
    }

    return [
      `${company} erbjuder professionell ${industry.toLowerCase()} med många års erfarenhet i ${location}. Certifierade och försäkrade.`,
      `Välj ${company} för kvalitet inom ${industry.toLowerCase()}. Stolt betjänar ${location} med expertis och omsorg.`,
      `${company} - din lokala expert på ${industry.toLowerCase()} i ${location}. Vi garanterar vårt arbete.`
    ];
  }

  private generateMockCTAs(tone: string): string[] {
    if (tone === 'friendly') {
      return ['Hör av dig!', 'Vi hjälper gärna', 'Kontakta oss', 'Ring och fråga', 'Få en offert'];
    } else if (tone === 'urgent') {
      return ['Ring nu!', 'Boka idag', 'Få hjälp direkt', 'Akut service', 'Ring 24/7'];
    }

    return ['Begär offert', 'Kontakta oss', 'Boka konsultation', 'Läs mer', 'Ring för info'];
  }

  private generateMockSpecificContent(
    type: 'headlines' | 'descriptions' | 'ctas',
    profile: CompanyProfile,
    tone: string,
    count: number
  ): string[] {
    const full = this.generateMockContent(profile, tone);
    return full[type].slice(0, count);
  }

  private getIndustryLabel(industry: string): string {
    const labels = {
      carpenter: 'Snickare',
      electrician: 'Elektriker',
      plumber: 'Rörmokare',
      painter: 'Målare',
      renovation: 'Byggare',
      landscaping: 'Trädgårdsmästare',
      roofing: 'Takläggare',
      heating: 'VVS-montör',
      flooring: 'Golvläggare',
      cleaning: 'Städare'
    };

    return labels[industry as keyof typeof labels] || industry;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check API health and available models
   */
  async healthCheck(): Promise<{ available: boolean; models?: string[] }> {
    try {
      // TODO: Real health check
      // const response = await fetch(`${this.baseURL}/models`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
      // });
      
      await this.delay(200);
      console.log('✅ OpenAI API health check passed (mock)');
      
      return {
        available: true,
        models: ['gpt-4', 'gpt-3.5-turbo']
      };
    } catch (error) {
      console.error('❌ OpenAI API health check failed:', error);
      return { available: false };
    }
  }
}

// Export singleton instance
export const openaiAPI = new OpenAIService();
export default openaiAPI;