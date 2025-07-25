// AGGRESSIVE Service Worker Cache Clearing Script
// Run this in the browser console to completely clear everything

console.log("🚀 Starting aggressive Service Worker cache clearing...");

// Step 1: Clear all caches
if ("caches" in window) {
  caches.keys().then(function(cacheNames) {
    console.log("📦 Found caches:", cacheNames);
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log("🗑️ Deleting cache:", cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log("✅ All caches cleared");
  }).catch(function(error) {
    console.error("❌ Error clearing caches:", error);
  });
}

// Step 2: Unregister ALL service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("🔧 Found Service Worker registrations:", registrations.length);
    for(let registration of registrations) {
      registration.unregister();
      console.log("❌ Unregistered Service Worker:", registration.scope);
    }
  }).catch(function(error) {
    console.error("❌ Error unregistering Service Workers:", error);
  });
}

// Step 3: Clear all storage
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log("🧹 Storage cleared");
} catch (error) {
  console.error("❌ Error clearing storage:", error);
}

// Step 4: Force reload after a delay
setTimeout(() => {
  console.log("🔄 Reloading page...");
  window.location.reload(true);
}, 2000);
