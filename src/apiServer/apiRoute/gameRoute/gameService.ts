import { dbUrl } from '../../../common/setting';
import { UsersModel } from '../../../model/usersModel';
import { GameListModel } from '../../../model/gameListModel';
import { GameInfoModel } from '../../../model/gameInfoModel';
import { RoomSettingModel } from '../../../model/roomSettingModel';

export class GameService {
    private userModel: UsersModel;
    private gameListModel: GameListModel;
    private gameInfoModel: GameInfoModel;
    private roomSettingModel: RoomSettingModel;
    public async init() {
        this.userModel = new UsersModel();
        this.gameListModel = new GameListModel();
        this.gameInfoModel = new GameInfoModel();
        this.roomSettingModel = new RoomSettingModel();
        await this.userModel.init(dbUrl, 'API');
        await this.gameListModel.init(dbUrl, 'API');
        await this.gameInfoModel.init(dbUrl, 'API');
    }

    public async getUserData(uid: string) {
        return await this.userModel.getUserData(uid);
    }

    public async getUserDataByAccount(account) {
        return await this.userModel.getUserDataByAccount(account);
    }

    public async getPopularList(): Promise<Array<number>> {
        let data = await this.gameListModel.getPopularList();
        const { popularList } = data;
        return popularList;
    }

    public async getNewGamesList(): Promise<Array<number>> {
        let data = await this.gameListModel.getNewGameList();
        const { newGameList } = data;
        return newGameList;
    }

    public async updatePopularList(list: Array<number>) {
        return await this.gameListModel.updatePopularList(list);
    }

    public async updateNewGameList(list: Array<number>) {
        return await this.gameListModel.updateNewGameList(list);
    }

    public async collectGame(uid: string): Promise<boolean> {
        const data = await this.getUserData(uid);
        const { collectList, inGame } = data;
        if (!inGame || inGame == 0) {
            return;
        }
        const isCollectedGame = collectList.find((item) => item.gameType === inGame);
        if (isCollectedGame) {
            const index = collectList.findIndex((item) => item.gameType === isCollectedGame);
            collectList.splice(index, 1);
            await this.userModel.updateCollect(uid, collectList);
            return true;
        } else {
            let collectObject = {
                collectTime: Date.now(),
                gameType: inGame,
            };
            collectList.push(collectObject);
            await this.userModel.updateCollect(uid, collectList);
            return false;
        }
    }

    public async updateUserScore(uid: string, score: string) {
        let userData = await this.getUserData(uid);
        userData.score = score;
        await this.userModel.updateUserScore(uid, score);
    }

    public async getAllRoomSetting(gameName: string) {
        await this.roomSettingModel.init(dbUrl, gameName);
        return await this.roomSettingModel.getAllRoomSetting();
    }

    public async getGameID(gameName: string) {
        let gameID = await this.gameInfoModel.getGameIdByGameName(gameName);
        return gameID;
    }
}
