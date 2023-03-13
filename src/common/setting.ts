const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = 8087;
const getLobbyUrl = (hostname: string) => {
    return isDev ? `http://${hostname}:8081` : 'http://192.168.1.158/lobby';
};

let GameList;
export const setGameList = (gameList) => {
    GameList = gameList;
};

const getGameByName = (name: string) => {
    return GameList.find((item) => item.name === name);
};

const getGameById = (id: string) => {
    return GameList.find((item) => item.gameId === id);
};

const getGameSetting = (serverId: string) => {
    let gameNum = serverId.slice(1, serverId.length - 1);
    let subType = serverId.slice(serverId.length - 1);
    let game = getGameById(gameNum);
    return { ...game, subType };
};

export { apiPort, dbUrl, getLobbyUrl, getGameByName, getGameSetting, getGameById };
