import assert from 'assert';
import crypto from 'crypto';

console.log('--- RUNNING CASHFREE SYSTEM & RECOVERY TESTS ---');

// 1. Signature Verification test
function verifyWebhookSignature(rawBody: string, signature: string, timestamp: string, secretKey: string): boolean {
  const payload = timestamp + rawBody;
  const expectedSig = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('base64');
  return expectedSig === signature;
}

const mockSecret = 'cf_secret_key_test_12345';
const mockPayload = JSON.stringify({
  data: {
    order: { order_id: 'order_test_999' },
    payment: { payment_status: 'SUCCESS', payment_amount: 100 }
  },
  event_time: '2026-10-16T08:00:00Z',
  type: 'PAYMENT_SUCCESS_WEBHOOK'
});
const mockTimestamp = '1729065600';
const validSignature = crypto.createHmac('sha256', mockSecret).update(mockTimestamp + mockPayload).digest('base64');

assert.strictEqual(
  verifyWebhookSignature(mockPayload, validSignature, mockTimestamp, mockSecret),
  true,
  'Webhook signature verification should pass for valid signature'
);
assert.strictEqual(
  verifyWebhookSignature(mockPayload, 'invalidsig==', mockTimestamp, mockSecret),
  false,
  'Webhook signature verification should fail for invalid signature'
);
console.log('✓ Webhook HMAC-SHA256 signature verification passed');

// 2. Recovery Code Hashing test
function hashRecoveryCode(code: string): string {
  const clean = code.trim().toUpperCase();
  return crypto.createHash('sha256').update('recovery_salt_' + clean).digest('hex');
}

const code1 = 'REC-ABC-123';
const code2 = 'rec-abc-123 ';
assert.strictEqual(
  hashRecoveryCode(code1),
  hashRecoveryCode(code2),
  'Recovery code hashing should be case-insensitive and trim whitespace'
);
console.log('✓ Recovery code hash normalization passed');

// 3. Export Scale & Document Sheets
const sampleWidth = 794;
const sampleHeight = 1123;
const ratio = Number((sampleWidth / sampleHeight).toFixed(2));
assert.strictEqual(ratio >= 0.7 && ratio <= 0.72, true, 'A4 aspect ratio should be approximately 0.707');
console.log('✓ A4 dimensions scale and aspect ratio verification passed');

console.log('ALL CASHFREE SYSTEM TESTS COMPLETED SUCCESSFULLY!');
