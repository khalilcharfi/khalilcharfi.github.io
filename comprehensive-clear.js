// COMPREHENSIVE BROWSER CACHE CLEARING SCRIPT
// This script specifically addresses chrome-extension caching issues

console.log("🧹 COMPREHENSIVE BROWSER CACHE CLEARING");
console.log("This will clear ALL browser caches and force a fresh Service Worker registration");

// Step 1: Clear ALL caches with detailed logging
if ("caches" in window) {
  caches.keys().then(function(cacheNames) {
    console.log("📦 Found caches:", cacheNames);
    if (cacheNames.length === 0) {
      console.log("✅ No caches found to clear");
    } else {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log("🗑️ Deleting cache:", cacheName);
          return caches.delete(cacheName);
        })
      );
    }
  }).then(function() {
    console.log("✅ All caches cleared successfully");
  }).catch(function(error) {
    console.error("❌ Error clearing caches:", error);
  });
}

// Step 2: Unregister ALL service workers with detailed logging
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("🔧 Found Service Worker registrations:", registrations.length);
    if (registrations.length === 0) {
      console.log("✅ No Service Workers to unregister");
    } else {
      for(let registration of registrations) {
        console.log("❌ Unregistering Service Worker:", registration.scope);
        registration.unregister();
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

// Step 4: Clear IndexedDB
if ("indexedDB" in window) {
  indexedDB.databases().then(function(databases) {
    if (databases.length === 0) {
      console.log("ℹ️ No IndexedDB databases found");
    } else {
      databases.forEach(function(database) {
        indexedDB.deleteDatabase(database.name);
        console.log("🗄️ Deleted IndexedDB:", database.name);
      });
    }
  }).catch(function(error) {
    console.log("ℹ️ IndexedDB clear error (normal):", error);
  });
}

// Step 5: Force reload with cache bypass
setTimeout(() => {
  console.log("🔄 FORCING PAGE RELOAD WITH CACHE BYPASS...");
  console.log("After reload, look for: Service Worker: Installing v7...");
  
  // Force reload bypassing cache
  window.location.reload(true);
}, 2000);
