import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  nextNotification$ = new BehaviorSubject<Notification | undefined>(undefined);

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

  get frequency(): string {
    let frequency = localStorage.getItem('notficationFrequency');
    if (!frequency) {
      frequency = '1';
    }
    return frequency;
  }

  set frequency(f: string) {
    localStorage.setItem('notficationFrequency', f);
  }
}
