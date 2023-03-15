import { NextFunction, Response, Request } from 'express';
import { ControllerBase } from '../../base/controllerBase';
import { APIService } from './apiService';
export class APIController extends ControllerBase<APIService> {
    public async getGameDBList(res: Response) {
        let data = await this.service.getGameDBList();
        let resData = { data, code: 0 };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async createDB(req: Request, res: Response) {
        let { gameId, setting } = req.body;
        let resData = { code: 0, msg: 'success' };
        try {
            await this.service.createDB(gameId);
        } catch (error) {
            resData.code = -1;
            resData.msg = JSON.stringify(error);
        }
        res.send(resData);
    }

    public async gameExistCheck(gameId: string) {
        let dbList = await this.service.getGameDBList();
        return dbList.indexOf(gameId) != -1;
    }

    public async typeExistCheck(gameNo: number) {
        let typeData = await this.service.getTypesData();
        const { type } = typeData;
        return type.indexOf(gameNo) != -1;
    }

    public async createGame(req: Request, res: Response) {
        let { gameId, gameNo, gameType, roomSetting } = req.body;
        console.log(roomSetting);
        let isGameExist = await this.gameExistCheck(gameId);
        let isTypeExist = await this.typeExistCheck(gameNo);
        let resData = { data: {}, code: 0 };
        if (isGameExist) {
            console.log('updateGame');
            await this.service.updateGame(gameId, gameType, roomSetting);
            res.send(resData);
        } else if (isTypeExist) {
            console.log(`遊戲編號${gameNo}已使用`);
            res.send({
                code: -1,
                msg: '遊戲編號已使用',
            });
        } else {
            console.log('createGame');
            // 儲存遊戲編號
            await this.service.createGameType(gameNo);
            // 儲存遊戲資料
            await this.service.createRoomSetting(gameId, gameType, roomSetting);
            res.send(resData);
        }
    }

    public async updateScheduleData(req: Request, res: Response, next?: NextFunction) {
        let { gameId, uid, title } = req.params;
        let { jsonData } = req.body;
        let resData = { code: 0 };
        try {
            await this.service.updateMockData(gameId, uid, title, jsonData);
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async applyScheduleData(req: Request, res: Response, next?: NextFunction) {
        let { gameId, uid, title } = req.params;
        let resData = { code: 0 };
        try {
            await this.service.applyScheduleData(gameId, uid, title);
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getScheduleGameList(req: Request, res: Response, next?: NextFunction) {
        let resData = { code: 0, data: {} };
        let { uid } = req.params;
        try {
            resData.data = await this.service.getScheduleGameList(uid);
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getScheduleData(req: Request, res: Response, isApply: boolean, next?: NextFunction) {
        let resData = { code: 0, data: {} };
        let { gameId, uid } = req.params;
        try {
            if (isApply) {
                resData.data = await this.service.getApplyScheduleData(gameId, uid);
            } else {
                resData.data = await this.service.getScheduleData(gameId, uid);
            }
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getGameInfoByServerId(req: Request, res: Response) {
        let serverId = req.params.serverId;
        let resData = { code: 0, data: {} };
        try {
            resData.data = await this.service.getGamesInfo(serverId);
        } catch (err) {
            resData.code = -1;
        }
        return res.send(resData);
    }

    public async getApplyScheduleData(req: Request, res: Response, next?: NextFunction) {}

    public async deleteScheduleData(req: Request, res: Response, next?: NextFunction) {
        let resData = { code: 0 };
        let { gameId, uid, title } = req.params;
        try {
            await this.service.deleteScheduleData(gameId, uid, title);
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async createScheduleData(req: Request, res: Response, next?: NextFunction) {
        let { gameId, uid } = req.params;
        let { jsonData, title } = req.body;
        let resData = { code: 0 };
        try {
            await this.service.createMockData(gameId, uid, title, jsonData);
        } catch (err) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public getAccountInfo(user) {
        const { nickName, score, userId, account, inGame } = user;
        return {
            nickName,
            score,
            userId,
            account,
            status: inGame ? 1 : 0,
        };
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        const { account, pwd } = req.body;
        if (!account || !pwd) {
            res.send({ code: -1, msg: '請檢查帳號密碼' });
            return;
        }
        let existUser = await this.service.getUserDataByAccount(account);
        if (existUser) {
            res.send({ code: -1, msg: '已存在使用者' });
        } else {
            let defaultUser = await this.service.getDefaultUserData(account, pwd);
            let insertRes = await this.service.createUser(defaultUser);
            if (insertRes) {
                let info = this.getAccountInfo(defaultUser);
                res.send({ code: 0, msg: '註冊成功', data: info });
            } else {
                res.send({ code: -1, msg: '註冊失敗' });
            }
        }
    }

    public async userLogin(req: Request, res: Response, next: NextFunction) {
        const { account, pwd } = req.body;
        if (!account || !pwd) {
            res.send({ code: -1, msg: '請檢查帳號密碼' });
            return;
        }
        let existUser = await this.service.getUserDataByAccount(account);
        if (!existUser) {
            res.send({ code: -1, msg: '查無此帳號，請重新輸入或註冊新帳號' });
        } else if (pwd != existUser.pwd) {
            res.send({ code: -1, msg: '密碼錯誤，請重新輸入' });
        } else {
            let info = this.getAccountInfo(existUser);
            res.send({ code: 0, msg: '登入成功', data: info });
        }
    }

    public async getUserData(req: Request, res: Response, next: NextFunction) {
        const { uid } = req.body;
        let data = await this.service.getUserData(uid);
        let resData = { infoResp: data, code: 0 };
        if (data == null) {
            resData.code = -201;
        }

        if (next) {
            next();
        }
        res.send(resData);
    }

    public async getBalance(req: Request, res: Response, next: NextFunction) {
        const { account } = req.body;
        if (!account) {
            res.send({ code: -1, msg: '請檢查帳號' });
            return;
        }
        let data = await this.service.getUserDataByAccount(account);
        if (data) {
            const { score, inGame } = data;
            const status = inGame ? 1 : 0;
            res.send({
                code: 0,
                msg: '取得餘額成功',
                data: {
                    score,
                    status,
                },
            });
        } else {
            res.send({ code: 0, msg: '查無該帳號資料' });
        }
    }

    public async transferBalance(req: Request, res: Response, next: NextFunction) {
        const { account, type, balance } = req.body;
        if (!account || isNaN(balance)) {
            res.send({ code: -1, msg: '請檢查帳號或上下分數值是否有誤' });
            return;
        }
        const delta = Number(type) === 0 ? Number(balance) : -Number(balance);
        const msgType = Number(type) === 0 ? '上分' : '下分';
        let updateUser = await this.service.updateBalance(account, delta);
        if (updateUser) {
            res.send({
                code: 0,
                msg: `${msgType}成功`,
                data: {
                    score: updateUser.score / 100,
                },
            });
        } else {
            res.send({ code: -1, msg: `${msgType}失敗` });
        }
    }

    public async getBannerData(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getBannerData();
        let resData = { bannerListResp: data, code: 0 };
        if (data == null) {
            resData.code = -1;
        }
        if (next) {
            next();
        }
        res.send(resData);
    }

    public async getNoticeData(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getNoticeData();
        let resData = {
            annResp: data,
            code: 0,
        };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getSettingData(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getSettingData();
        if (data == null) {
            console.error('[Error] no setting data');
            res.send({ code: -1, error: 'no setting data' });
        } else {
            res.send({
                settingRes: data,
                code: 0,
            });
        }
        if (next) {
            next();
        }
    }
}
