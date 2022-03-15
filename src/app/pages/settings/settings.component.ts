import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, Observable, takeWhile } from 'rxjs';
import { LocaleService } from 'src/app/services/locale.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  alive = true;

  nextNotification$: Observable<Notification | undefined>;
  notificationFrequency$ = new BehaviorSubject('1');

  constructor(
    private notificationService: NotificationService,
    private localeService: LocaleService
  ) {
    this.nextNotification$ =
      this.notificationService.nextNotification$.asObservable();
    this.notificationService
      .getFrequency$()
      .pipe(takeWhile(() => this.alive))
      .subscribe(this.notificationFrequency$);
  }

  ngOnInit(): void {
    this.notificationService.reloadScheduledNotifications();
  }

  ngOnDestroy(): void {
    this.alive = false;
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

  selectedLocaleChanged(event: MatRadioChange): void {
    this.localeService.locale = event.value;
  }

  selectedFrequencyChanged(event: MatSelectChange): void {
    this.notificationService.setFrequency(event?.value);
  }

  get notificationTriggersSupported(): boolean {
    return this.notificationService.isNotificationTriggersSupported();
  }

  get notificationsEnabled(): boolean {
    return this.notificationService.isNotificationsEnabled();
  }

  get locale(): string {
    return this.localeService.locale;
  }
}
