// src/polyfills.ts
import { Buffer } from "buffer";
import process from "process";

// make `global`, `process` and `Buffer` available to CJS libs
;(window as any).global = window;
;(window as any).process = process;
;(window as any).Buffer = Buffer;
