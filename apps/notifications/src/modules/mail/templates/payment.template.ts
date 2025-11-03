import { LetterDetailsDto } from "../dto/letter-details.dto";

export const buildPaymentTemplate = (dto: LetterDetailsDto, clientUrl: string, isSuccess: boolean) => {
	const expireDate = new Date(dto.premiumExpDate as string).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	const baseStyles = `
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
  `;

	if (isSuccess) {
		return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Successful</title>
    ${baseStyles}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Payment Successful</h1>
      </div>

      <div class="content">
        <div style="background-color: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center">
          <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px">🎉 Payment Completed Successfully!</h3>
          <p style="margin: 0 0 20px 0; color: #333; font-size: 16px">Thank you for your payment! Your transaction has been processed successfully.</p>
          ${`<p style="margin: 0 0 15px 0; color: #155724; font-size: 14px; font-weight: 600;">Your plan ${dto.plan_name} will be active until ${expireDate}</p>`}
          <a
            href="${clientUrl}"
            style="
              display: inline-block;
              background-color: #28a745;
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: 600;
              transition: background-color 0.2s ease;
            "
            >Go to Ulens</a
          >
          <p style="margin: 15px 0 0 0; color: #666; font-size: 14px">
            You can now access all premium features. If you have any questions, please contact our support team.
          </p>
        </div>

        <p style="color: #666; font-size: 14px">Thank you for choosing Ulens! We appreciate your business and look forward to serving you.</p>
      </div>

      <div class="footer">
        <p>© 2025 <a href="https://ulens.org">Ulens</a>. All rights reserved.</p>
        <p>This email confirms your successful payment.</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </div>
  </body>
</html>
  `;
	} else {
		return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Failed</title>
    ${baseStyles}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>❌ Payment Failed</h1>
      </div>

      <div class="content">
        <div style="background-color: #f8d7da; border: 1px solid #dc3545; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center">
          <h3 style="margin: 0 0 15px 0; color: #721c24; font-size: 18px">⚠️ Payment Could Not Be Processed</h3>
          <p style="margin: 0 0 20px 0; color: #333; font-size: 16px">We encountered an issue processing your payment. Please try again or contact support if the problem persists.</p>
          ${dto.code ? `<p style="margin: 0 0 15px 0; color: #721c24; font-size: 14px; font-weight: 600;">Transaction ID: ${dto.code}</p>` : ""}
          <a
            href="${clientUrl}"
            style="
              display: inline-block;
              background-color: #dc3545;
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: 600;
              transition: background-color 0.2s ease;
            "
            >Try Again</a
          >
          <p style="margin: 15px 0 0 0; color: #666; font-size: 14px">
            Common issues include insufficient funds, expired card, or incorrect billing information. Please verify your payment details.
          </p>
        </div>

        <p style="color: #666; font-size: 14px">If you continue to experience issues, please contact our support team for assistance.</p>
      </div>

      <div class="footer">
        <p>© 2025 <a href="https://ulens.org">Ulens</a>. All rights reserved.</p>
        <p>This email notifies you of a failed payment attempt.</p>
        <p>If you need help, please contact our support team.</p>
      </div>
    </div>
  </body>
</html>
  `;
	}
};
