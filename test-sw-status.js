// Test Service Worker Status
console.log("🔍 Testing Service Worker Status...");

// Check if Service Worker is supported
if ("serviceWorker" in navigator) {
  console.log("✅ Service Worker is supported");
  
  // Check current registrations
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("📋 Current Service Worker registrations:", registrations.length);
    
    registrations.forEach(function(registration, index) {
      console.log(`Service Worker ${index + 1}:`);
      console.log("  - Scope:", registration.scope);
      console.log("  - Active:", registration.active ? "Yes" : "No");
      console.log("  - Waiting:", registration.waiting ? "Yes" : "No");
      console.log("  - Installing:", registration.installing ? "Yes" : "No");
    });
  });
  
  // Check if Service Worker is controlling the page
  if (navigator.serviceWorker.controller) {
    console.log("✅ Service Worker is controlling this page");
  } else {
    console.log("⚠️ Service Worker is not controlling this page");
  }
} else {
  console.log("❌ Service Worker is not supported");
}

// Check caches
if ("caches" in window) {
  caches.keys().then(function(cacheNames) {
    console.log("📦 Available caches:", cacheNames);
  });
}
