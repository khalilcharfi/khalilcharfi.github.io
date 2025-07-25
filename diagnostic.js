// DIAGNOSTIC SCRIPT - Check what is loading
console.log("🔍 DIAGNOSTIC: Starting comprehensive check...");

// Check 1: Basic page load
console.log("1️⃣ Page load status:", document.readyState);
console.log("   URL:", window.location.href);
console.log("   Title:", document.title);

// Check 2: React availability
setTimeout(() => {
  console.log("2️⃣ React check:");
  if (typeof React !== "undefined") {
    console.log("   ✅ React is available");
    console.log("   React version:", React.version);
  } else {
    console.log("   ❌ React is NOT available");
  }
  
  if (typeof ReactDOM !== "undefined") {
    console.log("   ✅ ReactDOM is available");
  } else {
    console.log("   ❌ ReactDOM is NOT available");
  }
}, 100);

// Check 3: Root element
console.log("3️⃣ Root element check:");
const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("   ✅ Root element found");
  console.log("   Content:", rootElement.innerHTML.substring(0, 100) + "...");
} else {
  console.log("   ❌ Root element NOT found");
}

// Check 4: CSS loading
console.log("4️⃣ CSS check:");
const stylesheets = document.styleSheets;
console.log("   Stylesheets loaded:", stylesheets.length);
for (let i = 0; i < stylesheets.length; i++) {
  try {
    console.log(`   ${i + 1}. ${stylesheets[i].href || "inline"}`);
  } catch (e) {
    console.log(`   ${i + 1}. [CORS blocked]`);
  }
}

// Check 5: Script loading
console.log("5️⃣ Script check:");
const scripts = document.scripts;
console.log("   Scripts loaded:", scripts.length);
for (let i = 0; i < scripts.length; i++) {
  console.log(`   ${i + 1}. ${scripts[i].src || "inline"}`);
}

// Check 6: Error monitoring
window.addEventListener("error", (event) => {
  console.error("🚨 SCRIPT ERROR:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 UNHANDLED PROMISE REJECTION:", event.reason);
});

// Check 7: Network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log("🌐 FETCH REQUEST:", args[0]);
  return originalFetch.apply(this, args);
};

console.log("🔍 DIAGNOSTIC: Setup complete - check console for results");
