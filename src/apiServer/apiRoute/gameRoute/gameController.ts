import { NextFunction, Response, Request } from 'express';
import { ControllerBase } from '../../../base/controllerBase';
import { GameService } from './gameService';
import { CreateToken, tokenParse } from '../../../common/token';
import { getLobbyUrl } from '../../../common/setting';

export class GameController extends ControllerBase<GameService> {
    private uidCheck(uid: string, res) {
        if (!uid) {
            res.send({ code: -1, msg: '無此userId或userId有誤' });
            return false;
        } else {
            return true;
        }
    }

    public async getPopularList(token: string, res: Response) {
        let uid = tokenParse(token);
        let userData = await this.service.getUserData(uid);
        const { inGame } = userData;
        let popularList = await this.service.getPopularList();
        if (popularList) {
            res.send({
                code: 0,
                gamesListResp: {
                    currentGameType: inGame ? inGame : 0,
                    sortedTypeList: popularList,
                },
            });
        }
    }

    public async updatePopularList(req: Request, res: Response, next: NextFunction) {
        const { list } = req.body;
        try {
            await this.service.updatePopularList(list);
            console.log('火熱排序更新成功');
            res.send({ code: 0, msg: '火熱排序更新成功' });
        } catch (error) {
            console.log('updatePopularList fail: ', error.toString());
            res.send({ code: -1, msg: '火熱排序更新失敗' });
        }
    }

    public async getNewGamesList(res: Response) {
        let newGameList = await this.service.getNewGamesList();
        if (newGameList) {
            res.send({
                code: 0,
                gamesListResp: {
                    sortedTypeList: newGameList,
                },
            });
        }
    }

    public async updateNewGameList(req: Request, res: Response, next: NextFunction) {
        const { list } = req.body;
        try {
            await this.service.updateNewGameList(list);
            console.log('新遊推薦更新成功');
            res.send({ code: 0, msg: '新遊推薦更新成功' });
        } catch (error) {
            console.log('updateNewGameList fail', error.toString());
            res.send({ code: -1, msg: '新遊推薦更新失敗' });
        }
    }

    public async getCollectList(token: string, res: Response) {
        const uid = tokenParse(token);
        const isUidCheck = this.uidCheck(uid, res);
        if (isUidCheck) {
            try {
                let data = await this.service.getUserData(uid);
                const { collectList, inGame } = data;
                res.send({
                    code: 0,
                    msg: '取得收藏列表成功',
                    collectGamesListResp: {
                        currentGameType: inGame ? inGame : 0,
                        infos: collectList ? collectList : [],
                    },
                });
            } catch (error) {
                res.send({ code: -1, msg: error });
            }
        }
    }

    public async setCollect(token: string, res: Response) {
        const uid = tokenParse(token);
        const isUidCheck = this.uidCheck(uid, res);
        if (isUidCheck) {
            try {
                const isCancel = await this.service.collectGame(uid);
                res.send({ code: 0, msg: `${isCancel ? '取消收藏' : '收藏'}成功` });
            } catch (error) {
                res.send({ code: -1, msg: error });
            }
        }
    }

    public async forwardSite(req: Request, res: Response, next: NextFunction) {
        const { account, gameType } = req.body;
        try {
            let accountData = await this.service.getUserDataByAccount(account);
            const { userId } = accountData;
            const token = CreateToken(userId);
            const typeString = Number(gameType) === 0 ? '' : `&game=${gameType}`;
            const forwardURL = getLobbyUrl(req.hostname) + `/?uid=${userId}&token=${token}${typeString}`;
            console.log('forwardURL: ', forwardURL);
            res.send({ code: 0, data: forwardURL });
        } catch (error) {
            res.send({ code: -1, msg: error });
        }
        return;
    }

    public async updateUserScore(req: Request, res: Response, next: NextFunction) {
        const { uid, score } = req.body;
        try {
            await this.service.updateUserScore(uid, score);
            res.send({ code: 0, msg: `${uid} update score success` });
        } catch (error) {
            console.log('get user data fail.', error);
            res.send({ code: -1, msg: error });
        }
    }

    public async getUserData(req: Request, res: Response, next: NextFunction) {
        const { uid } = req.params;
        try {
            let userData = await this.service.getUserData(uid);
            if (!userData) {
                res.send({ code: -1, msg: `${uid} no user data` });
            } else {
                const { userId, score, frameId, iconId, vip, lv, scoreDelta } = userData;
                res.send({ code: 0, data: { userId, score, frameId, iconId, vip, lv, scoreDelta } });
            }
        } catch (error) {
            console.log('get user data fail.', error);
            res.send({ code: -1, msg: error });
        }
    }
}
