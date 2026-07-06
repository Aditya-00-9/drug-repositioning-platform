export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  isStaging: process.env.APP_ENV === "staging",
  authSecret: process.env.AUTH_SECRET ?? "dev-secret-change-in-production",
  reviewerEmail: process.env.REVIEWER_EMAIL ?? "reviewer@example.com",
  reviewerPassword: process.env.REVIEWER_PASSWORD ?? "reviewer-dev-pass",
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? "100"),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? "60000"),
};
