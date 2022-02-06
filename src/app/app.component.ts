import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  amount = 0;
  progress = 0;

  increase(inc: number): void {
    this.amount = this.amount + inc;
    this.progress = (this.amount / 2000) * 100;
  }
}
