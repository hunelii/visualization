import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollStageSpyOptions {
  stageCount: number;
  initialStageIndex?: number;
  enabled?: boolean;
}

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

/**
 * Converts raw continuous progress (0..7) into a "dwell-plateau" stage value (0..7).
 * Within each stage [i, i+1]:
 * - The first 62% of scroll distance holds the camera on stage `i` (plateau),
 *   allowing the user to dwell on the station while its internal mechanics animate.
 * - The remaining 38% smoothly transitions the camera & conduit to stage `i+1`.
 */
const applyStageDwellCurve = (rawProgress: number, maxIndex: number): number => {
  const clamped = clamp(rawProgress, 0, maxIndex);
  const baseIdx = Math.floor(clamped);
  if (baseIdx >= maxIndex) return maxIndex;

  const frac = clamped - baseIdx;
  const dwellRatio = 0.62; // 62% of scroll within each step stays parked on the station

  if (frac <= dwellRatio) {
    // Subtle micro-movement (0 -> 0.08) so station internal elements animate while camera holds still
    return baseIdx + (frac / dwellRatio) * 0.08;
  } else {
    // Smooth S-curve transition (0.08 -> 1.0) across the remaining 38%
    const t = (frac - dwellRatio) / (1 - dwellRatio);
    const smoothT = t * t * (3 - 2 * t);
    return baseIdx + 0.08 + smoothT * 0.92;
  }
};

