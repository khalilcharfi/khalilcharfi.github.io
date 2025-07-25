// React Root Diagnostic Script
console.log("🔍 React Root Diagnostic - Testing createRoot fix...");

// Check if React is loaded
if (typeof React !== "undefined") {
  console.log("✅ React is available");
  console.log("   Version:", React.version);
} else {
  console.log("❌ React is NOT available");
}

// Check if ReactDOM is loaded
if (typeof ReactDOM !== "undefined") {
  console.log("✅ ReactDOM is available");
} else {
  console.log("❌ ReactDOM is NOT available");
}

// Check for createRoot
if (typeof ReactDOM?.createRoot === "function") {
  console.log("✅ createRoot is available");
} else {
  console.log("❌ createRoot is NOT available");
}

// Check root element
const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("✅ Root element found");
  console.log("   Content length:", rootElement.innerHTML.length);
} else {
  console.log("❌ Root element NOT found");
}

// Check for any React-related errors
let errorCount = 0;
const originalError = console.error;
console.error = function(...args) {
  errorCount++;
  const message = args.join(" ");
  if (message.includes("createRoot") || message.includes("React")) {
    console.log("🚨 REACT ERROR:", ...args);
  }
  originalError.apply(console, args);
};

// Check for warnings
let warningCount = 0;
const originalWarn = console.warn;
console.warn = function(...args) {
  warningCount++;
  const message = args.join(" ");
  if (message.includes("createRoot") || message.includes("React")) {
    console.log("⚠️ REACT WARNING:", ...args);
  }
  originalWarn.apply(console, args);
};

// Summary after 3 seconds
setTimeout(() => {
  console.log("�� DIAGNOSTIC SUMMARY:");
  console.log(`   React Errors: ${errorCount}`);
  console.log(`   React Warnings: ${warningCount}`);
  
  if (errorCount === 0 && warningCount === 0) {
    console.log("🎉 SUCCESS: No React errors or warnings detected!");
  } else {
    console.log("⚠️ Issues found - check console above");
  }
  
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
}, 3000);

console.log("🔍 Diagnostic running - check console for results");
