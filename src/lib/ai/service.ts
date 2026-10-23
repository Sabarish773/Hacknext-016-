import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export interface AIServiceConfig {
  geminiKey?: string;
  openaiKey?: string;
  preferredProvider?: 'gemini' | 'openai';
}

function getAIConfig(): AIServiceConfig {
  return {
    geminiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    openaiKey: process.env.OPENAI_API_KEY,
    preferredProvider: (process.env.AI_DEFAULT_PROVIDER as 'gemini' | 'openai') || 'gemini',
  };
}

export class AIService {
  private config: AIServiceConfig;
  private geminiClient: GoogleGenAI | null = null;
  private openaiClient: OpenAI | null = null;

  constructor() {
    this.config = getAIConfig();

    if (this.config.geminiKey) {
      try {
        this.geminiClient = new GoogleGenAI({ apiKey: this.config.geminiKey });
      } catch (err) {
        console.warn('Could not initialize GoogleGenAI client:', err);
      }
    }

    if (this.config.openaiKey) {
      try {
        this.openaiClient = new OpenAI({ apiKey: this.config.openaiKey });
      } catch (err) {
        console.warn('Could not initialize OpenAI client:', err);
      }
    }
  }

  async generateStructuredJSON<T>(
    prompt: string,
    systemInstruction: string,
    fallbackGenerator: () => T
  ): Promise<T> {
    const hasGemini = Boolean(this.config.geminiKey && this.geminiClient);
    const hasOpenAI = Boolean(this.config.openaiKey && this.openaiClient);

    // If no API keys configured, return high-fidelity fallback generator immediately
    if (!hasGemini && !hasOpenAI) {
      return fallbackGenerator();
    }

    // Try primary provider first
    if (this.config.preferredProvider === 'gemini' && hasGemini) {
      try {
        return await this.callGemini<T>(prompt, systemInstruction);
      } catch (err) {
        console.warn('Gemini call failed, attempting fallback provider:', err);
        if (hasOpenAI) {
          try {
            return await this.callOpenAI<T>(prompt, systemInstruction);
          } catch (openAiErr) {
            console.warn('OpenAI fallback also failed:', openAiErr);
          }
        }
      }
    } else if (hasOpenAI) {
      try {
        return await this.callOpenAI<T>(prompt, systemInstruction);
      } catch (err) {
        console.warn('OpenAI call failed, attempting fallback provider:', err);
        if (hasGemini) {
          try {
            return await this.callGemini<T>(prompt, systemInstruction);
          } catch (geminiErr) {
            console.warn('Gemini fallback also failed:', geminiErr);
          }
        }
      }
    }

    // Final safety net: Return high-fidelity heuristic fallback
    return fallbackGenerator();
  }

  private async callGemini<T>(prompt: string, systemInstruction: string): Promise<T> {
    if (!this.geminiClient) throw new Error('Gemini client not initialized');

    const response = await this.geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '';
    return JSON.parse(text) as T;
  }

  private async callOpenAI<T>(prompt: string, systemInstruction: string): Promise<T> {
    if (!this.openaiClient) throw new Error('OpenAI client not initialized');

    const completion = await this.openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content) as T;
  }
}

export const aiService = new AIService();
