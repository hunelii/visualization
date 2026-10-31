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
  const scrollToStage = useCallback((index: number, immediate = false) => {
    if (index < 0 || index >= stageCount) return;

    isProgrammaticScroll.current = true;
    onStageChangeRef.current(index);

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Target the specific stage element (desktop card or mobile card)
    const isMobile = window.innerWidth <= 980;
    const targetElement = isMobile
      ? document.querySelector(`[data-mobile-card-index="${index}"]`)
      : document.querySelector(`[data-stage-card-index="${index}"]`);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: immediate ? 'auto' : 'smooth',
        block: 'center',
      });
    }

    // Release programmatic lock after scroll settles
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, immediate ? 150 : 750);
  }, [stageCount]);

  // High-performance RAF scroll handler
  useEffect(() => {
    if (!enabled) return;

    let rafId: number | null = null;

    const evaluateActiveCard = () => {
      if (isProgrammaticScroll.current) return;

      const isMobile = window.innerWidth <= 980;
      const selector = isMobile ? '[data-mobile-card-index]' : '[data-stage-card-index]';
      const cards = document.querySelectorAll(selector);

      if (cards.length === 0) return;

      // Check boundary at very top of page
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY < 80) {
        if (activeStageIndexRef.current !== 0) {
          onStageChangeRef.current(0);
        }
        return;
      }

      const viewportFocusY = window.innerHeight * 0.42;
      let closestIdx = -1;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenterY - viewportFocusY);

        if (dist < minDistance) {
          minDistance = dist;
          const idxAttr = isMobile
            ? card.getAttribute('data-mobile-card-index')
            : card.getAttribute('data-stage-card-index');
          if (idxAttr !== null) {
            closestIdx = parseInt(idxAttr, 10);
          }
        }
      });

      if (closestIdx !== -1 && closestIdx !== activeStageIndexRef.current) {
        onStageChangeRef.current(closestIdx);
      }
    };

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        evaluateActiveCard();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled]);

  return { scrollToStage };
};
