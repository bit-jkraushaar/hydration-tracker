import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ConfigService } from '../repositories/config.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  nextNotification$ = new BehaviorSubject<Notification | undefined>(undefined);

  constructor(private configService: ConfigService) {}

  async enableNotifications(): Promise<void> {
    localStorage.setItem('notificationsEnabled', 'true');

    let { state } = await navigator.permissions.query({
      name: 'notifications',
    });
    if (state === 'prompt') {
      await Notification.requestPermission();
    }
    state = (await navigator.permissions.query({ name: 'notifications' }))
      .state;
    if (state !== 'granted') {
      return alert('You need to grant notifications permission.');
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      // use postMessage to advice service worker to schedule notifications
      navigator.serviceWorker.controller?.postMessage({
        type: 'ENABLE_NOTIFICATIONS',
      });
      this.reloadScheduledNotifications();
    } else {
      return alert(
        'Service Worker is not registered, cannot show notifications.'
      );
    }
  }

  disableNotifications(): void {
    localStorage.setItem('notificationsEnabled', 'false');
    this.deletePendingNotifications();
  }

  reloadScheduledNotifications(): void {
    if (!this.isNotificationTriggersSupported()) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration
          .getNotifications({
            includeTriggered: true,
          } as any)
          .then((notifications) => {
            const notification = notifications
              .sort(
                (a, b) =>
                  (a as any).showTrigger?.timestamp -
                  (b as any).showTrigger?.timestamp
              )
              .find((_, index) => index === 0);
            this.nextNotification$.next(notification);
          });
      }
    });
  }

  private deletePendingNotifications(): void {
    if (!this.isNotificationTriggersSupported()) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration
          .getNotifications({
            includeTriggered: true,
          } as any)
          .then((notifications) => {
            notifications.forEach((notification) => notification.close());
            this.reloadScheduledNotifications();
          });
      }
    });
  }

  isNotificationTriggersSupported(): boolean {
    const serviceWorkerAvailable = 'serviceWorker' in navigator;
    // Only available if feature flag #enable-experimental-web-platform-features is enabled
    // and Notification Triggers are supported
    // see https://bugs.chromium.org/p/chromium/issues/detail?id=891339
    const showTriggerAvailable = 'showTrigger' in Notification.prototype;
    return serviceWorkerAvailable && showTriggerAvailable;
  }

  isNotificationsEnabled(): boolean {
    return localStorage.getItem('notificationsEnabled') === 'true';
  }

  getFrequency$(): Observable<string> {
    return this.configService
      .get$('notificationFrequency')
      .pipe(map((frequency) => (!frequency ? '1' : frequency.value)));
  }

  setFrequency(f: string): void {
    this.configService
      .set$({ key: 'notificationFrequency', value: f })
      .subscribe();
  }

  getNotificationStart$(): Observable<number> {
    return this.configService
      .get$('notificationStart')
      .pipe(map((start) => (!start ? 8 : +start.value)));
  }

  setNotificationStart(start: number): void {
    this.configService
      .set$({ key: 'notificationStart', value: String(start) })
      .subscribe();
  }

  getNotificationEnd$(): Observable<number> {
    return this.configService
      .get$('notificationEnd')
      .pipe(map((end) => (!end ? 20 : +end.value)));
  }

  setNotificationEnd(end: number): void {
    this.configService
      .set$({ key: 'notificationEnd', value: String(end) })
      .subscribe();
  }
}
