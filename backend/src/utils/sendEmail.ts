import { sendEmail } from '../config/email';
import { config } from '../config';

export interface WelcomeEmailData {
    firstName: string;
    verificationUrl?: string;
}

export interface PasswordResetEmailData {
    firstName: string;
    resetUrl: string;
}

export interface OrderConfirmationEmailData {
    firstName: string;
    orderNumber: string;
    orderDate: string;
    items: Array<{ name: string; quantity: number; price: string }>;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    shippingAddress: string;
    orderUrl: string;
}

export interface OrderShippedEmailData {
    firstName: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    carrierName: string;
    estimatedDelivery: string;
}

export const sendWelcomeEmail = async (email: string, data: WelcomeEmailData): Promise<void> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${config.app.name}!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.firstName},</p>
          <p>Welcome to ${config.app.name}! We're excited to have you on board.</p>
          <p>You can now browse our wide selection of electronics and enjoy exclusive deals.</p>
          ${data.verificationUrl ? `
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email</a>
          ` : ''}
          <p>Happy shopping!</p>
          <p>The ${config.app.name} Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${config.app.name}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: `Welcome to ${config.app.name}!`,
        html,
    });
};

export const sendPasswordResetEmail = async (email: string, data: PasswordResetEmailData): Promise<void> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f44336; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${data.firstName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>
          <div class="warning">
            <strong>Note:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </div>
          <p>The ${config.app.name} Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${config.app.name}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html,
    });
};

export const sendOrderConfirmationEmail = async (email: string, data: OrderConfirmationEmailData): Promise<void> => {
    const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
    </tr>
  `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-table th { background: #f0f0f0; padding: 10px; text-align: left; }
        .totals { background: #fff; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Order #${data.orderNumber}</p>
        </div>
        <div class="content">
          <p>Hi ${data.firstName},</p>
          <p>Thank you for your order! We've received your order and will begin processing it soon.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order Date:</strong> ${data.orderDate}</p>
          
          <table class="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <p><strong>Subtotal:</strong> ${data.subtotal}</p>
            <p><strong>Shipping:</strong> ${data.shipping}</p>
            <p><strong>Tax:</strong> ${data.tax}</p>
            <hr>
            <p style="font-size: 18px;"><strong>Total:</strong> ${data.total}</p>
          </div>
          
          <h3>Shipping Address</h3>
          <p>${data.shippingAddress}</p>
          
          <a href="${data.orderUrl}" class="button">View Order</a>
          
          <p>The ${config.app.name} Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${config.app.name}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: `Order Confirmation - #${data.orderNumber}`,
        html,
    });
};

export default {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail,
};
