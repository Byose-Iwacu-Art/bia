
const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();



// Function to send verification email
export async function sendInvoice( email: string, payment_status: string, name: string, order_number: string, amount: string, message: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Order Confirmation Invoice - BIA The African Touch";
  sendSmtpEmail.htmlContent = `
<html>
<head>
 
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .logo {
            max-width: 150px;
        }
        .content {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .order-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background: #d4af37;
            color: white;
        }
        .button {
            display: inline-block;
            background: #d4af37;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Header with Logo -->
    <div class="header">
        <img src="https://bia-tawny.vercel.app/_next/image?url=%2Fimgs%2Flogo.ico&w=64&q=75" alt="BIA Logo" class="logo">
    </div>

    <!-- Email Content -->
    <div class="content">
        <p>Dear ${name},</p>

        <p>Thank you for shopping with <strong>BIA - The African Touch</strong>. Your order has been successfully placed on <strong>${new Date().getDate()}</strong>.</p>
        
        <div class="order-details">
            <p><strong>Order #:</strong> ${order_number}</p>
            <p><strong>Total Amount:</strong> ${amount} RWF</p>
            <p><strong>Estimated Delivery:</strong> 1-3 Business Days</p>
        </div>

        <p><strong>Order Items</strong></p>
        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>African Leather Shoes</td>
                    <td>1</td>
                    <td>20,000 RWF</td>
                </tr>
                <tr>
                    <td>Traditional Woven Mat</td>
                    <td>2</td>
                    <td>15,000 RWF</td>
                </tr>
                <tr>
                    <td>Handmade Cotton Shirt</td>
                    <td>1</td>
                    <td>10,000 RWF</td>
                </tr>
            </tbody>
        </table>

        <p><strong>Subtotal:</strong> ${Number(amount) - (Number(amount)* 0.18)} RWF</p>
        <p><strong>VAT (18%):</strong> ${Number(amount)* 0.18} RWF</p>
        <p><strong>Grand Total:</strong> ${amount} RWF</p>

        <hr>

        <p>You can track your order and view the details at:</p>
        <p><a href="https://biafricantouch.com/dash/orders/${order_number}" class="button">View Order</a></p>

        <p>---</p>
        <p>Regards,</p>
        <p><strong>BIA - The African Touch</strong></p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><a href="https://biafricantouch.com">Visit our website</a> | <a href="https://biafricantouch.com/auth/login">Log in to your account</a> | <a href="mailto:giselumutoni@gmail.com">Get support</a></p>
        <p>Copyright © BIA - The African Touch, All rights reserved.</p>
    </div>
</div>

</body>
</html>`;
sendSmtpEmail.sender = { "name": "BIA", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email, "name": name }
];
sendSmtpEmail.replyTo = { "email": "giselumutoni@gmail.com", "name": "Bia Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Invoice sent!. ');
}, function (error: any) {
  console.error(error);
});

}
