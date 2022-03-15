async function scheduleNotification() {
  const db = await openDB();

  let frequency = await readConfigEntry(db, "notificationFrequency");
  if (!frequency) {
    frequency = 1;
  }

  let start = await readConfigEntry(db, "notificationStart");
  if (!start) {
    start = 8;
  }

  let end = await readConfigEntry(db, "notificationEnd");
  if (!end) {
    end = 20;
  }

  let nextNotification = Date.now() + frequency * 60 * 60 * 1000;
  const lowerBound = new Date().setHours(start, 0, 0);
  const upperBound = new Date().setHours(end, 0, 0);

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

async function readConfigEntry(db, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("config");
    const config = transaction.objectStore("config");
    const request = config.get(key);
    request.onsuccess = () => resolve(+request.result.value);
    request.onerror = () => reject("Reading config entry failed");
  });
}