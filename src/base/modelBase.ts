import { Db, MongoClient } from 'mongodb';
import log4 from '../common/log4';
export abstract class ModelBase {
    private db: Db;
    private connection: MongoClient;
    public async init(url: string, dbName = '') {
        try {
            let client = new MongoClient(url);
            this.connection = await client.connect();
            this.setupDB(dbName);
        } catch (error) {
            console.error('[Error] Mongodb is not started');
        }
    }

    public setupDB(dbName: string) {
        log4("setupDB : " + dbName);
        this.db = this.connection.db(dbName);
    }

    public async getDBList(): Promise<Array<string>> {
        let db = this.connection.db();
        let allDb = (await db.admin().listDatabases({ nameOnly: true })).databases;
        let gameDbList = allDb
            ?.map((db) => db.name)
            .filter((db) => db !== 'API' && db != 'admin' && db != 'local' && db != 'config');
        return gameDbList;
    }

    protected abstract getCollectionName(): string;

    public getCollection() {
        let collectionName = this.getCollectionName();
        let dbName = this.db ? this.db.databaseName : 'no db';
        log4([dbName, collectionName]);
        return this.db.collection(this.getCollectionName());
    }

    public async insertData(data: any) {
        try {
            let collection = this.getCollection();
            return await collection.insertOne(data);
        } catch (err) {
            console.log('[Error] Model insert error', err);
        }
    }

    public async insertManyData(data: any) {
        try {
            let collection = await this.getCollection();
            return await collection.insertMany(data);
        } catch (err) {
            console.error(err);
        }
    }

    public async findData(data = {}) {
        log4([data]);
        let collection = await this.getCollection();
        return await collection.findOne(data);
    }

    public async findAllData(data = {}) {
        let collection = await this.getCollection();
        return await collection.find(data).toArray();
    }

    public async updateData(query: any, data: any) {
        let collection = await this.getCollection();
        return await collection.updateOne(query, { $set: data });
    }

    public async deleteData(query: any) {
        let collection = await this.getCollection();
        return await collection.deleteOne(query);
    }
}
