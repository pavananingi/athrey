const winston = require('winston');
const path = require('path');
const split = require('split');
const morgan = require("morgan");

// declare var process: any

const { combine, timestamp, label, printf, errors } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

// Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info, opts) => {
    if (info.private) { return false; }
    return info;
});

const customFormat = combine(
    errors({ stack: true }),
    ignorePrivate(),
    timestamp(),
    winston.format.splat(),
    winston.format.simple(),
    // winston.format.colorize(),
    myFormat
);

const logger = winston.createLogger({
    format: customFormat,
    // defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
            level: 'error',
            filename: path.join(process.mainModule.filename, '..', '..', 'logs', 'error.log'),
            maxsize: 52428800, // 50MB
            maxFiles: 100,
        }),
        new winston.transports.File({
            filename: path.join(process.mainModule.filename, '..', '..', 'logs', 'combined.log'),
            maxsize: 52428800, // 50MB
            maxFiles: 100,
        }),
    ],
    exceptionHandlers: [

        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(process.mainModule.filename, '..', '..', 'logs', 'exceptions.log'),
            maxsize: 52428800, // 50MB
            maxFiles: 100,
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: customFormat,
//     }));
// }
logger.add(new winston.transports.Console({
    format: customFormat,
}));

const loggerStream = split().on('data', function (message) {
    logger.info(message);
});

const logMorgan = morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', { stream: loggerStream })

module.exports = {
    logger,
    logMorgan
};