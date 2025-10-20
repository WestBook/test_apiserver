export class ControllerBase<TService> {
    protected service: TService;
    public constructor(servcie: TService) {
        this.service = servcie;
    }
}