import log4js from 'log4js';
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        app: {
            type: 'dateFile',
            filename: 'log4js/log.log',
            encoding: 'utf-8',
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","info":\'%m\'}',
            },
            pattern: 'yyyyMMdd',
            keepFileExt: true,
            alwaysIncludePattern: true,
        },
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'all' },
    },
});
const logger = log4js.getLogger('');
logger.level = 'all';

export default function log4(message: any, level: string = 'info') {
    logger[level](JSON.stringify(message));
}
