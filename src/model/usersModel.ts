import { ModelBase } from '../base/modelBase';
import { Method } from '../common/method';
export class UsersModel extends ModelBase {
    protected getCollectionName(): string {
        return 'User';
    }

    public async getAllUser() {
        return await this.findAllData();
    }

    public async getUserData(uid: string) {
        return await this.findData({ userId: uid });
    }

    public async getUserDataByAccount(account: string) {
        return await this.findData({ account });
    }

    public async getAllUserByRole(role: string) {
        return await this.findAllData({ role });
    }

    public async updateUserScore(userId: string, score: string) {
        return await this.updateData({ userId }, { score });
    }

    public async updateUserServerId(userId: string, serverId: number) {
        return await this.updateData({ userId }, { serverId });
    }

    public async createAgentUserID() {
        let existList = await this.findAllData();
        let existIdList = existList.map((item) => item.agentUserId);
        let randomAgentId = existIdList[0];
        while (existIdList.indexOf(randomAgentId) != -1) {
            randomAgentId = Method.GetRandom(1, 9999);
        }
        return randomAgentId.toString();
    }

    public async createUserID() {
        let existList = await this.findAllData();
        let existIdList = existList.map((item) => item.userId);
        let randomUserId = existIdList[0];
        while (existIdList.indexOf(randomUserId) != -1) {
            randomUserId = Method.GetRandom(100000, 999999);
        }
        return randomUserId.toString();
    }

    public async updateCollect(uid, collectList) {
        return await this.updateData({ userId: uid }, { collectList });
    }
}
