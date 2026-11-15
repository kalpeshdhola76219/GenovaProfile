/**
 * Test production validation logic
 */

function testValidationLogic(envObj: Record<string, string | undefined>): { valid: boolean; errors: string[] } {
  if (envObj.NODE_ENV !== 'production') {
    return { valid: true, errors: [] };
  }

  const requiredVars = [
    'APP_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CASHFREE_CLIENT_ID',
    'CASHFREE_CLIENT_SECRET',
    'RECOVERY_PEPPER',
    'CRON_SECRET',
    'GEMINI_API_KEY',
  ] as const;

  const errors: string[] = [];

  for (const envVar of requiredVars) {
    const val = envObj[envVar];
    if (!val || !val.trim()) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  const appUrl = (envObj.APP_URL || '').trim();
  if (appUrl && !appUrl.startsWith('https://')) {
    errors.push(`Invalid APP_URL: Must start with "https://" in production (current: "${appUrl}")`);
  }

  const cashfreeEnv = (envObj.CASHFREE_ENVIRONMENT || '').trim().toLowerCase();
  if (cashfreeEnv !== 'production') {
    errors.push(`Invalid CASHFREE_ENVIRONMENT: Must be set to "production" in production mode (current: "${cashfreeEnv || 'undefined'}")`);
  }

  return { valid: errors.length === 0, errors };
}

console.log('--- RUNNING PRODUCTION ENVIRONMENT VALIDATION TESTS ---');

// Test 1: In development mode, skips validation
const devTest = testValidationLogic({ NODE_ENV: 'development' });
if (!devTest.valid) {
  throw new Error('Expected development mode to pass validation without production errors');
}
console.log('✓ Development mode skip check passed');

// Test 2: In production mode with missing vars, lists every missing one
const prodMissingTest = testValidationLogic({
  NODE_ENV: 'production',
  APP_URL: 'http://insecure.com',
  CASHFREE_ENVIRONMENT: 'sandbox',
});
if (prodMissingTest.valid) {
  throw new Error('Expected production mode with missing vars to fail');
}
if (prodMissingTest.errors.length < 9) {
  throw new Error(`Expected at least 9 errors (missing vars + insecure URL + non-production cashfree), got ${prodMissingTest.errors.length}`);
}
console.log(`✓ Production mode caught ${prodMissingTest.errors.length} expected errors for missing/invalid variables`);

// Test 3: In production mode with complete and secure configuration, passes
const prodValidTest = testValidationLogic({
  NODE_ENV: 'production',
  APP_URL: 'https://genovaprofile.com',
  SUPABASE_URL: 'https://xyz.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'secret-role-key',
  CASHFREE_CLIENT_ID: 'cf_prod_id',
  CASHFREE_CLIENT_SECRET: 'cf_prod_secret',
  RECOVERY_PEPPER: 'secure-pepper-salt',
  CRON_SECRET: 'cron-token',
  GEMINI_API_KEY: 'gemini-key',
  CASHFREE_ENVIRONMENT: 'production',
});
if (!prodValidTest.valid) {
  throw new Error(`Expected valid production config to pass, got: ${JSON.stringify(prodValidTest.errors)}`);
}
console.log('✓ Production mode valid configuration passed');

console.log('ALL PRODUCTION VALIDATION TESTS PASSED SUCCESSFULLY!');
