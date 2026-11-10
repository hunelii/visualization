import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollStageSpyOptions {
  stageCount: number;
  initialStageIndex?: number;
  enabled?: boolean;
}

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

export const useScrollStageSpy = ({
  stageCount,
  initialStageIndex = 0,
  enabled = true,
}: UseScrollStageSpyOptions) => {
  const maxIndex = Math.max(1, stageCount - 1);

  const [continuousStage, setContinuousStage] = useState<number>(initialStageIndex);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(initialStageIndex);

  const targetStageRef = useRef<number>(initialStageIndex);
  const currentStageRef = useRef<number>(initialStageIndex);
  const activeIndexRef = useRef<number>(initialStageIndex);
  const rafIdRef = useRef<number | null>(null);
  const isProgrammaticRef = useRef<boolean>(false);
  const programmaticTimerRef = useRef<number | null>(null);

  const startAnimationLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const tick = () => {
      const target = targetStageRef.current;
      const current = currentStageRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.002) {
        const next = current + diff * 0.18;
        currentStageRef.current = next;
        setContinuousStage(next);

        const rounded = clamp(Math.round(next), 0, maxIndex);
        if (rounded !== activeIndexRef.current) {
          activeIndexRef.current = rounded;
          setActiveStageIndex(rounded);
        }
        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        currentStageRef.current = target;
        setContinuousStage(target);
        const rounded = clamp(Math.round(target), 0, maxIndex);
        if (rounded !== activeIndexRef.current) {
          activeIndexRef.current = rounded;
          setActiveStageIndex(rounded);
        }
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [maxIndex]);

  const getMaxScroll = () => {
    if (typeof window === 'undefined') return 0;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    return Math.max(0, docHeight - window.innerHeight);
  };

  // Jump or smooth-scroll to a specific stage (0..7)
  const scrollToStage = useCallback(
    (index: number, immediate = false) => {
      const clampedIdx = clamp(index, 0, maxIndex);
      targetStageRef.current = clampedIdx;

      if (immediate) {
        currentStageRef.current = clampedIdx;
        activeIndexRef.current = clampedIdx;
        setContinuousStage(clampedIdx);
        setActiveStageIndex(clampedIdx);
      } else {
        startAnimationLoop();
      }

      const maxScroll = getMaxScroll();
      if (maxScroll > 20 && typeof window !== 'undefined') {
        isProgrammaticRef.current = true;
        if (programmaticTimerRef.current !== null) {
          window.clearTimeout(programmaticTimerRef.current);
        }

        const targetScrollY = (clampedIdx / maxIndex) * maxScroll;
        window.scrollTo({
          top: targetScrollY,
          behavior: immediate ? 'auto' : 'smooth',
        });

        programmaticTimerRef.current = window.setTimeout(
          () => {
            isProgrammaticRef.current = false;
          },
          immediate ? 80 : 650
        );
      }
    },
    [maxIndex, startAnimationLoop]
  );

  // Continuous scrub (0.0 -> 1.0) from timeline drag
  const scrubToProgress = useCallback(
    (progress0to1: number) => {
      const clampedProgress = clamp(progress0to1, 0, 1);
      const targetStage = clampedProgress * maxIndex;
      targetStageRef.current = targetStage;
      startAnimationLoop();

      const maxScroll = getMaxScroll();
      if (maxScroll > 20 && typeof window !== 'undefined') {
        isProgrammaticRef.current = true;
        if (programmaticTimerRef.current !== null) {
          window.clearTimeout(programmaticTimerRef.current);
        }
        window.scrollTo({
          top: clampedProgress * maxScroll,
          behavior: 'auto',
        });
        programmaticTimerRef.current = window.setTimeout(() => {
          isProgrammaticRef.current = false;
        }, 120);
      }
    },
    [maxIndex, startAnimationLoop]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (isProgrammaticRef.current) return;
      const maxScroll = getMaxScroll();
      if (maxScroll <= 20) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const ratio = clamp(scrollY / maxScroll, 0, 1);
      targetStageRef.current = ratio * maxIndex;
      startAnimationLoop();
    };

    // Direct wheel support when embedded or when page is not tall enough to scroll natively
    const handleWheel = (e: WheelEvent) => {
      const maxScroll = getMaxScroll();
      if (maxScroll > 20) {
        // Native page scroll handles it
        return;
      }
      if (Math.abs(e.deltaY) < 2 && Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const stepDelta = clamp(delta * 0.0045, -0.65, 0.65);
      targetStageRef.current = clamp(targetStageRef.current + stepDelta, 0, maxIndex);
      startAnimationLoop();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
    };
  }, [enabled, maxIndex, startAnimationLoop]);

  return {
    continuousStage,
    activeStageIndex,
    scrollProgress: continuousStage / maxIndex,
    scrollToStage,
    scrubToProgress,
  };
};
