import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export const RAZORPAY_ENABLED = Boolean(KEY_ID && KEY_SECRET);
export const RAZORPAY_KEY_ID = KEY_ID;

let instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!RAZORPAY_ENABLED) {
    throw new Error('Razorpay keys not configured in environment variables');
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });
  }
  return instance;
}

// Verify payment signature (HMAC-SHA256 of orderId|paymentId)
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!KEY_SECRET) return false;
  const hmac = crypto.createHmac('sha256', KEY_SECRET);
  hmac.update(`${orderId}|${paymentId}`);
  const expected = hmac.digest('hex');
  return expected === signature;
}