export const useScrollStageSpy = ({
  stageCount,
  initialStageIndex = 0,
  enabled = true,
}: UseScrollStageSpyOptions) => {
  const maxIndex = Math.max(1, stageCount - 1);

  const [continuousStage, setContinuousStage] = useState<number>(initialStageIndex);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(initialStageIndex);
  // 0..1 progress of how long the user has dwelled inside the current active stage
  const [stageDwellProgress, setStageDwellProgress] = useState<number>(0);

  const rawProgressRef = useRef<number>(initialStageIndex);
  const targetStageRef = useRef<number>(initialStageIndex);
  const currentStageRef = useRef<number>(initialStageIndex);
  const activeIndexRef = useRef<number>(initialStageIndex);

  const lastScrollYRef = useRef<number>(0);
  const latchUntilTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isProgrammaticRef = useRef<boolean>(false);
  const programmaticTimerRef = useRef<number | null>(null);

  const getMaxScroll = () => {
    if (typeof window === 'undefined') return 0;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    return Math.max(0, docHeight - window.innerHeight);
  };

  // Sync native browser scroll position to match our gated rawProgressRef
  const syncWindowScrollToRaw = useCallback(
    (rawVal: number) => {
      const maxScroll = getMaxScroll();
      if (maxScroll <= 20 || typeof window === 'undefined') return;
      const targetY = (clamp(rawVal, 0, maxIndex) / maxIndex) * maxScroll;
      lastScrollYRef.current = targetY;
      window.scrollTo({ top: targetY, behavior: 'auto' });
    },
    [maxIndex]
  );

  const startAnimationLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const tick = () => {
      const target = targetStageRef.current;
      const current = currentStageRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0015) {
        const next = current + diff * 0.16;
        currentStageRef.current = next;
        setContinuousStage(next);

        const rounded = clamp(Math.round(next), 0, maxIndex);
        if (rounded !== activeIndexRef.current) {
          activeIndexRef.current = rounded;
          setActiveStageIndex(rounded);
        }

        // Compute dwell progress within the active stage (0..1)
        const rawInStage = clamp(rawProgressRef.current - rounded + 0.15, 0, 1);
        setStageDwellProgress(rawInStage);

        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        currentStageRef.current = target;
        setContinuousStage(target);
        const rounded = clamp(Math.round(target), 0, maxIndex);
        if (rounded !== activeIndexRef.current) {
          activeIndexRef.current = rounded;
          setActiveStageIndex(rounded);
        }
        const rawInStage = clamp(rawProgressRef.current - rounded + 0.15, 0, 1);
        setStageDwellProgress(rawInStage);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [maxIndex]);

  // Step-gated advance: advances rawProgressRef but latches at every integer stage boundary
  const advanceRawProgressWithStageLatch = useCallback(
    (deltaStages: number, fromNativeScroll = false) => {
      if (deltaStages === 0) return;

      const now = performance.now();
      // If currently latched on a newly reached stage, absorb fast scroll momentum
      if (now < latchUntilTimeRef.current) {
        if (fromNativeScroll) {
          syncWindowScrollToRaw(rawProgressRef.current);
        }
        return;
      }

      const prevRaw = rawProgressRef.current;
      // Cap per-event delta so a single hard flick cannot jump huge distances
      const cappedDelta = clamp(deltaStages, -0.22, 0.22);
      let nextRaw = clamp(prevRaw + cappedDelta, 0, maxIndex);

      const prevStageInt = Math.floor(prevRaw + 0.08);
      const nextStageInt = Math.floor(nextRaw + 0.08);

      // Forward boundary crossing: stop and latch right on the new stage!
      if (cappedDelta > 0 && nextStageInt > prevStageInt) {
        const boundaryStage = Math.min(maxIndex, prevStageInt + 1);
        nextRaw = boundaryStage;
        // Hold at this stage for 550ms even if scroll continues
        latchUntilTimeRef.current = now + 550;
      }
      // Backward boundary crossing: stop and latch on the previous stage!
      else if (cappedDelta < 0 && Math.ceil(nextRaw - 0.08) < Math.ceil(prevRaw - 0.08)) {
        const boundaryStage = Math.max(0, Math.ceil(prevRaw - 0.08) - 1);
        nextRaw = boundaryStage;
        latchUntilTimeRef.current = now + 550;
      }

      rawProgressRef.current = nextRaw;
      targetStageRef.current = applyStageDwellCurve(nextRaw, maxIndex);

      if (fromNativeScroll) {
        syncWindowScrollToRaw(nextRaw);
      }

      startAnimationLoop();
    },
    [maxIndex, startAnimationLoop, syncWindowScrollToRaw]
  );

  // Explicit jump to a specific stage (from clicking a station, milestone dot, or arrow keys)
  const scrollToStage = useCallback(
    (index: number, immediate = false) => {
      const clampedIdx = clamp(index, 0, maxIndex);
      rawProgressRef.current = clampedIdx;
      targetStageRef.current = clampedIdx;
      latchUntilTimeRef.current = performance.now() + 350;

      if (immediate) {
        currentStageRef.current = clampedIdx;
        activeIndexRef.current = clampedIdx;
        setContinuousStage(clampedIdx);
        setActiveStageIndex(clampedIdx);
        setStageDwellProgress(0.25);
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
        lastScrollYRef.current = targetScrollY;
        window.scrollTo({
          top: targetScrollY,
          behavior: immediate ? 'auto' : 'smooth',
        });

        programmaticTimerRef.current = window.setTimeout(
          () => {
            isProgrammaticRef.current = false;
            lastScrollYRef.current = window.scrollY || window.pageYOffset;
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
      rawProgressRef.current = targetStage;
      targetStageRef.current = targetStage;
      latchUntilTimeRef.current = 0;
      startAnimationLoop();

      const maxScroll = getMaxScroll();
      if (maxScroll > 20 && typeof window !== 'undefined') {
        isProgrammaticRef.current = true;
        if (programmaticTimerRef.current !== null) {
          window.clearTimeout(programmaticTimerRef.current);
        }
        const targetY = clampedProgress * maxScroll;
        lastScrollYRef.current = targetY;
        window.scrollTo({
          top: targetY,
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

    lastScrollYRef.current = window.scrollY || window.pageYOffset;

    // Intercept wheel events directly so we can enforce smooth stage-by-stage dwelling & latching
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1 && Math.abs(e.deltaX) < 1) return;
      e.preventDefault();

      const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      // Normalize wheel delta so trackpad and mouse wheel both advance gradually through the stage dwell zone
      const stepDelta = clamp(rawDelta * 0.0022, -0.16, 0.16);
      advanceRawProgressWithStageLatch(stepDelta, true);
    };

    // Fallback for touch scroll / scrollbar drag on devices without wheel events
    const handleScroll = () => {
      if (isProgrammaticRef.current) return;
      const maxScroll = getMaxScroll();
      if (maxScroll <= 20) return;

      const currentY = window.scrollY || window.pageYOffset;
      const dy = currentY - lastScrollYRef.current;
      if (Math.abs(dy) < 2) return;

      lastScrollYRef.current = currentY;
      const deltaStages = (dy / maxScroll) * maxIndex;
      advanceRawProgressWithStageLatch(deltaStages, true);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
    };
  }, [enabled, maxIndex, advanceRawProgressWithStageLatch]);

  return {
    continuousStage,
    activeStageIndex,
    stageDwellProgress,
    scrollProgress: continuousStage / maxIndex,
    scrollToStage,
    scrubToProgress,
  };
};
