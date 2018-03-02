'use strict';

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Jagat Jeevan';
  const options = {
    body: event.data.text(),
    icon: "img/android-icon-36x36.png",
    badge: "img/android-icon-72x72.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
