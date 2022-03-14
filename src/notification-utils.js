async function scheduleNotification() {
  // TODO localStorage cannot be used in Service Worker... use IndexDB or messaging
  //let frequency = +localStorage.getItem("notficationFrequency");
  let frequency = 1;
  if (!frequency) {
    frequency = 1;
  }

  let nextNotification = Date.now() + frequency * 60 * 60 * 1000;
  const lowerBound = new Date().setHours(8, 0, 0);
  const upperBound = new Date().setHours(20, 0, 0);

  if (nextNotification < lowerBound) {
    nextNotification = lowerBound;
  } else if(nextNotification > upperBound) {
    const lowerBoundDate = new Date(lowerBound);
    nextNotification = lowerBoundDate.setDate(lowerBoundDate.getDate() + 1);
  }

  // Timestamp is also used in tag, otherwise Chrome does not allow to create
  // notifications with same tag in notificationclose.
  return self.registration.showNotification("Hydration Tracker", {
    tag: "reminder-" + nextNotification,
    body: "Don't forget to drink water",
    silent: false,
    vibrate: [200, 100, 200],
    icon: './assets/icons/icon-192x192.png',
    badge: './assets/icons/icon-96x96.png',
    showTrigger: new TimestampTrigger(nextNotification),
  });
}
