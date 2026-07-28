// Service Worker for Mobile & Desktop Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle clicking on a notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const conversationId = event.notification.data?.conversationId;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and post a message to switch conversation
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          if (conversationId) {
            client.postMessage({ type: "NAVIGATE_CHAT", conversationId });
          }
          return;
        }
      }
      // If no tab is open, open a new window
      if (self.clients.openWindow) {
        const targetUrl = conversationId ? `/?chat=${conversationId}` : "/";
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
