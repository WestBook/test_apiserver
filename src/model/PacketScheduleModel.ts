import { ModelBase } from '../base/modelBase';
import { MockerJsonData } from '../common/type';
import { getGameByName } from '../common/setting';
export class PacketScheduleModel extends ModelBase {
    protected getCollectionName(): string {
        return 'PacketScheduleData';
    }

    public async getMockDatas() {
        let mockDatas = await this.findAllData();
        let datas: MockerJsonData[] = [];
        for (let index = 0; index < mockDatas.length; index++) {
            let { data } = mockDatas[index];
            datas.push(data);
        }
        return datas;
    }

    public async getMockData(uid: string) {
        return await this.findAllData({ uid });
    }

    public async getApplyMockData(uid: string) {
        let mockDatas = await this.findAllData({ uid, apply: true });
        let datas: MockerJsonData[] = [];
        for (let index = 0; index < mockDatas.length; index++) {
            let { jsonData } = mockDatas[index];
            datas.push(jsonData);
        }
        return datas;
    }

    public async getScheduleGameList(uid?: string) {
        let dbList = await this.getDBList();
        let scheduleGameList = dbList.map(item => {
            let gameObj = getGameByName(item);
            if(!gameObj) { return {} }
            const { CH, gameId } = gameObj;
            return {
                name: CH,
                id: gameId
            }  
        });
        return scheduleGameList;
    }
   
    public async deleteMockData(uid: string, title: string) {
        return await this.deleteData({ uid ,title});
    }

    public async updateMockData(uid: string, title: string, jsonData: any) {
        return await this.updateData({uid,title},{ uid ,title, jsonData});
    }

    public async createMockData(uid: string, title: string,apply:boolean, jsonData: any) {
        return await this.insertData({ uid ,title,apply,jsonData});
    }
}