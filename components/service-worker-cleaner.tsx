"use client";

import { useEffect } from "react";

export function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          console.warn(
            "ServiceWorkerCleaner: Unregistering leftover Service Worker to fix fetch errors:",
            registration
          );
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
}
