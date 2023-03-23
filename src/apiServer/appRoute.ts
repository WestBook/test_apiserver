import { ApiRoute } from './apiRoute/apiRoute';
import { RouteBase } from '../base/routeBase';
export class AppRoute extends RouteBase {
    private apiRoute: ApiRoute = new ApiRoute();

    public async init(): Promise<void> {
        await this.apiRoute.init();
        this.registerRoute();
    }

    protected registerRoute(): void {
        this.Router.use('/test/api', (req, res, next) => {
            next();
        });
        this.Router.use('/test/api', this.apiRoute.Router);

        this.Router.use('/api', (req, res, next) => {
            next();
        });
        this.Router.use('/api', this.apiRoute.Router);
    }
}
