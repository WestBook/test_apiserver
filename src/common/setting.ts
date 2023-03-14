const isDev = process.env.NODE_ENV === 'develop';
const wsHost = isDev ? '127.0.0.1' : '192.168.1.158';
const wsPort = isDev ? '27017' : '23456';
const dbUrl = `mongodb://${wsHost}:${wsPort}`;
const apiPort = 8087;
const getLobbyUrl = (hostname: string) => {
    return isDev ? `http://${hostname}:8081` : 'http://192.168.1.158/lobby';
};

class GameList {
    public static gameList = [];

    public static getGameByName = (name: string) => {
        return GameList.gameList.find((item) => item.name === name);
    };

    public static getGameById = (id: string) => {
        return GameList.gameList.find((item) => item.gameId === id);
    };

    public static getGameSetting = (serverId: string) => {
        let gameNum = serverId.slice(1, serverId.length - 1);
        let subType = serverId.slice(serverId.length - 1);
        let game = GameList.getGameById(gameNum);
        return { ...game, subType };
    };
}

export { GameList, apiPort, dbUrl, getLobbyUrl };
