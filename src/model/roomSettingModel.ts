import { ModelBase } from '../base/modelBase';

export class RoomSettingModel extends ModelBase {
    protected getCollectionName(): string {
        return 'RoomSetting';
    }

    public async getRoomSetting(serverID: number, subType: number) {
        return await this.findData({ subType, serverID });
    }

    public async getAllRoomSetting() {
        return await this.findAllData();
    }
}
