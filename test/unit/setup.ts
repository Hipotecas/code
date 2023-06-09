import 'whatwg-fetch'
import 'fake-indexeddb/auto'
import { vi } from "vitest";


if (globalThis && 'window' in globalThis && typeof window !== undefined) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}



process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.log('FAILED TO HANDLE PROMISE REJECTION');
  throw reason;
});

export default {};
