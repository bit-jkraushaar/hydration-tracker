import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

declare var TimestampTrigger: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  notifications: any[] = [];

  constructor() {}

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
        // TODO Duplicated in sw-sync.js
        const nextNotification = Date.now() + 60 * 60 * 1000;
        registration.showNotification('Hydration Tracker', {
          tag: 'reminder',
          body: 'Drink more water',
          showTrigger: new TimestampTrigger(nextNotification) as any,
        } as any);
      } else {
        return alert(
          'Service Worker is not registered, cannot show notifications.'
        );
      }
    } else {
      localStorage.setItem('notificationsEnabled', 'false');
    }
  }

  reloadScheduledNotifications(): void {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration
          .getNotifications({
            tag: 'reminder',
            includeTriggered: true,
          } as any)
          .then((notifications) => {
            console.log(notifications);
            this.notifications = notifications;
          });
      }
    });
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
