import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    let transporter;

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      // Ethereal test account fallback
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const message = {
      from: `Miliva Skincare <${process.env.EMAIL_FROM || 'noreply@milivaskincare.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log(`Email sent: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Preview Email URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.warn(`Email sending failed: ${error.message}`);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (order, userEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #171717; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5;">
      <h2 style="font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;">Order Confirmed</h2>
      <p>Hi ${order.shippingAddress.fullName},</p>
      <p>Thank you for your order with <strong>Miliva Skincare</strong>. We are processing your items with utmost care.</p>
      
      <div style="background-color: #f7f3ed; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px;"><strong>Order ID:</strong> #${order.orderNumber}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      </div>

      <h4 style="margin-top: 20px;">Items Ordered:</h4>
      <ul style="padding-left: 20px;">
        ${order.items.map(item => `<li>${item.name} (${item.size}) x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
      </ul>

      <p style="margin-top: 30px;">You can track your order status anytime in your user dashboard.</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b6b6b;">Miliva Skincare &bull; Effective Formulations. Real Results.</p>
    </div>
  `;

  return await sendEmail({
    email: userEmail,
    subject: `Order Confirmation - #${order.orderNumber}`,
    message: `Thank you for your order #${order.orderNumber}. Total: ₹${order.totalAmount}`,
    html
  });
};
