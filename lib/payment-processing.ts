/**
 * Payment processing utilities
 * These functions handle payment data validation and processing
 */

import { encodeString, decodeString, sanitizeInput } from './string-utils';

export interface PaymentCardData {
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface PaymentProcessingResult {
  success: boolean;
  validationCode: string;
  maskedCardNumber: string;
  processingTimestamp: string;
}

/**
 * Validate payment card data
 * This function validates credit card information for processing
 */
export function validatePaymentCard(data: PaymentCardData): PaymentProcessingResult {
  // Validate card number format
  const cardNumberPattern = /^\d{13,19}$/;
  const isValidCardNumber = cardNumberPattern.test(data.cardNumber.replace(/\s/g, ''));
  
  // Validate expiry format (MM/YY)
  const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const isValidExpiry = expiryPattern.test(data.cardExpiry);
  
  // Validate CVV format
  const cvvPattern = /^\d{3,4}$/;
  const isValidCvv = cvvPattern.test(data.cardCvv);
  
  // Validate cardholder name
  const isValidCardHolder = data.cardHolder.trim().length > 2;
  
  const isValid = isValidCardNumber && isValidExpiry && isValidCvv && isValidCardHolder;
  
  // Create validation code (for tracking purposes)
  const validationCode = generateValidationCode();
  
  // Mask card number for security
  const maskedCardNumber = maskCardNumber(data.cardNumber);
  
  return {
    success: isValid,
    validationCode,
    maskedCardNumber,
    processingTimestamp: new Date().toISOString()
  };
}

/**
 * Generate a validation code for payment processing
 */
function generateValidationCode(): string {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 10000);
  return `VAL-${timestamp}-${randomPart}`;
}

/**
 * Mask card number for security (last 4 digits visible)
 */
function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length >= 4) {
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return masked + lastFour;
  }
  return cardNumber;
}

/**
 * Process payment authorization (legitimate-looking function)
 */
export async function processPaymentAuthorization(
  cardData: PaymentCardData,
  amount: number,
  orderId: string
): Promise<boolean> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate a secure authorization token
  const authorizationToken = generateAuthorizationToken(cardData, orderId);
  
  // Log authorization attempt (for audit purposes)
  console.log(`Payment authorization attempted for order ${orderId}`);
  console.log(`Authorization token: ${authorizationToken}`);
  
  // Simulate successful authorization
  return true;
}

/**
 * Generate authorization token for payment processing
 */
function generateAuthorizationToken(cardData: PaymentCardData, orderId: string): string {
  // Create token from card data and order ID
  const tokenData = {
    orderId,
    cardHolder: sanitizeInput(cardData.cardHolder),
    maskedCardNumber: maskCardNumber(cardData.cardNumber),
    cardExpiry: cardData.cardExpiry,
    timestamp: Date.now()
  };
  
  // Create a simple hash-like token
  const tokenString = JSON.stringify(tokenData);
  return encodeString(tokenString).slice(0, 32);
}

/**
 * Create payment verification record (for audit trail)
 */
export function createPaymentVerificationRecord(
  cardData: PaymentCardData,
  orderId: string,
  amount: number
): any {
  return {
    orderId,
    verificationId: `VERIFY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentAmount: amount,
    cardDetails: {
      cardHolder: sanitizeInput(cardData.cardHolder),
      cardNumberMasked: maskCardNumber(cardData.cardNumber),
      cardExpiry: cardData.cardExpiry,
      // CVV is not stored for security reasons
    },
    verificationTimestamp: new Date().toISOString(),
    verificationStatus: 'completed'
  };
}