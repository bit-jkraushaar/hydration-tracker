import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { map, mergeMap, Observable, range, toArray } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
import { HistoryEntryGroup } from '../models/history-entry-group';
import { DatabaseService } from '../repositories/database.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private databaseService: DatabaseService) { }

  addEntry(entry: HistoryEntry): void {
    this.databaseService.save$(entry).subscribe();
  }

  deleteEntry(entry: HistoryEntry): void {
    if (entry.id) {
      this.databaseService.delete$(entry.id).subscribe();
    }
  }

  findTodaysTotalAmount$(): Observable<number> {
    return this.databaseService.findByDate$(new Date()).pipe(
      map(entries => {
        return entries.reduce((acc, value) => (acc + value.amount), 0)
      }),
    );
  }

  findEntriesGroupedByDate$(): Observable<HistoryEntryGroup[]> {
    const today = dayjs().startOf('day');

    return range(0, 7).pipe(
      map(days => today.subtract(days, 'days').toDate()),
      // TODO does not work, because liveQuery
      mergeMap(date => this.databaseService.findByDate$(date).pipe(
        map(entries => {
          const totalAmount = entries.reduce((acc, value) => (acc + value.amount), 0);
          const group: HistoryEntryGroup = {
            timestamp: date,
            totalAmount,
            entries
          };
          return group;
        }),
      )),
      toArray(),
    );
  }
}
