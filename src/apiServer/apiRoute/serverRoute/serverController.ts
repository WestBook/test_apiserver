import { NextFunction, Response, Request } from 'express';
import { ControllerBase } from '../../../base/controllerBase';
import { ServerService } from './serverService';
import { slotGameType } from '../../../common/setting';

export class ServerController extends ControllerBase<ServerService> {
    public async getTypes(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getTypesData();
        let resData = {
            serverTypeResp: data,
            code: 0,
        };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async updateTypes(req: Request, res: Response, next: NextFunction) {
        const { list } = req.body;
        try {
            let result = await this.service.updateTypes(list);
            console.log('大廳排序更新成功');
            res.send({ code: 0, msg: '大廳排序更新成功' });
        } catch (error) {
            console.log('updateTypes fail: ', error.toString());
            res.send({ code: -1, msg: '大廳排序更新失敗' });
        }
    }

    public async getCheckData(req: Request, res: Response, next: NextFunction) {
        let data = await this.service.getCheckData();
        let resData = {
            checkRes: data,
            code: 0,
        };
        if (data == null) {
            resData.code = -1;
        }
        res.send(resData);
    }

    public async getListData(req: Request, res: Response, next: NextFunction) {
        let { uid } = req.body;
        let { type, sub } = req.body.serverReq;
        let serverId = 5000 + type * 10;
        let accountData: any = await this.service.getUserData(uid);
        let { inGame } = accountData;
        // slot game要把serverid上的roomid改為1,game server再用sub判斷在哪間房
        let roomId = type in slotGameType ? 1 : sub;
        serverId += roomId;

        // 已在遊戲中，返回該遊戲server資訊
        if (inGame) {
            res.send({ serverResp: { info: inGame }, code: 0 });
        } else {
            let data = await this.service.getRoomSetting(serverId, sub);
            res.send({ serverResp: { servers: [data] }, code: 0 });
        }
    }
}
