import OpenAI from 'openai';
import { supabase } from '../supabase';
import { JobApplication, Message } from '../types';
import { ERROR_MESSAGES } from '../constants';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export class AIService {
  /**
   * Generate a message with AI
   */
  static async generateMessage(
    resume: string,
    recipientInfo: string,
    messageType: 'email' | 'cover-letter' | 'linkedin',
    tone: 'professional' | 'casual' | 'enthusiastic' = 'professional'
  ): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert career advisor specializing in ${messageType} writing. 
            Generate a ${tone} message that highlights the candidate's relevant experience and potential.
            Focus on making specific connections between their background and the recipient's work.`
          },
          {
            role: "user",
            content: `Create a personalized ${messageType} using:

            RESUME:
            ${resume}

            RECIPIENT:
            ${recipientInfo}

            TONE: ${tone}

            Requirements:
            1. Start with an engaging opening
            2. Connect relevant experiences to their work
            3. Show genuine interest
            4. Include specific reasons for reaching out
            5. End with a clear call to action
            6. Keep it concise (200-250 words)
            7. Maintain the specified tone`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "Failed to generate message";
    } catch (error: any) {
      if (error.error?.type === 'insufficient_quota') {
        throw new Error(ERROR_MESSAGES.AI.QUOTA_EXCEEDED);
      }
      throw error;
    }
  }

  static async generateAdvice(): Promise<any[]> {
    if (!openai) throw new Error('OpenAI API key not configured');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor. Generate personalized career advice."
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Parse and structure the response
      return [
        {
          title: "Skill Development",
          content: "Focus on developing these key skills...",
          type: "skill"
        },
        // Add more structured advice
      ];
    } catch (error) {
      throw error;
    }
  }

  static async generateInterviewQuestions(): Promise<any[]> {
    if (!openai) throw new Error('OpenAI API key not configured');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer. Generate relevant interview questions."
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Parse and structure the response
      return [
        {
          id: "1",
          question: "Tell me about yourself...",
          type: "behavioral",
          expectedPoints: ["Background", "Skills", "Goals"]
        },
        // Add more questions
      ];
    } catch (error) {
      throw error;
    }
  }

  static async analyzeResponse(response: string): Promise<string> {
    if (!openai) throw new Error('OpenAI API key not configured');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer. Analyze this interview response."
          },
          {
            role: "user",
            content: response
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "Failed to analyze response";
    } catch (error) {
      throw error;
    }
  }

  static async getJobRecommendations(): Promise<any[]> {
    // In a real implementation, this would fetch from job APIs
    // and use AI to analyze matches
    return [
      {
        id: "1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: "Remote",
        matchScore: 85,
        skills: ["React", "TypeScript", "Node.js"],
        source: "linkedin",
        url: "https://example.com/job"
      },
      // Add more jobs
    ];
  }

  static async analyzeJobMatch(job: any): Promise<any> {
    if (!openai) throw new Error('OpenAI API key not configured');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS analyzer. Analyze this job match."
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      return {
        score: 85,
        missingSkills: ["Leadership", "AWS"],
        recommendations: [
          "Add examples of team leadership",
          "Get AWS certification"
        ]
      };
    } catch (error) {
      throw error;
    }
  }
}