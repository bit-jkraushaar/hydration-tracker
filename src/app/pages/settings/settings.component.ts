import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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

  async changeNotifications(change: MatSlideToggleChange) {
    
    let {state} = await navigator.permissions.query({name: 'notifications'});
    if (state === 'prompt') {
      await Notification.requestPermission();
    } 
    state = (await navigator.permissions.query({name: 'notifications'})).state;
    if (state !== 'granted') {
      return alert('You need to grant notifications permission for this demo to work.');
    }  

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.showNotification('Notification Test', {
        tag: 'notification-test',
        body: 'This notification was scheduled 30 seconds ago',
        showTrigger: new TimestampTrigger(Date.now() + 30 * 1000) as any,
      } as any);
    } else {
      console.log('No registration available');
    }
  }

  get notificationTriggersSupported(): boolean {
    const serviceWorkerAvailable = 'serviceWorker' in navigator;
    const showTriggerAvailable = 'showTrigger' in Notification.prototype;
    return serviceWorkerAvailable && showTriggerAvailable;
  }

}
