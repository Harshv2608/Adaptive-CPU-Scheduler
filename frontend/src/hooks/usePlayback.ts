import { useState, useEffect, useRef, useCallback } from 'react';

export function usePlayback(maxTime: number) {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const togglePlayback = () => {
    if (time >= maxTime && !isPlaying) {
      setTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const jumpTo = (t: number) => {
    setTime(Math.min(Math.max(t, 0), maxTime));
  };

  const step = useCallback((timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;

    const dt = timestamp - lastUpdateRef.current;
    
    // 1 tick = 1000ms / speed. e.g. at 1x speed, 1 second per tick. at 4x speed, 250ms per tick.
    const tickDuration = 1000 / speed;

    if (dt >= tickDuration) {
      setTime(prev => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
      lastUpdateRef.current = timestamp;
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(step);
    }
  }, [isPlaying, maxTime, speed]);

  useEffect(() => {
    if (isPlaying) {
      lastUpdateRef.current = performance.now();
      animationRef.current = requestAnimationFrame(step);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, step]);

  const stepForward = useCallback(() => {
    setTime(prev => Math.min(prev + 1, maxTime));
  }, [maxTime]);

  const stepBackward = useCallback(() => {
    setTime(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayback();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayback, stepForward, stepBackward]);

  return { time, isPlaying, speed, setSpeed, togglePlayback, restart, jumpTo, stepForward, stepBackward };
}
