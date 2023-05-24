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
        let reqServerId = 5000 + type * 10;
        let accountData: any = await this.service.getUserData(uid);
        let { inGame, serverId: userServerId } = accountData;
        // slot game要把serverid上的roomid改為1,game server再用sub判斷在哪間房
        let roomId = type in slotGameType ? 1 : sub;
        reqServerId += roomId;
        // 已在其他遊戲房中
        if (inGame && reqServerId !== userServerId) {
            let info = {
                serverId: userServerId,
                serverType: parseInt(userServerId.toString().substring(1, 3)),
                subType: userServerId % 10,
            };
            res.send({ serverResp: { info }, code: 0 });
        } else {
            let data = await this.service.getRoomSetting(reqServerId, sub);
            res.send({ serverResp: { servers: [data] }, code: 0 });
        }
    }
}
