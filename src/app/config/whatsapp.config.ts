export interface WhatsAppConfig {
  businessPhoneNumber: string;
  businessName: string;
  apiToken?: string; // For WhatsApp Business API
  apiUrl?: string; // For WhatsApp Business API
  messagingEnabled: boolean;
  autoConfirmation: boolean;
  statusUpdates: boolean;
  customMessages: {
    orderConfirmation: string;
    orderShipped: string;
    orderDelivered: string;
    orderCancelled: string;
  };
}

export const WHATSAPP_CONFIG: WhatsAppConfig = {
  // Replace with your actual WhatsApp business number (include country code)
  businessPhoneNumber: '+919876543210',

  // Your business name
  businessName: 'Ziya Giftz',

  // WhatsApp Business API credentials (optional - for automated messaging)
  // Get these from WhatsApp Business API or third-party providers like Twilio, MessageBird
  apiToken: undefined, // 'your-api-token-here'
  apiUrl: undefined, // 'https://api.whatsapp.com/send' or your provider's URL

  // Feature flags
  messagingEnabled: true,
  autoConfirmation: true,
  statusUpdates: true,

  // Custom message templates
  customMessages: {
    orderConfirmation: `🎉 Thank you for your order!

Order Details:
📦 Order Number: {orderNumber}
💰 Total Amount: ₹{totalAmount}
📅 Order Date: {orderDate}

Items:
{items}

📱 Track your order: {trackingUrl}

We'll keep you updated on your order status!

Best regards,
{businessName} Team`,

    orderShipped: `📦 Great news! Your order has been shipped!

Order Number: {orderNumber}
🚚 Tracking: Your package is on its way
📅 Expected Delivery: {expectedDelivery}

Track your order: {trackingUrl}

Thank you for choosing {businessName}!`,

    orderDelivered: `✅ Your order has been delivered!

Order Number: {orderNumber}
📦 Delivered successfully!

Thank you for shopping with {businessName}!
We hope you love your purchase.

Please share your feedback with us!`,

    orderCancelled: `❌ Order Cancellation Notification

Order Number: {orderNumber}
Status: Cancelled

If you have any questions about this cancellation, please contact us.

Thank you,
{businessName} Team`
  }
};

// Helper function to format phone numbers for WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add country code if not present (assuming India +91)
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  // Remove leading + if present
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned;
  }

  return cleaned;
}

// Helper function to validate WhatsApp configuration
export function validateWhatsAppConfig(config: WhatsAppConfig): {isValid: boolean, errors: string[]} {
  const errors: string[] = [];

  if (!config.businessPhoneNumber) {
    errors.push('Business phone number is required');
  }

  if (!config.businessName) {
    errors.push('Business name is required');
  }

  if (config.apiToken && !config.apiUrl) {
    errors.push('API URL is required when API token is provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
