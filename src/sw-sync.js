(function () {
  "use strict";

  self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();

    console.log(self);

    self.registration.showNotification('Notification Test', {
      tag: 'notification-test',
      body: 'This notification was scheduled 30 seconds ago',
      showTrigger: new TimestampTrigger(Date.now() + 30 * 1000),
    });
  
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(self.clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
      console.log(clientList);

      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client) {
          return client.focus();
        }    
      }

      console.log(self.clients);

      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    }));
  });

})();
