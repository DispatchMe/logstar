import winston from 'winston';
import 'winston-loggly';

export function addTransport(winstonLogger) {
  // Add the loggly transport if the environment variables are configured
  const { LOGGLY_LEVEL, LOGGLY_SUBDOMAIN, LOGGLY_TAGS, LOGGLY_TOKEN } = process.env;
  if (LOGGLY_SUBDOMAIN && LOGGLY_TOKEN) {
    const logglyTags = LOGGLY_TAGS ? LOGGLY_TAGS.split(',') : [];
    winstonLogger.add(winston.transports.Loggly, {
      subdomain: LOGGLY_SUBDOMAIN,
      token: LOGGLY_TOKEN,
      tags: logglyTags,
      level: LOGGLY_LEVEL || 'info',
    });
  }
}
