import OpenAI from 'openai';
import { toast } from 'react-hot-toast';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is not set. Message generation will be simulated.');
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the backend
}) : null;

interface GenerateMessageOptions {
  resume: string;
  linkedinUrl: string;
  messageType: 'email' | 'cover-letter' | 'linkedin';
  tone?: 'professional' | 'casual' | 'enthusiastic';
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onStream?: (chunk: string) => void;
}

export class OpenAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export const generateMessage = async ({
  resume,
  linkedinUrl,
  messageType,
  tone = 'professional',
  temperature = 0.7,
  maxTokens = 500,
  stream = false,
  onStream
}: GenerateMessageOptions): Promise<string> => {
  if (!openai) {
    // Return a dummy response when API key is not set
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    return `Dear [Recipient],

I recently came across your profile on LinkedIn and was impressed by your work. Based on my background in [field], I believe I could contribute valuable insights to your team.

[Custom message based on resume and profile will be generated here when API key is set]

Best regards,
[Your name]`;
  }

  try {
    const messages = [
      {
        role: "system",
        content: `You are an expert career advisor specializing in helping students and recent graduates with professional communication. Your task is to create a compelling ${messageType} that will help the student stand out.

Key Guidelines:
- Focus on the student's potential, enthusiasm, and willingness to learn
- Highlight relevant coursework, projects, and internships that align with the recipient's background
- Keep the tone ${tone} yet authentic
- Make specific connections between the student's experience and the recipient's work
- For students with limited experience, emphasize soft skills, academic achievements, and relevant projects
- Ensure the message is concise (200-250 words) but impactful
- Include a clear call to action that encourages a response`
      },
      {
        role: "user",
        content: `Create a personalized ${messageType} using the following information:

RESUME DETAILS:
${resume}

RECIPIENT INFORMATION:
${linkedinUrl}

REQUIREMENTS:
1. Start with a compelling opening that shows you've researched their background
2. Connect your relevant experiences/skills to their work or company
3. Show genuine interest in their field/role
4. Include a specific reason for reaching out
5. End with a clear, actionable request
6. Keep the total length between 200-250 words
7. Maintain a ${tone} tone`
      }
    ];

    if (stream && onStream) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        onStream(content);
      }
      return fullResponse;
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      return completion.choices[0].message.content || "I apologize, but I couldn't generate a message at this time. Please try again.";
    }
  } catch (error: any) {
    // Handle specific OpenAI API errors
    if (error.error?.type === 'insufficient_quota' || error.code === 'insufficient_quota') {
      throw new OpenAIError(
        'OpenAI API quota exceeded. Please check your billing details or try again later.',
        'insufficient_quota'
      );
    }
    
    if (error.error?.type === 'invalid_request_error') {
      if (error.error?.code === 'invalid_api_key') {
        throw new OpenAIError(
          'Invalid OpenAI API key. Please check your API key configuration.',
          'invalid_api_key'
        );
      }
      if (error.error?.code === 'model_not_found') {
        throw new OpenAIError(
          'The selected AI model is currently unavailable. Please try again later.',
          'model_not_found'
        );
      }
    }
    
    if (error.status === 429) {
      throw new OpenAIError(
        'Too many requests. Please wait a moment and try again.',
        'rate_limit_exceeded',
        429
      );
    }
    
    if (error.status === 500) {
      throw new OpenAIError(
        'OpenAI service is currently experiencing issues. Please try again later.',
        'service_error',
        500
      );
    }

    // Generic error handling
    throw new OpenAIError(
      error.message || 'Failed to generate message. Please try again.',
      'unknown_error'
    );
  }
};

export const analyzeJobMatch = async (
  resume: string,
  jobDescription: string
): Promise<{
  score: number;
  missingKeywords: string[];
  recommendations: string[];
}> => {
  if (!openai) {
    // Return dummy analysis when API key is not set
    return {
      score: 75,
      missingKeywords: ['leadership', 'project management'],
      recommendations: [
        'Add specific examples of team leadership',
        'Highlight project management experience'
      ]
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) analyzer. Your task is to:
1. Calculate a match score between the resume and job description
2. Identify missing keywords and skills
3. Provide specific recommendations for improvement
4. Return the analysis in a structured format`
        },
        {
          role: "user",
          content: `Analyze this resume against the job description:

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide the analysis in this format:
{
  "score": number between 0-100,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      score: response.score || 0,
      missingKeywords: response.missingKeywords || [],
      recommendations: response.recommendations || []
    };
  } catch (error: any) {
    console.error('Job match analysis error:', error);
    throw new OpenAIError(
      'Failed to analyze job match. Please try again.',
      'analysis_error'
    );
  }
};

export const generateFollowUp = async (
  originalMessage: string,
  lastContactDate: string,
  company: string,
  position: string
): Promise<string> => {
  if (!openai) {
    // Return dummy follow-up when API key is not set
    return `Dear [Recipient],

I hope this email finds you well. I wanted to follow up on my previous message regarding the ${position} position at ${company}. I remain very interested in the opportunity and would appreciate any updates you can provide.

Best regards,
[Your name]`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing professional follow-up messages. Create a polite and effective follow-up that maintains interest without being pushy."
        },
        {
          role: "user",
          content: `Generate a follow-up message using this context:

ORIGINAL MESSAGE:
${originalMessage}

COMPANY: ${company}
POSITION: ${position}
LAST CONTACT: ${lastContactDate}

Requirements:
1. Be polite and professional
2. Reference the previous message
3. Express continued interest
4. Provide a clear next step
5. Keep it concise (100-150 words)`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content || "Failed to generate follow-up message.";
  } catch (error: any) {
    console.error('Follow-up generation error:', error);
    throw new OpenAIError(
      'Failed to generate follow-up message. Please try again.',
      'generation_error'
    );
  }
};