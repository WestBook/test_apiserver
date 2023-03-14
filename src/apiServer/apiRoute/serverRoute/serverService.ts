import { dbUrl, GameList } from '../../../common/setting';
import { RoomSettingModel } from '../../../model/roomSettingModel';
import { TypesModel } from '../../../model/typesModel';
import { UsersModel } from '../../../model/usersModel';
import { Db } from 'mongodb';

export class ServerService {
    private userModel: UsersModel;
    private typesModel: TypesModel;
    private roomSettingModel: RoomSettingModel;
    private db: Db;
    public async init() {
        let url = dbUrl;
        this.userModel = new UsersModel();
        await this.userModel.init(url, 'API');
        this.typesModel = new TypesModel();
        await this.typesModel.init(url, 'API');
        this.roomSettingModel = new RoomSettingModel();
        await this.roomSettingModel.init(url);
    }

    public async getTypesData() {
        let data: any = await this.typesModel.getTypesData();
        if (data == null) {
            console.error('[Error] DB-api-Types collection is empty');
            return null;
        }
        let { gameType, type } = data;
        return { gameType, type };
    }

    public async getUserData(uid: string) {
        let data: any = await this.userModel.getUserData(uid);
        if (data == null) {
            return null;
        }
        let { frameId, userId, iconId, needVersion, agentUserId, vip, nameChanged, nickName, score } = data;
        return {
            userId,
            frame: frameId,
            icon: iconId,
            needVersion,
            agentUserId,
            vip,
            nameChanged,
            nickname: nickName,
            score,
        };
    }

    public async getCheckData() {
        return ['0, 500'];
    }

    public async getRoomSetting(serverId: number, sub: number) {
        let gameSetting = GameList.getGameSetting(serverId.toString());
        //更換DB
        this.roomSettingModel.setupDB(gameSetting.name);
        let setting = await this.roomSettingModel.getRoomSetting(serverId, sub);
        const { lessScore, maxGold, minGold, score, serverID, subType } = setting;
        return {
            lessScore,
            maxGold,
            minGold,
            score,
            serverID,
            subType,
        };
    }
}
