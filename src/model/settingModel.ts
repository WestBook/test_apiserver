import { ModelBase } from '../base/modelBase';

export class SettingModel extends ModelBase {
    protected getCollectionName(): string {
        return 'Setting';
    }

    public async getGameSetting() {
        return await this.findData();
    }
}