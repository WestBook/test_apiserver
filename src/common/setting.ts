const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = 8087;
const getLobbyUrl = (hostname: string, isMultiLang: boolean = false) => {
    if (isDev) {
        return `http://${hostname}:8081`;
    }
    return isMultiLang ? 'http://192.168.1.158/multiLangMockLobby' : 'http://192.168.1.158/lobby';
};
const slotGameType = {
    13: 'csd',
    22: 'lhdb',
};

export { apiPort, dbUrl, getLobbyUrl, slotGameType };
