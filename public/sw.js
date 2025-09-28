const CACHE_NAME = "wais-v1";
const STATIC_CACHE = "wais-static-v1";
const DYNAMIC_CACHE = "wais-dynamic-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/accounts",
  "/transactions",
  "/insights",
  "/reports",
  "/settings",
  "/auth/login",
  "/auth/signup",
  "/offline",
  "/manifest.json",
  // Add your essential CSS and JS files here
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests (different origin)
  if (!request.url.startsWith(self.location.origin)) return;

  // Handle API requests differently
  if (request.url.includes("/api/") || request.url.includes("/graphql")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response as it can only be consumed once
          const responseClone = response.clone();

          // Cache successful API responses for offline access
          if (response.ok) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Return offline fallback for API requests
            return new Response(
              JSON.stringify({
                error: "Offline",
                message: "This data is not available offline",
              }),
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "application/json" },
              }
            );
          });
        })
    );
    return;
  }

  // Handle page requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[SW] Serving from cache:", request.url);
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response.ok) {
            return response;
          }

          // Clone the response
          const responseClone = response.clone();

          // Cache the response
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline");
          }

          // Return a basic offline response for other requests
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    })
  );
});

// Background sync for offline transactions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[SW] Background sync triggered");
    event.waitUntil(doBackgroundSync());
  }
});

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push received");

  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-96x96.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("WAIS Notification", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/dashboard"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        } else {
          return clients.openWindow("/");
        }
      })
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions();

    for (const transaction of offlineTransactions) {
      try {
        // Attempt to sync with server
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        });

        if (response.ok) {
          // Remove from offline storage
          await removeOfflineTransaction(transaction.id);
          console.log("[SW] Transaction synced:", transaction.id);
        }
      } catch (error) {
        console.error("[SW] Failed to sync transaction:", error);
      }
    }
  } catch (error) {
    console.error("[SW] Background sync failed:", error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineTransactions() {
  // Implementation would use IndexedDB to retrieve offline transactions
  return [];
}

async function removeOfflineTransaction(id) {
  // Implementation would remove transaction from IndexedDB
  console.log("[SW] Would remove offline transaction:", id);
}

// Update available notification
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("[SW] Service worker loaded");
