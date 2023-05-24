import { Router, Response } from 'express';
import { VerifyToken } from '../common/token';
export abstract class RouteBase {
    public _router: Router = Router();
    public get Router(): Router {
        return this._router;
    }

    protected abstract registerRoute(): void;

    protected async tokenCheck(token: string, res: Response) {
        let result = await VerifyToken(token);
        if (!result) {
            res.send({ code: -201, msg: 'token過期或錯誤' });
            return Promise.reject();
        }
        return Promise.resolve();
    }
}
