
const subscriptionTypes = Object.freeze({
  free: 'FREE',
  premium: 'PREMIUM',
  enterprise: 'ENTERPRISE',
});

// Role Types
const roleTypes = Object.freeze({
  admin: 'ADMIN',
  user: 'USER',
  guest: '', // Empty string as per your original ROLE_ENUM
});

// Status Types
const statusTypes = Object.freeze({
  active: 'ACTIVE',
  inactive: 'INACTIVE',
});

// Provider Types
const providerTypes = Object.freeze({
  google: 'google',
  apple: 'apple',
  none: '', // Empty string as per your original PROVIDER_ENUM
});

// Platform Types
const platformTypes = Object.freeze({
  linkedin: 'linkedin',
  instagram: 'instagram',
  facebook: 'facebook',
  wordpress: 'wordpress',
});

// Schedule Status Types
const scheduleStatusTypes = Object.freeze({
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
});

// Post Status Types
const postStatusTypes = Object.freeze({
  pending: 'pending',
  error: 'error',
  success: 'success',
});

// Post Type Types
const postTypeTypes = Object.freeze({
  image: 'image',
  carousel: 'carousel',
  doyouknow: 'doyouknow',
  festival: 'festival',
  product: 'product'
});

// Content Type Types
const contentTypeTypes = Object.freeze({
  imageContent: 'ImageContent',
  carouselContent: 'CarouselContent',
  dykContent: 'DYKContent',
  festivalContent: 'FestivalContent',
  productContent: 'ProductContent'
});

const productPostTypes = Object.freeze({
  product: 'product',
  discount: 'discount',
  flashSale: 'flashSale',
});

const serctionTypes = Object.freeze({
  blog: 'blog',
  news: 'news',
  article: 'article'
})

const planTitleTypes = Object.freeze({
  starter:'Starter',
  professional: 'Professional', 
  business: 'Business'
})

const billingTypes = Object.freeze({
  monthlly: 'monthly',
  annual:  'annual'
})

const paymentStatusTypes = Object.freeze({
  pending: 'PENDING',
  completed:  'COMPLETED',
  failed: 'FAILED',
  cancelled: 'CANCELLED'
})

const subscriptionStatusTypes = Object.freeze({
  pending: 'PENDING',
  active:  'ACTIVE',
  expired: 'EXPIRED',
  cancelled: 'CANCELLED'
})

export const SUBSCRIPTION_ENUM = Object.values(subscriptionTypes);
export const ROLE_ENUM = Object.values(roleTypes);
export const STATUS_ENUM = Object.values(statusTypes);
export const PROVIDER_ENUM = Object.values(providerTypes);
export const PLATFORM_ENUM = Object.values(platformTypes);
export const SCHEDULE_STATUS_ENUM = Object.values(scheduleStatusTypes);
export const POST_STATUS_ENUM = Object.values(postStatusTypes);
export const POST_TYPE_ENUM = Object.values(postTypeTypes);
export const CONTENT_TYPE_ENUM = Object.values(contentTypeTypes);
export const PRODUCT_POST_TYPE_ENUM = Object.values(productPostTypes);
export const SECTION_TYPE_ENUM = Object.values(serctionTypes);
export const PLAN_TITLE_TYPES = Object.values(planTitleTypes)
export const BILLING_TYPES = Object.values(billingTypes)
export const PAYMENT_STATUS_TYPES = Object.values(paymentStatusTypes)
export const SUBSCRIPTION_STATUS_TYPES = Object.values(subscriptionStatusTypes)

export const config = {
  port: process.env.PORT || 3000,
  //   redis: {
  //     url: process.env.REDIS_URL || 'redis://localhost:6379',
  //     prefix: process.env.REDIS_PREFIX || 'rate:',
  //   },

  rateLimit: {
    global: {
      max: parseInt(process.env.GLOBAL_RATE_LIMIT_MAX, 10) || 300,
      windowMs: parseInt(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    },
    otp: {
      max: parseInt(process.env.OTP_RATE_LIMIT_MAX, 10) || 5,
      windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS, 10) || 10 * 60 * 1000,
    },
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const MAX_AGE = 24 * 60 * 60 * 1000



