// Single source for the default product/center name.
// Override per deployment with NEXT_PUBLIC_APP_NAME, or at runtime in
// Settings → "center_name" (stored in the database).
export const BRAND_NAME = process.env.NEXT_PUBLIC_APP_NAME || "O'quv Markaz CRM";
