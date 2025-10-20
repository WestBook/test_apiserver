import { ModelBase } from '../base/modelBase';

export class VideoRoomInfoModel extends ModelBase {
    protected getCollectionName(): string {
        return 'RoomInfo';
    }

    public async getRoomInfo(roomId:string) {

        let allRoomInfo = await this.findData();
        if(allRoomInfo == undefined || allRoomInfo[roomId] == undefined)
            return {};

        return allRoomInfo[roomId];
    }
}
