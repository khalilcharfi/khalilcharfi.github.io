// Manual Service Worker cache clearing script
// Run this in the browser console to force clear everything

console.log("Clearing Service Worker cache...");

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
  });
}

// Unregister all service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log("Service Worker unregistered");
    }
  });
}

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log("Storage cleared");

// Force reload
setTimeout(() => {
  window.location.reload(true);
}, 1000);
