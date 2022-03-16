import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { from, Observable } from 'rxjs';
import { HistoryEntry } from '../models/history-entry';
import { db } from './database';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryEntriesService {
  save$(entry: HistoryEntry): Observable<number> {
    return from(db.historyEntries.put(entry));
  }

  delete$(id: number): Observable<void> {
    return from(db.historyEntries.delete(id));
  }

  deleteEntriesBefore$(date: Date): Observable<number> {
    return from(db.historyEntries.where('timestamp').below(date).delete());
  }

  findByDate$(date: Date): Observable<HistoryEntry[]> {
    const d = dayjs(date).startOf('day');
    const lowerDate = d.toDate();
    const upperDate = d.add(1, 'day').toDate();
    return from(
      liveQuery(() =>
        db.historyEntries
          .where('timestamp')
          .between(lowerDate, upperDate)
          .toArray()
      )
    );
  }

  findAll$(): Observable<HistoryEntry[]> {
    return from(liveQuery(() => db.historyEntries.toArray()));
  }
}
