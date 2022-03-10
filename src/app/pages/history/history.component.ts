import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { map, Observable } from 'rxjs';
import { HistoryEntry } from 'src/app/models/history-entry';
import { HistoryEntryGroup } from 'src/app/models/history-entry-group';
import { LocaleService } from 'src/app/services/locale.service';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  historyDates: Date[] = [];
  groups: Map<Date, Observable<HistoryEntryGroup>> = new Map();

  constructor(private trackingService: TrackingService, private localeService: LocaleService) { }

  ngOnInit(): void {
    const today = dayjs().startOf('day');

    for (let i = 0; i < 7; i++) {
      const date = today.subtract(i, 'days').toDate();
      this.historyDates.push(date);
      this.groups.set(date, this.historyGroupByDate$(date));
    }

    const [lastDate] = this.historyDates.slice(-1);
    this.trackingService.purgeOldEntriesBefore(lastDate);
  }

  private historyGroupByDate$(date: Date): Observable<HistoryEntryGroup> {
    return this.trackingService.findByDate$(date).pipe(
      map(entries => {
        const totalAmount = entries.reduce((acc, value) => (acc + value.amount), 0);
        entries.sort((a, b) => (b.timestamp.getTime() - a.timestamp.getTime()));
        const group: HistoryEntryGroup = {
          timestamp: date,
          totalAmount,
          entries
        };
        return group;
      })
    );
  }

  delete(entry: HistoryEntry): void {
    this.trackingService.deleteEntry(entry);
  }

  get locale(): string {
    return this.localeService.locale;
  }

}
