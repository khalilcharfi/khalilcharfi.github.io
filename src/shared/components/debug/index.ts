// Only export debug components in development
if (import.meta.env.DEV) {
  export * from './DebugComponents';
} else {
  // In production, export empty components to prevent import errors
  export const PerformanceDrawer = () => null;
}
