import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
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

  findByDate$(date: Date): Observable<HistoryEntry[]> {
    return this.databaseService.findByDate$(date);
  }
}
