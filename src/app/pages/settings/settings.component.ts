import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  get notificationTriggersSupported(): boolean {
    return 'showTrigger' in Notification.prototype;
  }

}
