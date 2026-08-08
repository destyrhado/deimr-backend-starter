const formatMessage = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} ${level}: ${message}`;
};

export const logger = {
  info: (message: string) => console.info(formatMessage('INFO', message)),
  warn: (message: string) => console.warn(formatMessage('WARN', message)),
  error: (message: string) => console.error(formatMessage('ERROR', message)),
  debug: (message: string) => console.debug(formatMessage('DEBUG', message)),
  stream: {
    write: (message: string) =>
      console.info(formatMessage('INFO', message.trim())),
  },
};
