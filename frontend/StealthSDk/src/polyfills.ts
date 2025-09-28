// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
}

// Also make it available as window.Buffer for compatibility
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export {};