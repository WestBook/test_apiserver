import { NextFunction, Response, Request } from 'express';
import { RouteBase } from '../../base/routeBase';
import { APIController } from './apiController';
import { APIService } from './apiService';
import { ServerRoute } from './serverRoute/serverRoute';
import { GameRoute } from './gameRoute/gameRoute';
export class ApiRoute extends RouteBase {
    private controller: APIController;
    //子模組
    private serverRoute: ServerRoute;
    private gameRoute: GameRoute;

    public async init() {
        let servcie = new APIService();
        await servcie.init();
        this.controller = new APIController(servcie);
        //子模組
        this.serverRoute = new ServerRoute();
        await this.serverRoute.init();
        this.gameRoute = new GameRoute();
        await this.gameRoute.init();

        this.registerRoute();
    }

    protected registerRoute(): void {
        this.Router.use('/server', (req, res, next) => {
            //log([req.url, req.body]);
            console.log(req.url, req.body);
            next();
        });
        this.Router.use('/server', this.serverRoute.Router);

        this.Router.use('/game', (req, res, next) => {
            //log([req.url, req.body]);
            console.log(req.url, req.body);
            next();
        });
        this.Router.use('/game', this.gameRoute.Router);

        this.Router.post('/account/getBalance.do', (req: Request, res: Response, next: NextFunction) => {
            this.controller.getBalance(req, res, next);
        });

        // 取得玩家資訊
        this.Router.post('/account/get/info.do', async (req: Request, res: Response, next: NextFunction) => {
            const { token } = req.headers;
            try {
                await this.tokenCheck(token as string, res);
                this.controller.getUserData(req, res, next);
            } catch (err) {
                console.log('token fail', err);
            }
        });

        this.Router.post('/account/create.do', async (req: Request, res: Response, next: NextFunction) => {
            this.controller.createUser(req, res, next);
        });

        this.Router.post('/account/login.do', async (req: Request, res: Response, next: NextFunction) => {
            this.controller.userLogin(req, res, next);
        });

        this.Router.post('/account/transfer.do', (req: Request, res: Response, next: NextFunction) => {
            this.controller.transferBalance(req, res, next);
        });

        // notice/announce/list.do
        this.Router.post('/notice/announce/list.do', (req: Request, res: Response, next: NextFunction) => {
            this.controller.getNoticeData(req, res, next);
        });

        // Banner 列表
        this.Router.post('/banner/list.do', (req: Request, res: Response, next: NextFunction) => {
            this.controller.getBannerData(req, res, next);
        });

        // 遊戲服務器(websocket) 位置
        this.Router.post('/setting/game.do', (req: Request, res: Response, next: NextFunction) => {
            this.controller.getSettingData(req, res, next);
        });

        this.Router.get('/db/list', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.getGameDBList(res);
        });

        this.Router.get('/mock/schedule/:uid', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.getScheduleGameList(req, res);
        });

        this.Router.get('/mock/schedule/:uid/:gameId', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.getScheduleData(req, res, false);
        });

        this.Router.get('/mock/applyschedule/:uid/:gameId', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.getScheduleData(req, res, true);
        });

        this.Router.get('/mock/gameList', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.getGameList(req, res);
        });

        this.Router.post('/mock/schedule/:uid/:gameId', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.createScheduleData(req, res);
        });

        this.Router.delete('/mock/schedule/:uid/:gameId/:title', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.deleteScheduleData(req, res);
        });

        this.Router.put('/mock/schedule/:uid/:gameId/:title', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.updateScheduleData(req, res);
        });

        this.Router.put(
            '/mock/schedule/apply/:uid/:gameId/:title',
            (req: Request, res: Response, next?: NextFunction) => {
                this.controller.applyScheduleData(req, res);
            }
        );

        this.Router.post('/db/create', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.createDB(req, res);
        });
        this.Router.post('/db/creategame', (req: Request, res: Response, next?: NextFunction) => {
            this.controller.createGame(req, res);
        });
    }
}
