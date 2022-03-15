async function scheduleNotification() {
  const db = await openDB();
  let frequency = await readFrequency(db);
  // TODO remove
  console.log(frequency);
  if (!frequency) {
    frequency = 1;
  }

  let nextNotification = Date.now() + frequency * 60 * 60 * 1000;
  const lowerBound = new Date().setHours(8, 0, 0);
  const upperBound = new Date().setHours(20, 0, 0);

  if (nextNotification < lowerBound) {
    nextNotification = lowerBound;
  } else if (nextNotification > upperBound) {
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
    icon: "./assets/icons/icon-192x192.png",
    badge: "./assets/icons/icon-96x96.png",
    showTrigger: new TimestampTrigger(nextNotification),
  });
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const openRequest = self.indexedDB.open("hydrationTrackerDB");
    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = () => reject("Error opening database");
  });
}

async function readFrequency(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("config");
    const config = transaction.objectStore("config");
    const frequencyRequest = config.get("notificationFrequency");
    frequencyRequest.onsuccess = () => resolve(frequencyRequest.result);
    frequencyRequest.onerror = () => reject("Reading frequency failed");
  });
}