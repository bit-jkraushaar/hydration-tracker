import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  amount = 0;
  progress = 0;

  increase(inc: number): void {
    this.amount = this.amount + inc;
    this.progress = (this.amount / 2000) * 100;
  }
}
