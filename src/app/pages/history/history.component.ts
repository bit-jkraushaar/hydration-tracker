import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HistoryEntry } from 'src/app/models/history-entry';
import { HistoryEntryGroup } from 'src/app/models/history-entry-group';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history$: Observable<HistoryEntryGroup[]> = of([]);

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.history$ = this.trackingService.findEntriesGroupedByDate$();
  }

  delete(entry: HistoryEntry): void {
    this.trackingService.deleteEntry(entry);
  }

}
