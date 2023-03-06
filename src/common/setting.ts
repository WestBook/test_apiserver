const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = isDev ? 8084 : 8087;

export { apiPort, dbUrl }
