// Quick Status Check
console.log("🔍 Quick Status Check...");

// Check React root
console.log("React root created:", typeof root !== "undefined");

// Check Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log("Service Workers:", registrations.length);
    registrations.forEach((reg, i) => {
      console.log(`  ${i + 1}. Scope: ${reg.scope}`);
      console.log(`     Active: ${reg.active ? "Yes" : "No"}`);
      console.log(`     Waiting: ${reg.waiting ? "Yes" : "No"}`);
    });
  });
}

// Check for any errors in console
console.log("✅ Status check complete");
