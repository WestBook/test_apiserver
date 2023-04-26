const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = 8084;
const getLobbyUrl = (hostname: string) => {
    return isDev ? `http://${hostname}:8081` : 'http://192.168.1.158/lobby';
};

export { apiPort, dbUrl, getLobbyUrl };
