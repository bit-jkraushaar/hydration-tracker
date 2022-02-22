(function () {
  "use strict";

  self.addEventListener("notificationclick", function (event) {
    console.log("click");
    event.notification.close();

    // TODO Duplicated in SettingsComponent
    const nextNotification = Date.now() + 60 * 60 * 1000;
    registration.showNotification("Hydration Tracker", {
      tag: "reminder",
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
    console.log("close");
    //event.notification.close();

    const schedule = async () => {
      // TODO Duplicated in SettingsComponent
      const nextNotification = Date.now() + 60 * 60 * 1000;
      console.log("schedule");
      return self.registration
        .showNotification("Hydration Tracker", {
          tag: "reminder",
          body: "Drink more water",
          showTrigger: new TimestampTrigger(nextNotification),
        })
        .then((result) => console.log("registered"));
    };

    console.log("waitUntil");
    event.waitUntil(schedule());
    console.log("end");
  });
})();
