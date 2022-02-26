import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  nextNotification$ = new BehaviorSubject<Notification | undefined>(undefined);

  constructor() {}

  ngOnInit(): void {
    this.reloadScheduledNotifications();
  }

  async changeNotifications(change: MatSlideToggleChange) {
    if (change.checked) {
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
    } else {
      localStorage.setItem('notificationsEnabled', 'false');
      this.deletePendingNotifications();
    }
  }

  reloadScheduledNotifications(): void {
    if (!this.notificationTriggersSupported) {
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

  deletePendingNotifications(): void {
    if (!this.notificationTriggersSupported) {
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

  notificationDate(notification: Notification): Date | undefined {
    if (notification) {
      const timestamp = (notification as any).showTrigger?.timestamp;
      return new Date(timestamp);
    } else {
      return undefined;
    }
  }

  get notificationTriggersSupported(): boolean {
    const serviceWorkerAvailable = 'serviceWorker' in navigator;
    // Only available if feature flag #enable-experimental-web-platform-features is enabled
    // and Notification Triggers are supported
    // see https://bugs.chromium.org/p/chromium/issues/detail?id=891339
    const showTriggerAvailable = 'showTrigger' in Notification.prototype;
    return serviceWorkerAvailable && showTriggerAvailable;
  }

  get notificationsEnabled(): boolean {
    return localStorage.getItem('notificationsEnabled') === 'true';
  }
}
