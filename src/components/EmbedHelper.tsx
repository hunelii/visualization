import { useEffect } from 'react';

interface EmbedHelperProps {
  isEmbedded: boolean;
}

export const EmbedHelper: React.FC<EmbedHelperProps> = ({ isEmbedded }) => {
  useEffect(() => {
    if (!isEmbedded) return;

    let lastSentHeight = 0;
    let rafId: number | null = null;

    const reportHeight = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        // Measure the full scroll height of the document or main wrapper
        const el = document.getElementById('root') || document.body;
        const currentHeight = Math.ceil(el.getBoundingClientRect().height);

        // Threshold check to prevent jitter/infinite loop
        if (Math.abs(currentHeight - lastSentHeight) >= 3) {
          lastSentHeight = currentHeight;
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                type: 'huner:visualization:resize',
                height: currentHeight,
                timestamp: Date.now(),
              },
              '*'
            );
          }
        }
      });
    };

    // Report initial height
    reportHeight();

    // Observe size changes
    const resizeObserver = new ResizeObserver(() => {
      reportHeight();
    });

    const targetEl = document.getElementById('root') || document.body;
    resizeObserver.observe(targetEl);

    window.addEventListener('resize', reportHeight);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', reportHeight);
    };
  }, [isEmbedded]);

  return null;
};
