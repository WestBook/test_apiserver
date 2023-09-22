import { NextFunction, Response, Request } from 'express';
import { RouteBase } from '../../../base/routeBase';
import { GameController } from './gameController';
import { GameService } from './gameService';

export class GameRoute extends RouteBase {
    private gameController: GameController;
    public async init() {
        let service = new GameService();
        await service.init();
        this.gameController = new GameController(service);
        this.registerRoute();
    }
    protected registerRoute(): void {
        // 取得火熱排序
        this.Router.post('/popularGamesList.do', async (req: Request, res: Response, next?: NextFunction) => {
            const { token } = req.headers;
            try {
                await this.tokenCheck(token as string, res);
                this.gameController.getPopularList(token as string, res);
            } catch (error) {
                console.log('token failed', error);
            }
        });

        // 更新火熱排序
        this.Router.post('/updatePopularList.do', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.updatePopularList(req, res, next);
        });
        // 取得新遊推薦排序
        this.Router.post('/newGamesList.do', async (req: Request, res: Response, next?: NextFunction) => {
            const { token } = req.headers;
            try {
                await this.tokenCheck(token as string, res);
                this.gameController.getNewGamesList(res);
            } catch (error) {
                console.log('token failed', error);
            }
        });
        // 更新新遊推薦
        this.Router.post('/updateNewGameList.do', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.updateNewGameList(req, res, next);
        });

        // 取得收藏列表
        this.Router.post('/collectList.do', async (req: Request, res: Response, next?: NextFunction) => {
            const { token } = req.headers;
            try {
                await this.tokenCheck(token as string, res);
                this.gameController.getCollectList(token as string, res);
            } catch (error) {
                console.log('token failed', error);
            }
        });
        // 遊戲收藏
        this.Router.post('/collect.do', async (req: Request, res: Response, next?: NextFunction) => {
            const { token } = req.headers;
            try {
                await this.tokenCheck(token as string, res);
                this.gameController.setCollect(token as string, res);
            } catch (error) {
                console.log('token failed: ', error);
            }
        });

        // 跳轉
        this.Router.post('/forward.do', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.forwardSite(req, res, next);
        });

        this.Router.post('/updateUserScore.do', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.updateUserScore(req, res, next);
        });

        this.Router.get('/getUserData/:uid', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.getUserData(req, res, next);
        });

        // 遊戲資訊
        this.Router.get('/getAllRoomSetting/:gameName', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.getAllRoomSetting(req, res, next);
        });

        this.Router.get('/getGameID/:gameName', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.getGameID(req, res, next);
        });

        this.Router.get('/getVideoRoomInfo/:roomId', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.getVideoRoomInfo(req, res, next);
        });

        this.Router.post('/roomSetting/:gameName', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.createRoomSetting(req, res, next);
        });

        this.Router.put('/roomSetting/:gameName/:id', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.updateRoomSetting(req, res, next);
        });

        this.Router.delete('/roomSetting/:gameName/:id', (req: Request, res: Response, next?: NextFunction) => {
            this.gameController.deleteRoomSetting(req, res, next);
        });
    }
}
