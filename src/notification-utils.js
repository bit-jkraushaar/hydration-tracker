async function scheduleNotification() {
  // Timestamp is also used in tag, otherwise Chrome does not allow to create
  // notifications with same tag in notificationclose.
  const nextNotification = Date.now() + 60 * 60 * 1000;
  return self.registration.showNotification("Hydration Tracker", {
    tag: "reminder-" + nextNotification,
    body: "Drink more water",
    showTrigger: new TimestampTrigger(nextNotification),
  });
}
