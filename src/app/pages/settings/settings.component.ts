import { Component, OnInit } from '@angular/core';

declare var TimestampTrigger: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  async enableNotifications() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.showNotification('Notification Test', {
        tag: 'notification-test',
        body: 'This notification was scheduled 30 seconds ago',
        showTrigger: new TimestampTrigger(Date.now() + 30 * 1000) as any,
      } as any);
    }
  }

  get notificationTriggersSupported(): boolean {
    return 'showTrigger' in Notification.prototype;
  }

}
