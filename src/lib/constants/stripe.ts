export const STRIPE_PRICES = {
  PRO: 'price_pro',
  ENTERPRISE: 'price_enterprise'
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  UNPAID: 'unpaid'
} as const;

export const ERROR_MESSAGES = {
  PAYMENT: {
    CHECKOUT_FAILED: 'Failed to create checkout session',
    PORTAL_FAILED: 'Failed to open billing portal',
    SUBSCRIPTION_ERROR: 'Error processing subscription',
    INVALID_PRICE: 'Invalid price ID'
  }
} as const;