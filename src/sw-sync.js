(function () {
  "use strict";

  self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    // TODO Has to be placed in waitUntil()
    // TODO Duplicated in SettingsComponent
    const nextNotification = Date.now() + 60 * 60 * 1000;
    registration.showNotification("Hydration Tracker", {
      tag: "reminder-" + nextNotification,
      body: "Drink more water",
      showTrigger: new TimestampTrigger(nextNotification),
    });

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
        })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if ("focus" in client) {
              return client.focus();
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow("/hydration-tracker/");
          }
        })
    );
  });

  self.addEventListener("notificationclose", function (event) {
    const schedule = async () => {
      // TODO Duplicated in SettingsComponent
      // Timestamp is also used in tag, otherwise Chrome does not allow to create
      // notifications with same tag in notificationclose.
      const nextNotification = Date.now() + 60 * 60 * 1000;
      return self.registration
        .showNotification("Hydration Tracker", {
          tag: "reminder-" + nextNotification,
          body: "Drink more water",
          showTrigger: new TimestampTrigger(nextNotification),
        });
    };

    event.waitUntil(schedule());
  });
})();
