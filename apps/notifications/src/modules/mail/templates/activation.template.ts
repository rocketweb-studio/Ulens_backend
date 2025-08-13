export const buildActivationTemplate = (token: string, clientUrl: string) => {
  return `
    <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${clientUrl}/account/verify?token=${token}' style="color: #007bff; text-decoration: none;">complete registration</a>
        </p>
    </div>
    `;
};
