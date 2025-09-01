export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  phonepe: {
    merchantId: 'PGTESTPAYUAT', // Test merchant ID - replace with your actual merchant ID
    saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399', // Test salt key - replace with your actual salt key
    saltIndex: 1, // Your salt index
    environment: 'sandbox' as 'sandbox' | 'production'
  },
  razorpay: {
    keyId: 'rzp_test_R59xuZTq7cx3bj', // Actual Razorpay test key ID
    enabled: true // Enable real Razorpay integration
  }
};
