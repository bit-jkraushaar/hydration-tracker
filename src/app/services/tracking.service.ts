import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    return this.databaseService.findAll$().pipe(
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
