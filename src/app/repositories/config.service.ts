import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { from, Observable } from 'rxjs';
import { ConfigEntry } from '../models/config-entry';
import { db } from './database';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  set$(entry: ConfigEntry): Observable<string> {
    return from(db.config.put(entry));
  }

  get$(key: string): Observable<ConfigEntry | undefined> {
    return from(liveQuery(() => db.config.where('key').equals(key).first()));
  }
}
