import { ModelBase } from '../base/modelBase';

export class RoleModel extends ModelBase {
    protected getCollectionName(): string {
        return 'Role';
    }

    public async getAllRole() {
        return await this.findAllData();
    }
}
