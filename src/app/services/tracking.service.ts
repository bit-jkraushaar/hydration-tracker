import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
import { HistoryEntryGroup } from '../models/history-entry-group';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  entries = new BehaviorSubject<HistoryEntry[]>([]);

  constructor() { }

  addEntry(entry: HistoryEntry): void {
    const entries = this.entries.value;
    entries.push(entry);
    this.entries.next(entries);
  }

  deleteEntry(entry: HistoryEntry): void {
    let entries = this.entries.value;
    entries = entries.filter(e => e.timestamp !== entry.timestamp);
    this.entries.next(entries);
  }

  findTodaysTotalAmount$(): Observable<number> {
    return this.entries.asObservable().pipe(
      map(entries => {
        // TODO filter for todays entries
        return entries.reduce((acc, value) => (acc + value.amount), 0)
      }),
    );
  }

  findEntriesGroupedByDate$(): Observable<HistoryEntryGroup[]> {
    return this.entries.asObservable().pipe(
      map(entries => {
        // TODO group by date
        const totalAmount = entries.reduce((acc, value) => (acc + value.amount), 0);
        const groups: HistoryEntryGroup[] = [
          {
            timestamp: new Date(),
            totalAmount,
            entries
          }
        ];
        return groups;
      }),
    );
  }
}
