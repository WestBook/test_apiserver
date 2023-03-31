import { ModelBase } from '../base/modelBase';

export class GameInfoModel extends ModelBase {
    protected getCollectionName(): string {
        return 'GameInfo';
    }

    public async getGameInfoByServerId(serverId: string) {
        let gameId = serverId.slice(1, serverId.length - 1);
        let subType = serverId.slice(serverId.length - 1);
        let rawGameInfo = await this.findData({ gameId: Number(gameId).toString() });
        return { name: rawGameInfo.name, subType: subType };
    }

    public async getGameInfoByGameId(gameId: string) {
        let rawGameInfo = await this.findData({ gameId: gameId.toString() });
        return { name: rawGameInfo.name };
    }

    public async getAllGameInfo() {
        return await this.findAllData();
    }

    public async getGameIdByGameName(gameName: string) {
        let gameInfo = await this.findData({ name: gameName });
        return gameInfo.gameId;
    }
}
