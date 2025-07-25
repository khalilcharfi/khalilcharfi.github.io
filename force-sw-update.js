// Force Service Worker update script
// Run this in the browser console to clear Service Worker cache

if ("serviceWorker" in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log("Service Worker unregistered");
    }
  });
  
  // Clear all caches
  if ("caches" in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log("Deleting cache:", cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log("All caches cleared");
      // Reload the page to register the new Service Worker
      window.location.reload();
    });
  }
}
