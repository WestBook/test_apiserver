import { dbUrl } from '../../common/setting';
import { SettingModel } from '../../model/settingModel';
import { UsersModel } from '../../model/usersModel';
import { PacketScheduleModel } from '../../model/PacketScheduleModel';
import { MongoClient } from 'mongodb';
import { TypesModel } from '../../model/typesModel';
import { GameInfoModel } from '../../model/gameInfoModel';

export class APIService {
    private userModel: UsersModel;
    private settingModel: SettingModel;
    private packetScheduleModel: PacketScheduleModel;
    private typesModel: TypesModel;
    private gameInfoModel: GameInfoModel;
    public async init() {
        let url = dbUrl;
        this.userModel = new UsersModel();
        this.settingModel = new SettingModel();
        this.packetScheduleModel = new PacketScheduleModel();
        this.gameInfoModel = new GameInfoModel();
        this.typesModel = new TypesModel();
        await this.typesModel.init(dbUrl, 'API');
        await this.userModel.init(dbUrl, 'API');
        await this.settingModel.init(dbUrl, 'API');
        await this.gameInfoModel.init(dbUrl, 'API');
        await this.packetScheduleModel.init(dbUrl);
    }

    public async getTypesData() {
        let data: any = await this.typesModel.getTypesData();
        if (data == null) {
            return null;
        }
        let { _id, gameType, type } = data;
        return { _id, gameType, type };
    }

    private async updateTypesData(id, data) {
        return await this.typesModel.updateData({ _id: id }, { $set: data });
    }

    public async getGameDBList(): Promise<Array<string>> {
        let client = new MongoClient(dbUrl);
        let db = (await client.connect()).db();
        let allDb = (await db.admin().listDatabases({ nameOnly: true })).databases;
        let gameDbList = allDb
            ?.map((db) => db.name)
            .filter((db) => db !== 'API' && db != 'admin' && db != 'local' && db != 'config');
        console.log('dbList:', gameDbList);
        return gameDbList;
    }

    public async getDB(gameName: string) {
        const client = new MongoClient(dbUrl);
        return (await client.connect()).db(gameName);
    }

    public async createDB(gameName: string) {
        const client = new MongoClient(`${dbUrl}/${gameName}`);
        let db = (await client.connect()).db();
        await db.createCollection('PacketScheduleData');
        await db.createCollection('Room');
        await db.createCollection('RoomSetting');
        return db;
    }

    public async getDefaultUserData(account, pwd) {
        let defaultUserId = await this.userModel.createUserID();
        let defaultAgentId = await this.userModel.createAgentUserID();
        return {
            account,
            userId: defaultUserId,
            pwd,
            score: 0,
            frameId: 1,
            iconId: 1,
            vip: 1,
            lv: 1,
            scoreDelta: 0,
            agentUserId: defaultAgentId,
            nameChanged: 0,
            needVersion: 1001000,
            nickName: account,
            userAddress: '台北',
            inGame: 0,
            collectList: [],
        };
    }

    public async updateBalance(account: string, balance: number) {
        let user = await this.userModel.getUserDataByAccount(account);
        user.score = Math.round(user.score + balance * 100);
        await this.userModel.updateData({ account }, user);
        return user;
    }

    public async createUser(user) {
        return await this.userModel.insertData(user);
    }

    public async updateGame(gameName, gameType, roomSetting) {
        let db = await this.getDB(gameName);
        let gameCollection = db.collection('RoomSetting');

        if (gameType === 'Bet') {
            return await this.updateBetGame(gameCollection, roomSetting);
        } else if (gameType === 'Qz') {
            return await this.updateQzGame(gameCollection, roomSetting);
        } else {
            return;
        }
    }

    public async createGameType(gameNo: number) {
        let typeData = await this.getTypesData();
        const { _id, type } = typeData;
        type.push(gameNo);
        return await this.updateTypesData(_id, typeData);
    }

    private async updateBetGame(collection, roomSetting: Array<any>) {
        return roomSetting.map(async (item, index) => {
            const { serverId, betLimit, areaLimitScore, chipsConfig } = item;
            let data = {
                lessScore: Number(betLimit),
                maxGold: 0,
                minGold: 0,
                areaLimitScore,
                serverID: Number(serverId),
                chipsConfig,
                subType: index + 1,
            };
            try {
                return await collection.updateOne({ serverID: Number(serverId) }, { $set: data });
            } catch (e) {
                console.log(JSON.stringify(e));
                return;
            }
        });
    }

