importScripts("./notification-utils.js");

(() => {
  "use strict";

  async function openApp() {
    // self references the service worker
    self.clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (let client of clientList) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow("/hydration-tracker/");
        }
      });
  }

  self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    event.waitUntil(scheduleNotification());
    event.waitUntil(openApp());
  });

  self.addEventListener("notificationclose", (event) => {
    event.waitUntil(scheduleNotification());
  });

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "ENABLE_NOTIFICATIONS") {
      event.waitUntil(scheduleNotification());
    }
  });
})();
