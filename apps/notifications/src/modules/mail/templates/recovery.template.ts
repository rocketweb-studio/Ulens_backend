export const buildPasswordRecoveryTemplate = (token: string, email: string, clientUrl: string) => {
	return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Recovery</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 300;
      }
      .content {
        padding: 40px 30px;
        text-align: center;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 600;
        margin: 25px 0;
        transition: transform 0.2s ease;
      }
      .cta-button:hover {
        transform: translateY(-2px);
      }
      .footer {
        background-color: #f8f9fa;
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 14px;
      }
      .footer p {
        margin: 5px 0;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 5px;
        }
        .header {
          padding: 30px 15px;
        }
        .content {
          padding: 30px 20px;
        }
        .header h1 {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 Password Recovery</h1>
      </div>

      <div class="content">
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center">
          <h3 style="margin: 0 0 15px 0; color: #856404; font-size: 18px">🔑 Reset Your Password</h3>
          <p style="margin: 0 0 20px 0; color: #333; font-size: 16px">We received a request to reset your password. Click the button below to create a new password:</p>
          <a
            href="${clientUrl}/account/reset-password?token=${token}&email=${email}"
            style="
              display: inline-block;
              background-color: #ffc107;
              color: #333;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: 600;
              transition: background-color 0.2s ease;
            "
            >Reset Password</a
          >
          <p style="margin: 15px 0 0 0; color: #666; font-size: 14px">
            This link will expire in 1 hour for security reasons. If you didn't request this, please ignore this email.
          </p>
        </div>

        <p style="color: #666; font-size: 14px">If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
      </div>

      <div class="footer">
        <p>© 2025 <a href="https://ulens.org">Ulens</a>. All rights reserved.</p>
        <p>This email was sent to help you recover your account.</p>
        <p>If you didn't request password recovery, please ignore this email.</p>
      </div>
    </div>
  </body>
</html>

  `;
};