    private async updateQzGame(collection, roomSetting: Array<any>) {
        return roomSetting.map(async (item, index) => {
            const { serverId, betLimit, grab, multi } = item;
            let data = {
                lessScore: betLimit,
                maxGold: 0,
                minGold: 0,
                grab,
                multi,
                serverID: serverId,
                subType: index + 1,
            };
            await collection.updateOne({ serverID: serverId }, { $set: data });
        });
    }

    public async createRoomSetting(gameName, gameType, setting: Array<any>) {
        let db = await this.createDB(gameName);
        let collection = await db.collection('RoomSetting');

        let roomSetting = gameType === 'Bet' ? this.createBetSetting(setting) : this.createQzSetting(setting);
        return await collection.insertMany(roomSetting);
    }

    private createBetSetting(setting: Array<any>) {
        return setting.map((item, index) => {
            const { serverId, betLimit, areaLimitScore, chipsConfig } = item;
            return {
                lessScore: betLimit,
                maxGold: 0,
                minGold: 0,
                areaLimitScore,
                serverID: serverId,
                chipsConfig,
                subType: index + 1,
            };
        });
    }

    private createQzSetting(setting: Array<any>) {
        return setting.map((item, index) => {
            const { serverId, betLimit, grab, multi } = item;
            return {
                lessScore: betLimit,
                maxGold: 0,
                minGold: 0,
                grab,
                multi,
                serverID: serverId,
                subType: index + 1,
            };
        });
    }

    public async getUserData(uid: string) {
        let data: any = await this.userModel.getUserData(uid);
        if (data == null) {
            return null;
        }
        let { frameId, iconId, needVersion, agentUserId, vip, nameChanged, nickName, score } = data;
        return {
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

    public async getUserDataByAccount(account) {
        return await this.userModel.getUserDataByAccount(account);
    }

    public async getBannerData() {
        return {
            banner: [
                {
                    bottomImagePath: '',
                    bottomImageVersion: 0,
                    imageDomain: '/test/api',
                },
                {
                    bottomImagePath: '',
                    bottomImageVersion: 1,
                    imageDomain: '/test/api',
                },
                {
                    bottomImagePath: '',
                    bottomImageVersion: 2,
                    imageDomain: '/test/api',
                },
            ],
        };
    }

    public async getNoticeData() {
        return {};
    }

    public async getSettingData() {
        let data = await this.settingModel.getGameSetting();
        if (data == null) {
            return null;
        }
        let { vals } = data;
        return { vals };
    }

    public async createMockData(gameId: string, uid: string, title: string, jsonData: any) {
        //切到對應的DB
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            jsonData = JSON.parse(jsonData);
            let apply = false;
            return await this.packetScheduleModel.createMockData(uid, title, apply, jsonData);
        }
    }

    public async updateMockData(gameId: string, uid: string, title: string, jsonData: any) {
        //切到對應的DB
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            jsonData = JSON.parse(jsonData);
            return await this.packetScheduleModel.updateMockData(uid, title, jsonData);
        }
    }

    public async applyScheduleData(gameId: string, uid: string, title: string) {
        //切到對應的DB
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            await this.packetScheduleModel.updateData({ uid, apply: true }, { apply: false });
            return await this.packetScheduleModel.updateData({ uid, title }, { apply: true });
        }
    }

    public async getScheduleGameList(uid: string) {
        let allGameInfo = await this.gameInfoModel.getAllGameInfo();
        let scheduleGameInfo = allGameInfo.map((item) => {
            return {
                name: item.CH,
                id: item.gameId,
            };
        });
        return scheduleGameInfo;
    }

    public async getGamesInfo(serverId: string): Promise<Object> {
        return await this.gameInfoModel.getGameInfoByServerId(serverId);
    }

    public async getScheduleData(gameId: string, uid: string) {
        //切到對應的DB
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            return await this.packetScheduleModel.getMockData(uid);
        }
    }

    public async getApplyScheduleData(gameId: string, uid: string) {
        //切到對應的DB
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            return await this.packetScheduleModel.getApplyMockData(uid);
        }
    }

    public async deleteScheduleData(gameId: string, uid: string, title: string) {
        let gameName = await this.getGameName(gameId);
        if (gameName.length > 0) {
            this.packetScheduleModel.setupDB(gameName);
            return await this.packetScheduleModel.deleteMockData(uid, title);
        }
    }

    private async getGameName(gameId: string) {
        let { name } = await this.gameInfoModel.getGameInfoByGameId(gameId);
        return name;
    }
}
