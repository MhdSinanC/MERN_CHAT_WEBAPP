export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().catch((err) =>
        console.error("Error requesting notification permission:", err)
      );
    }
  }
}

export function showDesktopNotification({ title, body, icon, onClick }) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon,
        tag: "chat-message",
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
      console.error("Failed to show desktop notification:", err);
    }
  }
}
