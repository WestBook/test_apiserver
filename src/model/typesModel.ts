import { ModelBase } from '../base/modelBase';

export class TypesModel extends ModelBase {
    protected getCollectionName(): string {
        return 'Types';
    }

    public async getTypesData() {
        return await this.findData();
    }

    public async updateTypes(dataList: Array<number>) {
        let { _id } = await this.getTypesData();
        let query = { _id: _id };
        return await this.updateData(query, { type: dataList });
    }
}
