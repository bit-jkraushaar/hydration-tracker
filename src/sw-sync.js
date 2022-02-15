(function () {
  "use strict";

  self.addEventListener("activate", function (event) {
    event.waitUntil(serverSync());
  });

  async function serverSync() {
    const status = await navigator.permissions.query({
      name: "periodic-background-sync",
    });
    console.log(status);
    if (status.state === "granted") {
      console.log("Periodic background sync can be used.");

      //const registration = await navigator.serviceWorker.ready;
      const registration = self.registration;
      console.log(registration);
      if ("periodicSync" in registration) {
        try {
          await registration.periodicSync.register("content-sync", {
            // An interval of one minute.
            minInterval: 60 * 1000,
          });
          console.log("periodic sync registered");
        } catch (error) {
          // Periodic background sync cannot be used.
          console.log(error);
        }
      } else {
          console.log("no periodicSync in registration");
      }
    } else {
      console.log("Periodic background sync cannot be used.");
    }
  }

  self.addEventListener("periodicsync", function (event) {
    if (event.tag == "content-sync") {
      console.log("periodic sync called");
    }
  });

})();
