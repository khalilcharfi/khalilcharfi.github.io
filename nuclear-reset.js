// NUCLEAR OPTION - Complete Service Worker Reset
// This script will completely clear everything and force a fresh start

console.log("🚀 NUCLEAR OPTION: Complete Service Worker Reset");
console.log("This will clear ALL caches, unregister ALL service workers, and force reload");

// Step 1: Clear ALL caches
if ("caches" in window) {
  caches.keys().then(function(cacheNames) {
    console.log("📦 Found caches to delete:", cacheNames);
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log("🗑️ Deleting cache:", cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log("✅ All caches cleared successfully");
  }).catch(function(error) {
    console.error("❌ Error clearing caches:", error);
  });
}

// Step 2: Unregister ALL service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("🔧 Found Service Worker registrations:", registrations.length);
    if (registrations.length === 0) {
      console.log("✅ No Service Workers to unregister");
    } else {
      for(let registration of registrations) {
        registration.unregister();
        console.log("❌ Unregistered Service Worker:", registration.scope);
      }
    }
  }).catch(function(error) {
    console.error("❌ Error unregistering Service Workers:", error);
  });
}

// Step 3: Clear ALL storage
try {
  localStorage.clear();
  sessionStorage.clear();
  console.log("🧹 All storage cleared");
} catch (error) {
  console.error("❌ Error clearing storage:", error);
}

// Step 4: Clear IndexedDB (if available)
if ("indexedDB" in window) {
  indexedDB.databases().then(function(databases) {
    databases.forEach(function(database) {
      indexedDB.deleteDatabase(database.name);
      console.log("🗄️ Deleted IndexedDB:", database.name);
    });
  }).catch(function(error) {
    console.log("ℹ️ No IndexedDB to clear or error:", error);
  });
}

// Step 5: Force reload after delay
setTimeout(() => {
  console.log("🔄 FORCING PAGE RELOAD...");
  console.log("After reload, check console for Service Worker: Installing v6... message");
  window.location.reload(true);
}, 3000);
