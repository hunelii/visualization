import { useEffect, useRef, useCallback } from 'react';

interface UseScrollStageSpyOptions {
  stageCount: number;
  activeStageIndex: number;
  onStageChange: (index: number) => void;
  enabled?: boolean;
}

export const useScrollStageSpy = ({
  stageCount,
  activeStageIndex,
  onStageChange,
  enabled = true,
}: UseScrollStageSpyOptions) => {
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const activeStageIndexRef = useRef(activeStageIndex);
  activeStageIndexRef.current = activeStageIndex;

  const onStageChangeRef = useRef(onStageChange);
  onStageChangeRef.current = onStageChange;

  // Programmatic scroll to a specific stage card
  const scrollToStage = useCallback((index: number) => {
    if (index < 0 || index >= stageCount) return;

    isProgrammaticScroll.current = true;
    onStageChangeRef.current(index);

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Target the specific stage element (desktop card or mobile card)
    const targetElement =
      document.querySelector(`[data-stage-card-index="${index}"]`) ||
      document.querySelector(`[data-mobile-card-index="${index}"]`);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    // Release the lock after smooth scroll settles
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, [stageCount]);

  // Setup IntersectionObserver for scroll-driven detection
  useEffect(() => {
    if (!enabled) return;

    // Observe both desktop and mobile stage cards
    const cardElements = document.querySelectorAll(
      '[data-stage-card-index], [data-mobile-card-index]'
    );

    if (cardElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const viewportFocusY = window.innerHeight * 0.45;
        let closestIndex = -1;
        let minDistance = Infinity;

        // Check intersecting cards and pick the one nearest to viewport focus line
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const cardCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenterY - viewportFocusY);

            if (distance < minDistance) {
              minDistance = distance;
              const indexStr =
                entry.target.getAttribute('data-stage-card-index') ||
                entry.target.getAttribute('data-mobile-card-index');
              if (indexStr !== null) {
                closestIndex = parseInt(indexStr, 10);
              }
            }
          }
        });

        if (closestIndex !== -1 && closestIndex !== activeStageIndexRef.current) {
          onStageChangeRef.current(closestIndex);
        }
      },
      {
        root: null,
        // Broad observation zone so cards are tracked smoothly during fast scroll
        rootMargin: '-15% 0px -25% 0px',
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      }
    );

    cardElements.forEach((el) => observer.observe(el));

    // Handle scroll boundary edges (top & bottom)
    const handleScrollEdges = () => {
      if (isProgrammaticScroll.current) return;
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY < 60 && activeStageIndexRef.current !== 0) {
        onStageChangeRef.current(0);
      }
    };

    window.addEventListener('scroll', handleScrollEdges, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollEdges);
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled]);

  return { scrollToStage };
};
