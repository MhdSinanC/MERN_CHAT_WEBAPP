let swRegistration = null;

export async function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", swRegistration);
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  }
}

export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission()
        .then((perm) => {
          console.log("Notification permission result:", perm);
        })
        .catch((err) => console.error("Error requesting notification permission:", err));
    }
  }
  registerServiceWorker();
}

export async function showDesktopNotification({ title, body, icon, conversationId, onClick }) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      // 1. Mobile & Desktop Service Worker Notification
      if ("serviceWorker" in navigator) {
        const registration = swRegistration || (await navigator.serviceWorker.ready);
        if (registration && "showNotification" in registration) {
          await registration.showNotification(title, {
            body,
            icon,
            badge: icon,
            tag: `chat-${conversationId || "message"}`,
            renotify: true,
            data: { conversationId },
            vibrate: [200, 100, 200],
          });
          return;
        }
      }

      // 2. Standard Web Notification API fallback
      const notification = new Notification(title, {
        body,
        icon,
        tag: `chat-${conversationId || "message"}`,
        renotify: true,
      });

      if (onClick) {
        notification.onclick = (e) => {
          e.preventDefault();
          window.focus();
          onClick();
          notification.close();
        };
      }
    } catch (err) {
      console.error("Failed to show notification:", err);
    }
  }
}
