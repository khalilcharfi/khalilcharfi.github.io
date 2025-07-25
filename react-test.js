// Simple test to check if React is working
console.log("🧪 Testing React app...");

// Check if React is loaded
if (typeof React !== "undefined") {
  console.log("✅ React is loaded");
} else {
  console.log("❌ React is not loaded");
}

// Check if the root element exists
const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("✅ Root element found:", rootElement);
} else {
  console.log("❌ Root element not found");
}

// Check for any script errors
window.addEventListener("error", (event) => {
  console.error("🚨 Script error:", event.error);
});

// Check for any unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Unhandled promise rejection:", event.reason);
});

console.log("🔍 Test complete - check console for results");
