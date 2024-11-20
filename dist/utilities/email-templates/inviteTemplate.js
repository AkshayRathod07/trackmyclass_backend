"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1({ first_name, last_name, organization_name, role, base_url_client, code, image_url = '', color = '#8928c6', }) {
    const formattedCode = code
        .split('')
        .map((char) => `<div class="otp-box">${char}</div>`)
        .join('');
    return `
    <!DOCTYPE html>
    <html lang="en" style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: ${color};
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header img {
          max-width: 100px;
          border-radius: 50%;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content h1 {
          font-size: 22px;
          margin: 0 0 10px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #666;
          margin: 0 0 20px;
        }
        .otp-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }
        .otp-box {
          width: 40px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid ${color};
          border-radius: 5px;
          background-color: #fff;
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #999;
          background: #f4f4f4;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="${image_url}" alt="Organization Logo">
          <h2>Welcome to ${organization_name}!</h2>
        </div>
        <div class="content">
          <h1>Hello ${first_name} ${last_name},</h1>
          <p>You have been invited to join as a ${role}.</p>
          <p>Use the code below to complete your registration:</p>
          <div class="otp-container">
            ${formattedCode}
          </div>
          <p>
            <a href="${base_url_client}" style="color: ${color}; text-decoration: none;">Go to Portal</a>
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} ${organization_name}. All rights reserved and made with ❤️
        </div>
      </div>
    </body>
    </html>
  `;
}
