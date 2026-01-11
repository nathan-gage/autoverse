import React, { useRef, useEffect, useState } from 'react';
import { BrushSettings, ToolMode } from '../types';

interface SimulationCanvasProps {
  playing: boolean;
  speed: number;
  toolMode: ToolMode;
  brushSettings: BrushSettings;
  onStatsUpdate: (stats: { mass: number }) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  playing,
  speed,
  toolMode,
  brushSettings,
  onStatsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gridRef = useRef<Float32Array>();
  const bufferRef = useRef<Float32Array>();
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  
  // Initialize grid
  useEffect(() => {
    const width = 256; // Internal resolution (scaled up via CSS)
    const height = 256;
    const size = width * height;
    
    // Using Float32 for continuous values (0.0 to 1.0)
    gridRef.current = new Float32Array(size);
    bufferRef.current = new Float32Array(size);

    // Initial Random Seed - "Big Bang"
    for (let i = 0; i < size; i++) {
        if (Math.random() > 0.98) {
             gridRef.current[i] = Math.random();
        } else {
             gridRef.current[i] = 0;
        }
    }
  }, []);

  // Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create ImageData once
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    
    let lastTime = performance.now();
    let accumulator = 0;

    const render = () => {
      const grid = gridRef.current;
      const buffer = bufferRef.current;
      if (!grid || !buffer) return;

      const data = imgData.data;

      // Color mapping (Bio-luminescent palette)
      for (let i = 0; i < grid.length; i++) {
        const val = grid[i];
        const idx = i * 4;
        
        // Render: Map 0-1 to Colors
        // 0 = Black
        // 0.1-0.4 = Deep Cyan
        // 0.5-0.7 = Bright Green
        // 0.8-1.0 = White/Magenta
        
        if (val < 0.01) {
          data[idx] = 5;     // R
          data[idx + 1] = 5; // G
          data[idx + 2] = 5; // B
          data[idx + 3] = 255; // Alpha
        } else {
          // Organic coloring function
          const r = Math.floor(val * val * 200); // Only high values get red (magenta shift)
          const g = Math.floor(val * 255);       // Green dominant
          const b = Math.floor(Math.sin(val * Math.PI) * 255); // Blue peak in middle
          
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    const update = () => {
       const grid = gridRef.current;
       const buffer = bufferRef.current;
       if (!grid || !buffer) return;

       const w = width;
       const h = height;
       let totalMass = 0;

       // Simple Reaction-Diffusion / Smoothed Life approximation
       for (let y = 0; y < h; y++) {
         for (let x = 0; x < w; x++) {
           const i = y * w + x;
           
           // Simple 3x3 Convolution (Moore Neighborhood)
           let sum = 0;
           let count = 0;

           for (let dy = -1; dy <= 1; dy++) {
             for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                // Wrap around coords
                let nx = (x + dx + w) % w;
                let ny = (y + dy + h) % h;
                
                sum += grid[ny * w + nx];
                count++;
             }
           }
           
           const avg = sum / count;
           const current = grid[i];
           
           // Rules: 
           // If mostly empty neighbors, decay (Death)
           // If moderate neighbors, grow (Life)
           // If too many neighbors, decay (Overpopulation)
           
           let next = current;
           
           // "Organic" ruleset
           if (avg > 0.15 && avg < 0.35) {
               next += 0.05 * speed; // Growth
           } else if (avg >= 0.35) {
               next -= 0.08 * speed; // Overpopulation death
           } else {
               next -= 0.01 * speed; // Decay
           }
           
           // Clamp
           next = Math.max(0, Math.min(1, next));
           
           // Add simple noise occasionally for "mutation"
           if (Math.random() < 0.0001) next = 1.0;

           buffer[i] = next;
           totalMass += next;
         }
       }

       // Swap buffers
       for (let k = 0; k < grid.length; k++) {
         grid[k] = buffer[k];
       }
       
       onStatsUpdate({ mass: Math.floor(totalMass) });
    };
    
    const handleInteraction = () => {
        if (!mouseRef.current.down || !gridRef.current) return;
        
        const grid = gridRef.current;
        const w = width;
        const h = height;
        
        // Map canvas coords to grid coords
        const rect = canvas.getBoundingClientRect();
        // The canvas is scaled via CSS, so we need to account for that
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        
        const mx = Math.floor((mouseRef.current.x - rect.left) * scaleX);
        const my = Math.floor((mouseRef.current.y - rect.top) * scaleY);
        
        const brushSize = Math.floor(brushSettings.size / 2); // size 10 -> radius 5
        const intensity = brushSettings.intensity / 100;
        
        if (toolMode === ToolMode.DRAW || toolMode === ToolMode.ERASE) {
            const val = toolMode === ToolMode.DRAW ? intensity : 0;
            
            for (let dy = -brushSize; dy <= brushSize; dy++) {
                for (let dx = -brushSize; dx <= brushSize; dx++) {
                    if (dx*dx + dy*dy <= brushSize*brushSize) {
                        const nx = (mx + dx + w) % w;
                        const ny = (my + dy + h) % h;
                        grid[ny * w + nx] = val;
                    }
                }
            }
        }
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      handleInteraction();

      if (playing) {
          update();
      }
      
      render();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [playing, speed, toolMode, brushSettings]);

  // Event Listeners
  const handleMouseDown = (e: React.MouseEvent) => {
      mouseRef.current.down = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
  };
  
  const handleMouseUp = () => {
      mouseRef.current.down = false;
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};

export default SimulationCanvas;
