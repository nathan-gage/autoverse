// Flow Lenia Viewer Type Definitions

export interface SimulationConfig {
  width: number;
  height: number;
  channels: number;
  dt: number;
  kernel_radius: number;
  kernels: KernelConfig[];
  flow: FlowConfig;
}

export interface KernelConfig {
  radius: number;
  rings: RingConfig[];
  weight: number;
  mu: number;
  sigma: number;
  source_channel: number;
  target_channel: number;
}

export interface RingConfig {
  amplitude: number;
  distance: number;
  width: number;
}

export interface FlowConfig {
  beta_a: number;
  n: number;
  distribution_size: number;
}

export interface Seed {
  pattern: Pattern;
}

export type Pattern =
  | GaussianBlobPattern
  | MultiBlobPattern
  | NoisePattern
  | RingPattern
  | CustomPattern;

export interface GaussianBlobPattern {
  type: "GaussianBlob";
  center: [number, number];
  radius: number;
  amplitude: number;
  channel: number;
}

export interface MultiBlobPattern {
  type: "MultiBlob";
  blobs: Array<{
    center: [number, number];
    radius: number;
    amplitude: number;
    channel: number;
  }>;
}

export interface NoisePattern {
  type: "Noise";
  seed: number;
  amplitude: number;
  channel: number;
}

export interface RingPattern {
  type: "Ring";
  center: [number, number];
  inner_radius: number;
  outer_radius: number;
  amplitude: number;
  channel: number;
}

export interface CustomPattern {
  type: "Custom";
  points: Array<{
    x: number;
    y: number;
    channel: number;
    value: number;
  }>;
}

export interface SimulationState {
  channels: number[][];
  width: number;
  height: number;
  time: number;
  step: number;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  region: PresetRegion;
  createdAt: number;
}

export interface PresetRegion {
  width: number;
  height: number;
  channels: number[][];
  sourceX: number;
  sourceY: number;
}

export interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface DraggedCreature {
  preset: Preset;
  offsetX: number;
  offsetY: number;
}

export type InteractionMode = "view" | "select" | "draw" | "erase";

export interface ViewerSettings {
  colorScheme: "grayscale" | "thermal" | "viridis";
  showGrid: boolean;
  showSelection: boolean;
  brushSize: number;
  brushIntensity: number;
}
