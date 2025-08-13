export const buildPasswordRecoveryTemplate = (token: string, clientUrl: string) => {
  return `
    <h1>Password Recovery</h1>
    <p>To reset your password, please follow the link below:</p>
    <a href='${clientUrl}/account/reset-password?token=${token}' style="color: #007bff; text-decoration: none;">reset password</a>
  `;
};
