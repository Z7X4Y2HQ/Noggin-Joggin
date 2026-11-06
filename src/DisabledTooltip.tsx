import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./DisabledTooltip.css";

type Active = { target: HTMLElement; reason: string; host: HTMLElement; dark: boolean };
export default function DisabledTooltip() {
  const [active, setActive] = useState<Active | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const clearHide = () => clearTimeout(hideTimer.current);
    function show(event: Event) {
      const node = event.target instanceof Element ? event.target : null;
      if (node?.closest(".disabled-action-tooltip")) { clearHide(); return; }
      const target = node?.closest<HTMLElement>("[data-disabled-reason]");
      const reason = target?.dataset.disabledReason;
      if (!target || !reason) return;
      clearHide();
      const host = target.closest<HTMLElement>("dialog[open]") ?? document.body;
      setActive(current => current?.target === target && current.reason === reason ? current
        : { target, reason, host, dark: Boolean(target.closest(".theme-dark")) });
    }
    function leave(event: Event) {
      const related = (event as MouseEvent | FocusEvent).relatedTarget;
      if (related instanceof Element && related.closest("[data-disabled-reason],.disabled-action-tooltip")) return;
      clearHide();
      hideTimer.current = setTimeout(() => setActive(current => current?.target === document.activeElement ? current : null), 120);
    }
    function blur(event: FocusEvent) {
      if (!(event.relatedTarget instanceof Element && event.relatedTarget.closest("[data-disabled-reason]"))) setActive(null);
    }
    const hide = () => { clearHide(); setActive(null); };
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // Let Escape dismiss a tooltip before closing its parent modal.
      if (document.querySelector(".disabled-action-tooltip")) { event.preventDefault(); event.stopPropagation(); hide(); }
    }
    const observer = new MutationObserver(() => setActive(current => {
      if (!current) return null;
      const reason = current.target.dataset.disabledReason;
      if (!current.target.isConnected || !reason || (current.host instanceof HTMLDialogElement && !current.host.open)) return null;
      return reason === current.reason ? current : { ...current, reason };
    }));
    observer.observe(document.body, { subtree: true, attributes: true, childList: true, attributeFilter: ["data-disabled-reason", "open"] });
    document.addEventListener("pointerover", show, true); document.addEventListener("pointermove", show, true); document.addEventListener("focusin", show, true);
    document.addEventListener("pointerout", leave, true); document.addEventListener("focusout", blur, true);
    document.addEventListener("keydown", escape, true); document.addEventListener("close", hide, true);
    window.addEventListener("resize", hide); window.addEventListener("scroll", hide, true);
    return () => { clearHide(); observer.disconnect(); document.removeEventListener("pointerover", show, true); document.removeEventListener("pointermove", show, true); document.removeEventListener("focusin", show, true);
      document.removeEventListener("pointerout", leave, true); document.removeEventListener("focusout", blur, true);
      document.removeEventListener("keydown", escape, true); document.removeEventListener("close", hide, true);
      window.removeEventListener("resize", hide); window.removeEventListener("scroll", hide, true); };
  }, []);

  useLayoutEffect(() => {
    if (!active || !tooltip.current) return;
    const anchor = active.target.getBoundingClientRect(), box = tooltip.current.getBoundingClientRect();
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft ?? 0, top = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? window.innerWidth, height = viewport?.height ?? window.innerHeight;
    const x = Math.max(left + 12, Math.min(anchor.left + anchor.width / 2 - box.width / 2, left + width - box.width - 12));
    let y = anchor.bottom + 8;
    if (y + box.height > top + height - 12) y = anchor.top - box.height - 8;
    setPosition({ left: x, top: Math.max(top + 12, Math.min(y, top + height - box.height - 12)) });
  }, [active]);

  if (!active) return null;
  return createPortal(<div ref={tooltip} className={"disabled-action-tooltip" + (active.dark ? " is-dark" : "")} role="tooltip"
    aria-labelledby={active.target.dataset.disabledDescription} style={position ?? { visibility: "hidden" }}>
    {active.reason}
  </div>, active.host);
}
