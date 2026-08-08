export const swaggerCustomCss = (_nodeEnv: string) => `
  html,
  body {
    background: #fafafa;
  }

  .swagger-ui .topbar {
    background: #1b1b1b;
    box-shadow: none;
    padding: 10px 0;
  }

  .swagger-ui .topbar a,
  .swagger-ui .topbar svg {
    display: none;
  }

  .swagger-ui .wrapper,
  .swagger-ui .topbar .wrapper {
    max-width: 1626px;
    padding: 0 16px;
  }

  .swagger-ui .info {
    margin: 56px 0;
  }

  .swagger-ui .info .title {
    color: #3b4151;
    font-size: 44px;
    line-height: 1.2;
  }

  .swagger-ui .info p {
    color: #3b4151;
    font-size: 16px;
  }

  .swagger-ui .scheme-container {
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.14);
    margin: 0 0 24px;
    padding: 28px 0;
  }

  .swagger-ui .scheme-container .wrapper {
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }

  .swagger-ui .scheme-container .schemes {
    margin-right: auto;
  }

  .swagger-ui .opblock-tag {
    border-bottom: 1px solid rgba(59, 65, 81, 0.25);
    border-radius: 0;
    margin: 0;
    padding: 10px 0;
  }

  .swagger-ui section.models {
    border: none;
    border-radius: 0;
  }
`;
