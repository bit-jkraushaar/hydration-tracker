async function scheduleNotification() {
  let nextNotification = Date.now() + 60 * 60 * 1000;
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
    body: "Drink more water",
    showTrigger: new TimestampTrigger(nextNotification),
  });
}
