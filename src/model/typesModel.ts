import { ModelBase } from '../base/modelBase';

export class TypesModel extends ModelBase {
    protected getCollectionName(): string {
        return 'Types';
    }

    public async getTypesData() {
        return await this.findData();
    }
}
