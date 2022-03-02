import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { LocaleService } from 'src/app/services/locale.service';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  amount$: Observable<number> = of(0);
  progress$: Observable<number> = of(0);

  constructor(private trackingService: TrackingService, private localService: LocaleService) {    
  }

  ngOnInit(): void {
    this.amount$ = this.trackingService.findTodaysTotalAmount$();
    this.progress$ = this.trackingService.findTodaysTotalAmount$().pipe(
      map(amount => (amount / 2000) * 100),
    );
  }

  increase(inc: number): void {
    this.trackingService.addEntry({timestamp: new Date(), amount: inc});
  }

  get locale(): string {
    return this.localService.locale;
  }
}
