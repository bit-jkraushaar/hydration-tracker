import { HistoryEntry } from './history-entry';

export interface HistoryEntryGroup {
    timestamp: Date;
    totalAmount: number;
    entries: HistoryEntry[];
}
