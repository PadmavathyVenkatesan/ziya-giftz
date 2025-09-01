export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  phonepe: {
    merchantId: 'PGTESTPAYUAT',
    saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
    saltIndex: 1,
    environment: 'sandbox' as 'sandbox' | 'production'
  },
  razorpay: {
    keyId: 'rzp_test_R59xuZTq7cx3bj', // Actual Razorpay test key ID
    enabled: true // Enable real Razorpay integration
  }
};
