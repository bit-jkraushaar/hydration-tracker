import { ChangeContext, LabelType, Options } from '@angular-slider/ngx-slider';
import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';
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

  notificationStart: number = 8;
  notificationEnd: number = 20;
  options: Options = {
    floor: 0,
    ceil: 23,
    translate: (value: number): string => {
      return formatDate(
        new Date().setHours(value, 0, 0),
        'shortTime',
        this.locale
      );
    },
  };

  _dailyGoal = 2000;
  @ViewChild('goal') dailyGoalModel?: NgModel;

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

    this.notificationService
      .getNotificationStart$()
      .pipe(takeWhile(() => this.alive))
      .subscribe((start) => (this.notificationStart = start));
    this.notificationService
      .getNotificationEnd$()
      .pipe(takeWhile(() => this.alive))
      .subscribe((end) => (this.notificationEnd = end));
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

  notificationStartChanged(value: number) {
    this.notificationService.setNotificationStart(value);
  }

  notificationEndChanged(value: number) {
    this.notificationService.setNotificationEnd(value);
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

  get dailyGoal(): number {
    // TODO replace with service call to store value
    return this._dailyGoal;
  }

  set dailyGoal(goal: number) {
    if (!this.dailyGoalModel?.invalid) {
      // TODO replace with service call to store value
      this._dailyGoal = goal;
    }
    
  }
}
