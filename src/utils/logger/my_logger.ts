import winston from 'winston';

const log = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
	  new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
		// TODO : Should be disabled in production
		new winston.transports.Console({
			format: winston.format.combine(
	winston.format.colorize(),
				winston.format.simple()
			)
		}),
	],
});

export {
	log,
};
