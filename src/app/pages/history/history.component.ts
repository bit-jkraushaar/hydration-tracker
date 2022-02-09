import { Component, OnInit } from '@angular/core';
import { HistoryEntryGroup } from 'src/app/models/history-entry-group';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: HistoryEntryGroup[] = [
    {
      timestamp: new Date(),
      totalAmount: 250,
      entries: [
        {
          timestamp: new Date(),
          amount: 50,
        },
        {
          timestamp: new Date(),
          amount: 200,
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
