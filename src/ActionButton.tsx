import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from "react";
import "./DisabledTooltip.css";

const AvailabilityContext = createContext<string | null>(null);
export function ControlAvailability({ disabled, reason, children }: { disabled: boolean; reason: string; children: ReactNode }) {
  const inherited = useContext(AvailabilityContext);
  return <AvailabilityContext.Provider value={disabled ? reason : inherited}>{children}</AvailabilityContext.Provider>;
}

type Props = ComponentPropsWithRef<"button"> & { disabledReason?: string };
export function ActionButton({ disabled = false, disabledReason, onClick, onKeyDown, title, children, ...props }: Props) {
  const inherited = useContext(AvailabilityContext);
  const reasonId = useId();
  const unavailable = disabled || Boolean(inherited) || props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const reason = unavailable ? inherited || disabledReason || title || "This action is currently unavailable." : undefined;
  return <>
    <button {...props} title={unavailable ? undefined : title} aria-disabled={unavailable || undefined}
      aria-describedby={[props["aria-describedby"], unavailable ? reasonId : undefined].filter(Boolean).join(" ") || undefined}
      data-disabled-reason={reason} data-disabled-description={unavailable ? reasonId : undefined}
      onClick={event => { if (unavailable) { event.preventDefault(); event.stopPropagation(); return; } onClick?.(event); }}
      onKeyDown={event => { if (unavailable && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); event.stopPropagation(); return; } onKeyDown?.(event); }}>
      {children}
    </button>
    {unavailable && <span id={reasonId} className="disabled-control-description">{reason}</span>}
  </>;
}
