import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Ellipsis } from "lucide-react";
import { publishChatbotDock, requestChatbotQuestionsClose, useChatbotDockSnapshot } from "../../features/chatbot/chatbot-dock-store";
import { bottomBarPlacement, isBottomBarReduced } from "../../features/module-preview/helpers/bottom-bar-placement";
import { useIsMobile } from "../../hooks/useMediaQuery";

type Props = {
  startActions?: ReactNode;
  endActions?: ReactNode;
  stickyActivationOffset?: number;
};

const FloatingBottomNavigation = ({
  startActions,
  endActions,
  stickyActivationOffset = 0,
}: Props) => {
  const activationOffset = Number.isFinite(stickyActivationOffset)
    ? Math.max(0, stickyActivationOffset)
    : 0;
  const [isDocked, setIsDocked] = useState(false);
  const [isDelayedStickyActive, setIsDelayedStickyActive] = useState(false);
  const dock = useChatbotDockSnapshot();
  const isMobile = useIsMobile();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isSticky = activationOffset === 0 || isDelayedStickyActive;

  useEffect(() => {
    const scrollRoot = sentinelRef.current?.closest("#main-scroll-container");
    const dockingObserver = new IntersectionObserver(
      ([entry]) => {
        setIsDocked(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsDelayedStickyActive(false);
        }
      },
      {
        root: scrollRoot,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      dockingObserver.observe(sentinelRef.current);
    }

    return () => dockingObserver.disconnect();
  }, []);

  useEffect(() => {
    if (activationOffset === 0) return;

    const scrollRoot = sentinelRef.current?.closest("#main-scroll-container");
    const activationObserver = new IntersectionObserver(
      ([entry]) => {
        setIsDelayedStickyActive(!entry.isIntersecting);
      },
      {
        root: scrollRoot,
        rootMargin: `0px 0px ${activationOffset}px 0px`,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      activationObserver.observe(sentinelRef.current);
    }

    return () => activationObserver.disconnect();
  }, [activationOffset]);

  // Mobile : comme la barre du module, elle reste en bas de l'écran et laisse sa place à l'assistant virtuel collé à un bord.
  useEffect(() => {
    if (!isMobile) return;
    publishChatbotDock({ hasBottomBar: true });
    return () => publishChatbotDock({ hasBottomBar: false });
  }, [isMobile]);

  if (isMobile) {
    // Questions de l'assistant ouvertes : la barre se réduit à un cercle, comme celle du module, qui les referme.
    const reduced = isBottomBarReduced(dock);
    return (
      <>
        {/* Réserve la place de la barre fixe en bas du contenu. */}
        <div className="h-20" aria-hidden="true" />
        <div
          className={cn(
            "fixed box-border flex items-center justify-between gap-2 rounded-full border border-base-300 bg-base-200/90 shadow-lg backdrop-blur transition-[left,right] duration-300 ease-out motion-reduce:transition-none [&_.btn]:rounded-full",
            reduced ? "z-[55] size-12 justify-center p-0" : "z-40 h-[62px] px-3 py-1.5",
          )}
          style={bottomBarPlacement(dock)}
        >
          {reduced ? (
            <button
              type="button"
              className="btn btn-secondary btn-circle size-full"
              aria-label="Revenir à l'affichage normal"
              onClick={requestChatbotQuestionsClose}
            >
              <Ellipsis className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">{startActions}</div>
              <div className="flex items-center gap-2">{endActions}</div>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(isSticky ? "sticky bottom-4 w-full md:w-[60vw]" : "w-full", "z-30 mt-12 p-3 md:p-4 rounded-2xl flex flex-wrap justify-between gap-3 mx-auto items-center border transition-all duration-500 ease-in-out", isDocked
            ? "bg-transparent backdrop-blur-none border-transparent shadow-none w-full md:w-full px-0 md:px-0"
            : "bg-base-200/90 backdrop-blur border-base-300 shadow-xl")}
      >
        <div className="flex items-center gap-2 md:gap-4">{startActions}</div>
        <div className="flex items-center gap-2 md:gap-4">{endActions}</div>
      </div>

      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
};

export default FloatingBottomNavigation;
