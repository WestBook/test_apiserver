import { NextFunction, Response, Request } from 'express';
import { ControllerBase } from '../../../base/controllerBase';
import { ServerService } from './serverService';

export class ServerController extends ControllerBase<ServerService> {
    public async getTypes(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getTypesData();
        let resData = {
            serverTypeResp: data,
            code: 0
        };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getCheckData(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getCheckData();
        let resData = {
            checkRes: data,
            code: 0
        };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getListData(req: Request, res: Response, next: NextFunction) {
        let { uid } = req.body;
        let { type, sub } = req.body.serverReq;
        let serverId = 5000 + type * 10 + sub;
        let accountData: any = await this.service.getUserData(uid);
        let { inGame } = accountData;
        // 已在遊戲中，返回該遊戲server資訊
        if (inGame) {
            res.send({ serverResp: { info: inGame }, code: 0 });
        } else {
            let data = await this.service.getRoomSetting(serverId, sub);
            res.send({ serverResp: { servers: [data] }, code: 0 });
        }
    }
}