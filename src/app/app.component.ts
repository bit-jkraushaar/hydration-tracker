import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  amount = 0;
  progress = 0;

  increase(): void {
    this.amount = this.amount + 200;
    this.progress = (this.amount / 2000) * 100;
  }
}
