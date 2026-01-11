export enum ToolMode {
  VIEW = 'VIEW',
  SELECT = 'SELECT',
  DRAW = 'DRAW',
  ERASE = 'ERASE',
}

export interface SimulationStats {
  step: number;
  time: number;
  mass: number;
  fps: number;
}

export interface BrushSettings {
  size: number;
  intensity: number;
}
