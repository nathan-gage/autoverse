/* tslint:disable */
/* eslint-disable */

export class WasmGpuPropagator {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get grid height.
   */
  getHeight(): number;
  /**
   * Get total mass across all channels.
   */
  totalMass(): number;
  /**
   * Create new GPU propagator from JSON configuration.
   *
   * This is async because GPU initialization requires async adapter/device requests.
   */
  constructor(config_json: string, seed_json: string);
  /**
   * Run multiple simulation steps (async to allow GPU readback).
   */
  run(steps: bigint): Promise<void>;
  /**
   * Perform one simulation step (async to allow GPU readback).
   */
  step(): Promise<void>;
  /**
   * Reset simulation with new seed.
   */
  reset(seed_json: string): void;
  /**
   * Get current step count.
   */
  getStep(): bigint;
  /**
   * Get current simulation time.
   */
  getTime(): number;
  /**
   * Get current simulation state as JSON.
   */
  getState(): any;
  /**
   * Get simulation statistics as JSON.
   */
  getStats(): any;
  /**
   * Get grid width.
   */
  getWidth(): number;
}

export class WasmPropagator {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get grid height.
   */
  getHeight(): number;
  /**
   * Get total mass across all channels.
   */
  totalMass(): number;
  /**
   * Create new propagator from JSON configuration.
   *
   * # Arguments
   * * `config_json` - JSON string containing SimulationConfig
   * * `seed_json` - JSON string containing Seed
   *
   * # Panics
   * Panics if JSON is invalid or configuration is invalid.
   */
  constructor(config_json: string, seed_json: string);
  /**
   * Run multiple simulation steps.
   */
  run(steps: bigint): void;
  /**
   * Perform one simulation step.
   */
  step(): void;
  /**
   * Reset simulation with new seed.
   */
  reset(seed_json: string): void;
  /**
   * Get current step count.
   */
  getStep(): bigint;
  /**
   * Get current simulation time.
   */
  getTime(): number;
  /**
   * Get current simulation state as JSON.
   */
  getState(): any;
  /**
   * Get simulation statistics as JSON.
   */
  getStats(): any;
  /**
   * Get grid width.
   */
  getWidth(): number;
}

/**
 * Initialize WASM module with panic hook and logging.
 */
export function init(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmgpupropagator_free: (a: number, b: number) => void;
  readonly __wbg_wasmpropagator_free: (a: number, b: number) => void;
  readonly wasmgpupropagator_getHeight: (a: number) => number;
  readonly wasmgpupropagator_getState: (a: number) => [number, number, number];
  readonly wasmgpupropagator_getStats: (a: number) => [number, number, number];
  readonly wasmgpupropagator_getStep: (a: number) => bigint;
  readonly wasmgpupropagator_getTime: (a: number) => number;
  readonly wasmgpupropagator_getWidth: (a: number) => number;
  readonly wasmgpupropagator_new: (a: number, b: number, c: number, d: number) => any;
  readonly wasmgpupropagator_reset: (a: number, b: number, c: number) => [number, number];
  readonly wasmgpupropagator_run: (a: number, b: bigint) => any;
  readonly wasmgpupropagator_step: (a: number) => any;
  readonly wasmgpupropagator_totalMass: (a: number) => number;
  readonly wasmpropagator_getHeight: (a: number) => number;
  readonly wasmpropagator_getState: (a: number) => [number, number, number];
  readonly wasmpropagator_getStats: (a: number) => [number, number, number];
  readonly wasmpropagator_getStep: (a: number) => bigint;
  readonly wasmpropagator_getTime: (a: number) => number;
  readonly wasmpropagator_getWidth: (a: number) => number;
  readonly wasmpropagator_new: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly wasmpropagator_reset: (a: number, b: number, c: number) => [number, number];
  readonly wasmpropagator_run: (a: number, b: bigint) => void;
  readonly wasmpropagator_step: (a: number) => void;
  readonly wasmpropagator_totalMass: (a: number) => number;
  readonly init: () => void;
  readonly wasm_bindgen__convert__closures_____invoke__h79f9d13035c10189: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__hf6a99b71828d481c: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hc84ada7486e8d1b7: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
