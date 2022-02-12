import Dexie, { Table } from 'dexie';
import { HistoryEntry } from '../models/history-entry';

export class AppDatabase extends Dexie {
    historyEntries!: Table<HistoryEntry, number>;

    constructor() {
        super('hydrationTrackerDB');
        this.version(1).stores({
            historyEntries: '++id,timestamp',
        });
    }
}

export const db = new AppDatabase();