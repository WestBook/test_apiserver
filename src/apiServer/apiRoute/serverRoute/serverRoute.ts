import { NextFunction, Response, Request } from 'express';
import { RouteBase } from '../../../base/routeBase';
import { ServerController } from './serverController';
import { ServerService } from './serverService';
export class ServerRoute extends RouteBase {
    private serverController: ServerController;
    public async init() {
        let service = new ServerService();
        await service.init();
        this.serverController = new ServerController(service);
        this.registerRoute();
    }

    protected registerRoute(): void {
        // 取得大廳遊戲列表
        this.Router.post('/types.do', (req: Request, res: Response, next: NextFunction) => {
            this.serverController.getTypes(req, res, next);
        });

        // 更新大廳遊戲排序
        this.Router.post('/updateTypes.do', (req: Request, res: Response, next?: NextFunction) => {
            this.serverController.updateTypes(req, res, next);
        });

        // 首次進遊戲帳號進底分房間提示
        this.Router.post('/check.do', (req: Request, res: Response, next: NextFunction) => {
            this.serverController.getCheckData(req, res, next);
        });

        // list.do
        this.Router.post('/list.do', (req: Request, res: Response, next: NextFunction) => {
            this.serverController.getListData(req, res, next);
        });
    }
}
