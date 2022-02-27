import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  nextNotification$: Observable<Notification | undefined>;

  constructor(private notificationService: NotificationService) {
    this.nextNotification$ = this.notificationService.nextNotification$.asObservable();
  }

  ngOnInit(): void {
    this.notificationService.reloadScheduledNotifications();
  }

  async changeNotifications(change: MatSlideToggleChange) {
    if (change.checked) {
      await this.notificationService.enableNotifications();
    } else {
      this.notificationService.disableNotifications();
    }
  }

  notificationDate(notification: Notification): Date | undefined {
    if (notification) {
      const timestamp = (notification as any).showTrigger?.timestamp;
      return new Date(timestamp);
    } else {
      return undefined;
    }
  }

  get notificationTriggersSupported(): boolean {
    return this.notificationService.isNotificationTriggersSupported();
  }

  get notificationsEnabled(): boolean {
    return this.notificationService.isNotificationsEnabled();
  }
}
