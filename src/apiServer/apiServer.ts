import express from 'express';
import { AppRoute } from './appRoute';
import cors from 'cors';
export class ApiServer {
    private app = express();
    private appRoute = new AppRoute();
    public constructor() {
        this.app.use(cors());
        //這個可以改在個別的router需要使用的地方在套用
        this.app.use(express.json());
        this.app.use('/', this.appRoute.Router);
    }

    public start(port: number, onSuccess: Function = () => {}) {
        this.app.listen(port, async () => {
            await this.appRoute.init();
            console.log(`api server is running at port ${port}.`);
            onSuccess();
        });
    }
}
