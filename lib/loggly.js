import winston from 'winston';
import 'winston-loggly';

export function addTransport(winstonLogger) {
  // Add the loggly transport if the environment variables are configured
  const { LOGGLY_LEVEL, LOGGLY_SUBDOMAIN, LOGGLY_TOKEN } = process.env;
  if (LOGGLY_SUBDOMAIN && LOGGLY_TOKEN) {
    winstonLogger.add(winston.transports.Loggly, {
      subdomain: LOGGLY_SUBDOMAIN,
      token: LOGGLY_TOKEN,
      level: LOGGLY_LEVEL || 'info',
    });
  }
}
