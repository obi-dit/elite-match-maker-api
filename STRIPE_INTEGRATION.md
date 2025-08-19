# Stripe Integration Documentation

## Overview

This application integrates with Stripe for payment processing for the Elite International Match Maker Passport Bachelor program.

## Setup Instructions

### 1. Stripe Account Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe Webhook Secret
FRONTEND_URL=http://localhost:3000 # Your frontend URL
```

### 3. Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add endpoint: `https://your-domain.com/payment/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret to your environment variables

## Database Schema

### Tables

#### Package

- `id`: Primary key
- `name`: Package name (e.g., "Bachelor Pilot Show")
- `description`: Package description
- `price`: Decimal amount
- `stripePriceId`: Stripe Price ID (optional)
- `isActive`: Boolean flag
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Transaction

- `id`: Primary key
- `userId`: Foreign key to User
- `packageId`: Foreign key to Package
- `stripePaymentIntentId`: Stripe Payment Intent ID
- `stripeCheckoutSessionId`: Stripe Checkout Session ID
- `amount`: Decimal amount
- `currency`: String (default: "USD")
- `status`: TransactionStatus enum
- `paymentMethod`: String
- `metadata`: JSON field
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### UserPackage

- `id`: Primary key
- `userId`: Foreign key to User
- `packageId`: Foreign key to Package
- `purchasedAt`: Timestamp
- `expiresAt`: Optional timestamp
- `isActive`: Boolean flag

### Enums

#### TransactionStatus

- `PENDING`: Initial state
- `PAID`: Payment successful
- `FAILED`: Payment failed
- `CANCELLED`: Payment cancelled
- `REFUNDED`: Payment refunded

## API Endpoints

### Payment Endpoints

#### Create Payment Session

- **POST** `/payment/create-session`
- **Body**: `{ userId: number, packageName?: string }`
- **Response**: `{ success: true, sessionId: string, url: string }`

#### Webhook Handler

- **POST** `/payment/webhook`
- **Headers**: `stripe-signature`
- **Body**: Stripe webhook payload

#### Get Transaction by Session ID

- **GET** `/payment/transaction/:sessionId`
- **Response**: `{ success: true, transaction: Transaction }`

#### Get User Packages

- **GET** `/payment/user/:userId/packages`
- **Response**: `{ success: true, packages: UserPackage[] }`

## Payment Flow

### 1. User Registration (Male)

When a male user submits their application:

1. User data is saved to database
2. Payment session is automatically created
3. User is redirected to Stripe Checkout
4. Transaction record is created with `PENDING` status

### 2. Payment Processing

1. User completes payment on Stripe
2. Stripe sends webhook to `/payment/webhook`
3. Webhook handler updates transaction status
4. UserPackage relationship is created
5. User is redirected to success page

### 3. Background Processing

- Every 5 minutes: Check pending transactions
- Daily at midnight: Clean up expired sessions
- Automatic status updates from Stripe

## Frontend Integration

### Payment Success Page

- **URL**: `/payment/success?session_id={CHECKOUT_SESSION_ID}`
- **Features**:
  - Transaction details display
  - Next steps information
  - Return to home button

### Payment Cancel Page

- **URL**: `/payment/cancel`
- **Features**:
  - Cancellation explanation
  - Contact information
  - Retry payment option

## Security Features

1. **Webhook Signature Verification**: All webhooks are verified using Stripe's signature
2. **Transaction Status Tracking**: Complete audit trail of payment status
3. **Background Processing**: Automatic status updates and cleanup
4. **Error Handling**: Comprehensive error handling and logging

## Monitoring

### Transaction Statistics

The background service provides transaction statistics:

- Count by status
- Total amounts by status
- Automatic cleanup of expired sessions

### Logging

All payment operations are logged with appropriate levels:

- Info: Successful operations
- Error: Failed operations
- Debug: Detailed debugging information

## Testing

### Test Cards

Use Stripe's test cards for development:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:6000/payment/webhook
```

## Error Handling

### Common Issues

1. **Webhook Signature Mismatch**: Check webhook secret
2. **Session Not Found**: Verify session ID
3. **Database Connection**: Check Prisma connection
4. **Stripe API Errors**: Check API keys and permissions

### Troubleshooting

1. Check application logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure database migrations are applied
4. Test webhook endpoints with Stripe CLI

## Deployment

### Production Checklist

1. ✅ Set production Stripe keys
2. ✅ Configure webhook endpoints
3. ✅ Set up SSL certificates
4. ✅ Configure environment variables
5. ✅ Run database migrations
6. ✅ Test payment flow end-to-end

### Environment Variables for Production

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-domain.com
DATABASE_URL=postgresql://...
```

## Support

For issues with the Stripe integration:

1. Check the application logs
2. Verify Stripe Dashboard settings
3. Test with Stripe's test mode
4. Contact the development team
