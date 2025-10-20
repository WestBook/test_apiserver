import { ModelBase } from '../base/modelBase';
import { ObjectId } from 'mongodb';
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

    public async createRoomSetting(data: any) {
        return await this.insertData(data);
    }

    public async deleteRoomSetting(id: string) {
        return await this.deleteData({ _id: new ObjectId(id) });
    }

    public async updateRoomSetting(id: string, data: any) {
        return await this.updateData({ _id: new ObjectId(id) }, data);
    }
}
