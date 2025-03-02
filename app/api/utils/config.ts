
  const brevo = require('@getbrevo/brevo');
  let apiInstance = new brevo.TransactionalEmailsApi();
  

// Function to send verification email
export async function sendAccountCreationEmail(email: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to Byose Iwacu Art";
  sendSmtpEmail.htmlContent = `
  <html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Our Store</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 17px;
            font-family: sans-serif;
            color: black;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .content  a{
            color: white;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #ecf0f1;
            font-size: 14px;
            color:grey;
        }
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Welcome to BIA The African Touch!
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for creating an account with us! We're thrilled to have you as part of our community.</p>
            <p>Get ready for an amazing shopping experience with exclusive deals and offers.</p>
            <a href="www.biafricantouch.com/dash" class="button">Visit your dashboard to learn more</a>
        </div>
        <div class="footer">
            Need help? Contact us at <a href="mailto:giselumutoni@gmail.com">support@biafricantouch.com</a>
            <br>
            &copy; 2025 Bia Team. All rights reserved.
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
    console.log('Welcome email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}


// Function to send verification email
export async function sendOrderPaymentsEmail( email: string, payment_status: string, name: string, order_number: string, amount: string, message: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Order Payment Details ";
  sendSmtpEmail.htmlContent = `
<html>
  <head>
    <style>
           body {
        margin: 0;
        padding: 40px;
        display: flex;
        justify-content: center;
      }

      .container {
        font-family: 'Arial', sans-serif;
        background: linear-gradient(135deg, #f8f9fa, #e3e6ec);
        width: 100%;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .header {
        font-size: 26px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }

      .order-details {
        text-align: left;
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        width: 40%;
        margin: auto;
      }

      .order-details p {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 500;
        color: #555;
      }

     .button {
        display: block;
        width: max-content;
        margin: 12px auto;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 5px;
        color: #fff;
        text-decoration: none;
        transition: background 0.3s ease-in-out;
        background: #ff8352;
      }
       p{
         color: black;
         font-size: 17px;
        }
      
      .status-badge {
        display: inline-block;
        padding: 10px 25px;
        text-align: center;
        border-radius: 8px;
        font-size: 16px;
        color: #fff;
        margin: 10px 0;
      }

      .status-success {
        background: #28a745;
      }

      .status-failed {
        background: #dc3545;
      }

      .status-pending {
        background: #ffc107;
        color: #333;
      }
      .button a{
      color: white;}
      .button:hover {
        background: #0056b3;
      }

      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Payment Status Update</div>
      <p>Dear <strong>${name}</strong>,</p>
      <span class="status-badge ${payment_status === 'Paid' ? 'status-success' : payment_status === 'Failed' ? 'status-failed' : 'status-pending'}">
        ${payment_status}
      </span>
      <p>${message}</p>
      <div class="order-details">
        <p><strong>Order Number:</strong> ${order_number}</p>
        <p><strong>Amount Paid (RWF):</strong> ${amount}</p>
      </div>
      <a href="https://biafricantouch.com/dash/orders/${order_number}" class="button">View Order</a>
      <div class="footer">
        If you have any questions, feel free to <a href="mailto:giselumutoni@gmail.com">contact us</a>.
      </div>
    </div>
  </body>
</html>
`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "dev@biafricantouch.com", "name": "Kamero" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error.body.message);
  });
  
}

// Function to send verification email
export async function sendOrderPlacementEmail(email: string, name: string, order_number:string,  total_items: string, delivery_status: string, time_date: string, amount: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "New Order Placed";
  sendSmtpEmail.htmlContent = `
 <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 40px;
        display: flex;
        justify-content: center;
      }

      .container {
        font-family: 'Arial', sans-serif;
        background: linear-gradient(135deg, #f8f9fa, #e3e6ec);
        width: 100%;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .header {
        font-size: 26px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }

      .order-details {
        text-align: left;
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        width: 40%;
        margin: auto;
      }

      .order-details p {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 500;
        color: #555;
      }

     .button {
        display: block;
        width: max-content;
        margin: 12px auto;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 5px;
        color: #fff;
        text-decoration: none;
        transition: background 0.3s ease-in-out;
        background: #ff8352;
      }
       p{
         color: black;
         font-size: 17px;
        }
      .button a{
      color: white;}
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }
        .button{color:white;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">🎉 Your Order Has Been Placed!</div>
      <p>Dear <strong>${name}</strong>, <br>Thank you for shopping with us. Here are your order details:</p>
      <div class="order-details">
        <p><strong>📦 Order Number:</strong> ${order_number}</p>
        <p><strong>🛍 Total Items:</strong> ${total_items}</p>
        <p><strong>🚚 Delivery Status:</strong> ${delivery_status}</p>
        <p><strong>💰 Amount (RWF):</strong> ${amount}</p>
        <p><strong>⏳ Date & Time:</strong> ${time_date}</p>
      </div>
      <a href="https://biafricantouch.com/dash/order/${order_number}" class="button btn-primary">💳 Make Payment</a>
      <a href="https://biafricantouch.com/dash/order/${order_number}" class="button btn-success">📜 View Order</a>
      <a href="https://biafricantouch.com/dash" class="button btn-secondary">📊 Go to Dashboard</a>
      <div class="footer">
        If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.
      </div>
    </div>
  </body>
</html>
`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art (BIA)", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "giselumutoni@gmail.com", "name": "CEO" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('Email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

// Function to send verification email
export async function sendAccountVerificationSMS(phone: string): Promise<void> {

let apiInstance = new brevo.TransactionalSMSApi()

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_SMS_API_KEY;

let sendTransacSms = new brevo.SendTransacSms();
sendTransacSms.sender = 'Kamero Research Base';
sendTransacSms.recipient = phone;
sendTransacSms.htmlContent = 'Your account verification code is : ';
sendTransacSms.type = 'transactional';
sendTransacSms.webUrl = 'https://supervisor.kamero.rw';

apiInstance.sendTransacSms(sendTransacSms).then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error: any) {
  console.error(error);
});
}