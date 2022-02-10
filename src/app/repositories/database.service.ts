import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { from, Observable } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
import { db } from './database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  save$(entry: HistoryEntry): Observable<number> {
    return from(db.historyEntries.put(entry));
  }

  delete$(id: number): Observable<void> {
    return from(db.historyEntries.delete(id));
  }

  findByDate$(date: Date): Observable<HistoryEntry[]> {
    return from(
      liveQuery(() =>
        db.historyEntries.toCollection()
          .filter(historyEntry => {
            const { timestamp } = historyEntry;
            return timestamp.getFullYear() === date.getFullYear() &&
              timestamp.getMonth() === date.getMonth() &&
              timestamp.getDate() === date.getDate()
          })
          .toArray()
      )
    );
  }

  findAll$(): Observable<HistoryEntry[]> {
    return from(
      liveQuery(() => db.historyEntries.toArray())
    );
  }

}
