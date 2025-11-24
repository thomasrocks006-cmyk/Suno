import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  progress: number;
  duration: number;
  isPlaying: boolean;
  size?: 'mini' | 'full';
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  progress, 
  duration, 
  isPlaying,
  size = 'mini' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barCount = size === 'mini' ? 30 : 80;
    const barWidth = width / barCount;
    const progressRatio = duration > 0 ? progress / duration : 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        // Create pseudo-random but consistent waveform
        const seed = i * 0.5;
        const baseHeight = Math.sin(seed) * 0.3 + 0.5;
        const variation = Math.sin(seed * 3) * 0.2;
        const normalizedHeight = (baseHeight + variation) * height;

        // Animate if playing
        const animationOffset = isPlaying ? Math.sin(Date.now() * 0.003 + i * 0.2) * 5 : 0;
        const barHeight = Math.max(normalizedHeight + animationOffset, height * 0.1);

        // Color: cyan for played, gray for unplayed
        const barProgress = i / barCount;
        const isPlayed = barProgress <= progressRatio;
        
        ctx.fillStyle = isPlayed 
          ? 'rgba(34, 211, 238, 0.8)' // cyan-400
          : 'rgba(107, 114, 128, 0.4)'; // gray-500

        const x = i * barWidth;
        const y = (height - barHeight) / 2;
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress, duration, isPlaying, size]);

  if (size === 'mini') {
    return (
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={40}
        className="w-full h-full"
      />
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={120}
      className="w-full h-full"
    />
  );
};
