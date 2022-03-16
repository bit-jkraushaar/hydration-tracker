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
    }
}

export const db = new AppDatabase();