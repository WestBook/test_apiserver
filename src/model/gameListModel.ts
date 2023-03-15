import { ModelBase } from '../base/modelBase';

export class GameListModel extends ModelBase {
    protected getCollectionName(): string {
        return 'GameList';
    }

    public async getPopularList() {
        return await this.findData({ type: 'popular' });
    }

    public async updatePopularList(dataList: Array<number>) {
        let query = { type: 'popular' };
        return await this.updateData(query, { popularList: dataList });
    }

    public async getNewGameList() {
        return await this.findData({ type: 'newGame' });
    }

    public async updateNewGameList(dataList: Array<number>) {
        let query = { type: 'newGame' };
        return await this.updateData(query, { newGameList: dataList });
    }
}
