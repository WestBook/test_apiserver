const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = 8087;
const getLobbyUrl = (hostname: string) => {
    return isDev ? `http://${hostname}:8081` : 'http://192.168.1.158/lobby';
};

const gameList = [
    {
        name: 'LHDZ',
        CH: '龍虎大戰',
        gameId: 12,
        type: 'Bet',
    },
    {
        name: 'QZPJ',
        CH: '搶庄牌九',
        gameId: 28,
        type: 'Qz',
    },
    {
        name: 'ERNN',
        CH: '二人牛牛',
        gameId: 46,
        type: 'Qz',
    },
    {
        name: 'SRNN',
        CH: '四人牛牛',
        gameId: 50,
        type: 'Qz',
    },
];

const getGameByName = (name: string) => {
    return gameList.find((item) => item.name === name);
};

const getGameById = (id: string) => {
    return gameList.find((item) => item.gameId === Number(id));
};
const GameList = ['LHDZ', 'QZPJ', 'ERNN', 'SRNN'];

const getGameSetting = (serverId: string) => {
    let gameNum = serverId.slice(1, serverId.length - 1);
    let subType = serverId.slice(serverId.length - 1);
    let game = getGameById(gameNum);
    return { ...game, subType };
};

export { GameList, apiPort, dbUrl, getLobbyUrl, getGameByName, getGameSetting, getGameById };
