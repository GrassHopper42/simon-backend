import * as moment from 'moment-timezone';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const env = process.env.NODE_ENV;

const appendTimestamp = winston.format((info, opts) => {
  if (opts['tz']) {
    info.timestamp = moment().tz(opts['tz']).format();
  }
  return info;
});

const colors: winston.config.AbstractConfigSetColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  prompt: 'cyan',
  verbose: 'cyan',
  data: 'cyan',
};

winston.addColors(colors);

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'prod' ? 'http' : 'debug',
      format:
        env === 'prod'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('Simon', {
                prettyPrint: true,
                appName: true,
                colors: true,
                processId: true,
              }),
            ),
    }),
  ],
  format: winston.format.combine(
    // winston.format.colorize({ all: true }),
    appendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.json(),
    winston.format.printf((info) => {
      if (info.stack) {
        return `${info.timestamp} - ${info.level} [${process.pid}]: ${info.message}\n Error Stack: ${info.stack}`;
      }
      return `${info.timestamp} - ${info.level} [${process.pid}]: ${info.message}`;
    }),
  ),
});
