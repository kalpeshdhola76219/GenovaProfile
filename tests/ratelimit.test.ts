import { checkRateLimit } from '../server/db.ts';

async function runRateLimitTests() {
  console.log('--- RUNNING DISTRIBUTED RATE LIMITER TESTS ---');

  const testKey = `test_key_${Date.now()}`;
  
  // 1. Initial request under limit
  const res1 = await checkRateLimit(testKey, 3, 2000, false);
  if (!res1.allowed || res1.count !== 1) {
    throw new Error(`Expected first request allowed with count 1, got ${JSON.stringify(res1)}`);
  }
  console.log('✓ Initial rate limit check passed (count 1, allowed)');

  // 2. Second request
  const res2 = await checkRateLimit(testKey, 3, 2000, false);
  if (!res2.allowed || res2.count !== 2) {
    throw new Error(`Expected second request allowed with count 2, got ${JSON.stringify(res2)}`);
  }
  console.log('✓ Second rate limit check passed (count 2, allowed)');

  // 3. Third request (at limit)
  const res3 = await checkRateLimit(testKey, 3, 2000, false);
  if (!res3.allowed || res3.count !== 3) {
    throw new Error(`Expected third request allowed with count 3, got ${JSON.stringify(res3)}`);
  }
  console.log('✓ Third rate limit check passed (count 3, allowed)');

  // 4. Fourth request (exceeded limit)
  const res4 = await checkRateLimit(testKey, 3, 2000, false);
  if (res4.allowed) {
    throw new Error(`Expected fourth request rejected, got allowed: ${JSON.stringify(res4)}`);
  }
  console.log('✓ Rate limit exceeded check passed (rejected as expected)');

  // 5. Fail-open test for contact key
  const contactKey = `contact:test_${Date.now()}`;
  const contactRes = await checkRateLimit(contactKey, 5, 1000, true);
  if (!contactRes.allowed) {
    throw new Error(`Expected contact rate limit check to allow, got ${JSON.stringify(contactRes)}`);
  }
  console.log('✓ Contact fail-open configuration passed');

  console.log('ALL RATE LIMITER TESTS COMPLETED SUCCESSFULLY!');
}

runRateLimitTests().catch((err) => {
  console.error('Rate limit test failure:', err);
  process.exit(1);
});
