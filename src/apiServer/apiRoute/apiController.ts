import { NextFunction, Response, Request } from 'express';
import { ControllerBase } from '../../base/controllerBase';
import { APIService } from './apiService';
import { CreateToken } from '../../common/token';
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

    public async gameExistCheck(gameName: string) {
        let dbList = await this.service.getGameDBList();
        return dbList.indexOf(gameName) != -1;
    }

    public async typeExistCheck(gameNo: number) {
        let typeData = await this.service.getTypesData();
        const { type } = typeData;
        return type.indexOf(gameNo) != -1;
    }

    public async createGame(req: Request, res: Response) {
        let { gameName, chName, gameNo, setting } = req.body;
        console.log(setting);
        let isGameExist = await this.gameExistCheck(gameName);
        let isTypeExist = await this.typeExistCheck(gameNo);
        let resData = { data: {}, code: 0 };
        if (isGameExist || isTypeExist) {
            console.log(`遊戲名稱or編號已使用`);
            res.send({
                code: -1,
                msg: '遊戲名稱or編號已使用',
            });
        } else {
            console.log('createGame');
            // 儲存遊戲編號
            await this.service.createGameType(gameNo);
            await this.service.createGameInfo({
                name: gameName,
                CH: chName,
                gameId: gameNo.toString(),
            });
            // 儲存遊戲資料
            await this.service.createRoomSetting(gameName, setting);
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

    public async getGameInfoList(req: Request, res: Response) {
        let resData = { code: 0, data: [] };
        try {
            let data = await this.service.getAllGameInfo();
            resData.data = data;
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

    public async getAccountInfo(user) {
        const { nickName, score, userId, account, inGame, role } = user;
        const { permission } = await this.service.getRoleByKey(role);
        let token = CreateToken(userId);
        return {
            nickName,
            score,
            userId,
            account,
            status: inGame ? 1 : 0,
            token,
            permission,
        };
    }

    public async getAllUser(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.getAllUser();
        if (result == null) {
            console.error('[Error] no user data');
            res.send({ code: -1, error: 'no user data' });
        } else {
            const allUser = result.map((el) => {
                return {
                    account: el.account,
                    nickName: el.nickName,
                    role: el.role,
                };
            });
            res.send({ code: 0, data: allUser });
        }
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
                let info = await this.getAccountInfo(defaultUser);
                res.send({ code: 0, msg: '註冊成功', data: info });
            } else {
                res.send({ code: -1, msg: '註冊失敗' });
            }
        }
    }
    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        const { account } = req.body;
        let result = await this.service.deleteUser(account);
        if (result.deletedCount > 0) {
            res.send({ code: 0, msg: '已成功刪除帳號' });
        } else {
            res.send({ code: -1, msg: '刪除帳號失敗' });
        }
        if (next) {
            next();
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
            let info = await this.getAccountInfo(existUser);
            res.send({ code: 0, msg: '登入成功', data: { ...info, score: (info.score / 100).toFixed(2) } });
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
                    score: (score / 100).toFixed(2),
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
        const delta = Number(type) === 0 ? Math.round(Number(balance) * 100) : Math.round(Number(balance) * 100 * -1);
        const msgType = Number(type) === 0 ? '上分' : '下分';
        let updateUser = await this.service.updateBalance(account, delta);
        if (updateUser) {
            res.send({
                code: 0,
                msg: `${msgType}成功`,
                data: {
                    score: (updateUser.score / 100).toFixed(2),
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
    public async getAllRole(req: Request, res: Response, next: NextFunction) {
        let result = await this.service.getAllRole();
        if (result == null) {
            console.error('[Error] no role data');
            res.send({ code: -1, error: 'no role data' });
        } else {
            const allRole = result.map((el) => {
                const { _id, ...rest } = el;
                return {
                    ...rest,
                };
            });
            res.send({ code: 0, data: allRole });
        }
        if (next) {
            next();
        }
    }

    public async updateUserRole(req: Request, res: Response, next: NextFunction) {
        const { account, role } = req.body;
        let result = await this.service.updateUserRole(account, role);
        if (result.modifiedCount == 0) {
            console.error('update failed');
            res.send({ code: -1, msg: '變更權限失敗', error: 'update failed' });
        } else {
            res.send({ code: 0, msg: '已成功更新權限' });
        }
        if (next) {
            next();
        }
    }

    public async updateRoleData(req: Request, res: Response, next: NextFunction) {
        const { key, data } = req.body;
        let result = await this.service.updateRoleData(key, data);
        if (result.modifiedCount == 0) {
            res.send({ code: -1, msg: '變更權限失敗', error: 'update failed' });
        } else {
            res.send({ code: 0, msg: '已成功更新權限' });
        }
        if (next) {
            next();
        }
    }
    public async createRole(req: Request, res: Response, next: NextFunction) {
        const { key, title } = req.body;

        let existRole = await this.service.getRoleByKey(key);
        if (existRole) {
            res.send({ code: -1, msg: 'key值已存在' });
        } else {
            const roleData = await this.service.getDefaultRoleData(key, title);
            let result = await this.service.createRole(roleData);
            if (!result.acknowledged) {
                res.send({ code: -1, msg: '新增權限群組失敗' });
            } else {
                let insertRole = await this.service.getRoleById(result.insertedId);
                const { _id, ...rest } = insertRole;
                res.send({ code: 0, msg: '新增權限群組成功', data: { insertData: rest } });
            }
            if (next) {
                next();
            }
        }
    }
    public async deleteRole(req: Request, res: Response, next: NextFunction) {
        const { key } = req.body;
        //刪除權限群組時，先檢查是否有成員為該群組
        let users = await this.service.getAllUserByRole(key);
        if (users.length > 0) {
            res.send({ code: -2, msg: '刪除權限群組失敗，有成員為該群組成員' });
        } else {
            let deleteResult = await this.service.deleteRole(key);
            if (deleteResult.deletedCount > 0) {
                res.send({ code: 0, msg: '已成功刪除權限群組' });
            } else {
                res.send({ code: -1, msg: '刪除權限群組失敗', error: 'update failed' });
            }
            if (next) {
                next();
            }
        }
    }

    public async updateUserSeverId(req: Request, res: Response, next: NextFunction) {
        const { uid, serverId } = req.body;
        try {
            await this.service.updateUserGame(uid, parseInt(serverId));
            res.send({ code: 0, msg: `${uid} update serverId success` });
        } catch (error) {
            console.log('get user data fail.', error);
            res.send({ code: -1, msg: error });
        }
    }
}
