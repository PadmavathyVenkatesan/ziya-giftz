export const environment = {
  production: true,
  apiUrl: '/api', // This will be relative to the host in production
  phonepe: {
    merchantId: 'YOUR_PRODUCTION_MERCHANT_ID', // Replace with your actual production merchant ID
    saltKey: 'YOUR_PRODUCTION_SALT_KEY', // Replace with your actual production salt key
    saltIndex: 1, // Your production salt index
    environment: 'production' as 'sandbox' | 'production'
  },
  razorpay: {
    keyId: 'YOUR_PRODUCTION_RAZORPAY_KEY_ID', // Replace with your actual production Razorpay key ID
    enabled: true // Do not store secrets in frontend builds
  }
};
