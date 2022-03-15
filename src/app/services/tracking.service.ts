import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
import { HistoryEntriesService } from '../repositories/history-entries.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private historyEntriesService: HistoryEntriesService) { }

  addEntry(entry: HistoryEntry): void {
    this.historyEntriesService.save$(entry).subscribe();
  }

  deleteEntry(entry: HistoryEntry): void {
    if (entry.id) {
      this.historyEntriesService.delete$(entry.id).subscribe();
    }
  }

  findTodaysTotalAmount$(): Observable<number> {
    return this.historyEntriesService.findByDate$(new Date()).pipe(
      map(entries => {
        return entries.reduce((acc, value) => (acc + value.amount), 0)
      }),
    );
  }

  findByDate$(date: Date): Observable<HistoryEntry[]> {
    return this.historyEntriesService.findByDate$(date);
  }

  purgeOldEntriesBefore(threshold: Date): void {
    this.historyEntriesService.deleteEntriesBefore$(threshold).subscribe();
  }
}
