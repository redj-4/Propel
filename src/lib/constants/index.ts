/**
 * Application-wide constants
 */

export const GUEST_MESSAGE_LIMIT = 2;

export const MESSAGE_TYPES = {
  EMAIL: 'email',
  COVER_LETTER: 'cover-letter',
  LINKEDIN: 'linkedin'
} as const;

export const APPLICATION_STATUS = {
  SENT: 'sent',
  AWAITING: 'awaiting',
  FOLLOW_UP: 'follow-up',
  REJECTED: 'rejected'
} as const;

export const MESSAGE_TONES = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  ENTHUSIASTIC: 'enthusiastic'
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_IN_USE: 'This email is already registered',
    RATE_LIMIT: 'Too many attempts. Please try again later'
  },
  DATABASE: {
    SAVE_FAILED: 'Failed to save data',
    LOAD_FAILED: 'Failed to load data',
    UPDATE_FAILED: 'Failed to update data',
    DELETE_FAILED: 'Failed to delete data'
  },
  AI: {
    QUOTA_EXCEEDED: 'AI quota exceeded. Please try again later.',
    GENERATION_FAILED: 'Failed to generate content',
    ANALYSIS_FAILED: 'Failed to analyze content'
  }
} as const;

export const FOLLOW_UP_INTERVALS = {
  INITIAL: 7, // days to wait for first follow-up
  SUBSEQUENT: 5 // days between follow-ups
} as const;