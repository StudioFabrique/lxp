import { type PropsWithChildren, useLayoutEffect, useRef } from "react";

export default function ParcoursStepContent({
  stepId,
  children,
}: PropsWithChildren<{ stepId: number }>) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousStepId = useRef(stepId);

  useLayoutEffect(() => {
    if (previousStepId.current === stepId) return;
    previousStepId.current = stepId;

    // Position the new step before paint. A smooth scroll can be interrupted
    // when the previous content disappears and async module cards arrive.
    contentRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [stepId]);

  return (
    <div
      ref={contentRef}
      // Keep the stepper reachable at the top even while the step is empty.
      className="w-full min-h-[calc(100dvh-2rem)] scroll-mt-4"
    >
      {children}
    </div>
  );
}
