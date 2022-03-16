import Dexie, { Table } from 'dexie';
import { ConfigEntry } from '../models/config-entry';
import { HistoryEntry } from '../models/history-entry';

export class AppDatabase extends Dexie {
    historyEntries!: Table<HistoryEntry, number>;
    config!: Table<ConfigEntry, string>;

    constructor() {
        super('hydrationTrackerDB');
        this.version(1).stores({
            historyEntries: '++id,timestamp',
        });
        this.version(2).stores({
            config: 'key',
        });
        this.version(3).upgrade(tx => {
            const configEntries: ConfigEntry[] = [
                {key: 'notificationFrequency', value: '1'},
                {key: 'notificationStart', value: '8'},
                {key: 'notificationEnd', value: '20'},
            ]
            return tx.table('config').bulkPut(configEntries);
        });
    }
}

export const db = new AppDatabase();