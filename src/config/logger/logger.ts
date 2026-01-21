import winston from 'winston';

// Define the data format for your logs
const logFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
);

export const appLogger = winston.createLogger({
        level: 'info', // Captures 'info', 'warn', and 'error'
        format: logFormat,
        transports: [
                // 1. Output to the console
                new winston.transports.Console(),

                // 2. Save logs to a local data file
                new winston.transports.File({
                        filename: 'logs/app.log',
                        level: 'info'
                })
        ]
});
