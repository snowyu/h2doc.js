import xxhashWasm, { Exports } from 'xxhash-wasm';

let xxhashModule: Exports;
let initializing = false;

export async function initXXHash() {
  if (initializing) return;
  if (!xxhashModule) {
    initializing = true;
    try {
      xxhashModule = await xxhashWasm();
    } finally {
      initializing = false;
    }
  }
}

export function xxhash64(
  input: string,
  seedHigh?: number,
  seedLow?: number
): string {
  if (!xxhashModule) throw new Error('the xxhash should be inited first');
  return xxhashModule.h64(input, seedHigh, seedLow);
}

export function xxhash32(input: string, seed?: number): string {
  if (!xxhashModule) throw new Error('the xxhash should be inited first');
  return xxhashModule.h32(input, seed);
}

export const xxhash = xxhash64;
