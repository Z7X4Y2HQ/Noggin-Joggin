import { ActionButton as Button } from "./ActionButton";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { addDays, calendarDays, clampDate, dateKey, inRange, makeDate, moveMonth, parseDate, todayInZone, minimumSelectableDate } from "./calendar-date";
import "./DatePicker.css";

type Mode = "days" | "months" | "years";
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = Array.from({ length: 12 }, (_, month) => makeDate(2024, month).toLocaleDateString("en", { month: "long", timeZone: "UTC" }));
const format = (value: string, long = false) => parseDate(value)!.toLocaleDateString("en", { day: "numeric", month: long ? "long" : "short", year: "numeric", timeZone: "UTC" });

export default function DatePicker({ label, value, onChange, min: providedMin = "", max = "", timeZone = "Asia/Karachi", disabled = false }: {
  label: string; value: string; onChange: (value: string) => void; min?: string; max?: string; timeZone?: string; disabled?: boolean;
}) {
  const id = useId();
  const [now, setNow] = useState(() => new Date());
  const today = todayInZone(timeZone, now);
  const min = minimumSelectableDate(providedMin, timeZone, now);
  const initial = clampDate(parseDate(value) ? value : today, min, max);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(initial);
  const [focused, setFocused] = useState(initial);
  const [mode, setMode] = useState<Mode>("days");
  const [position, setPosition] = useState<{ left: number; top: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusPending = useRef(false);
  const current = parseDate(view)!;
  const year = current.getUTCFullYear(), month = current.getUTCMonth();
  const firstYear = Math.floor((year - 1) / 12) * 12 + 1;
  const years = Array.from({ length: 12 }, (_, index) => firstYear + index).filter(number => number <= 9999);
  const days = calendarDays(view);

  function intersects(first: string, last: string) { return (!min || last >= min) && (!max || first <= max); }
  function monthAllowed(y: number, m: number) {
    return y >= 1 && y <= 9999 && intersects(dateKey(makeDate(y, m)), dateKey(makeDate(y, m + 1, 0)));
  }
  function yearAllowed(y: number) { return y >= 1 && y <= 9999 && intersects(`${String(y).padStart(4, "0")}-01-01`, `${String(y).padStart(4, "0")}-12-31`); }
  function navigationTarget(direction: number) {
    const amount = mode === "days" ? direction : mode === "months" ? direction * 12 : direction * 144;
    const candidate = moveMonth(view, amount);
    const parsed = parseDate(candidate);
    if (!parsed) return null;
    const targetYear = parsed.getUTCFullYear(), targetMonth = parsed.getUTCMonth();
    const allowed = mode === "days" ? monthAllowed(targetYear, targetMonth) : mode === "months" ? yearAllowed(targetYear)
      : Array.from({ length: 12 }, (_, index) => Math.floor((targetYear - 1) / 12) * 12 + 1 + index).some(yearAllowed);
    return allowed ? candidate : null;
  }
  const previous = navigationTarget(-1), next = navigationTarget(1);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }
  function show() {
    if (disabled) return;
    const current = new Date();
    setNow(current);
    const selected = clampDate(parseDate(value) ? value : todayInZone(timeZone, current), minimumSelectableDate(providedMin, timeZone, current), max);
    setView(selected); setFocused(selected); setMode("days"); setPosition(null);
    focusPending.current = true; setOpen(true);
  }
  function select(key: string) {
    const current = new Date();
    setNow(current);
    if (inRange(key, minimumSelectableDate(providedMin, timeZone, current), max)) { onChange(key); close(); }
  }
  function focusDay(key: string) {
    const target = clampDate(key, min, max);
    if (!parseDate(target)) return;
    setFocused(target); setView(target); focusPending.current = true;
  }
  function dayKeyDown(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    let target = "";
    if (event.key === "ArrowLeft") target = addDays(key, -1);
    if (event.key === "ArrowRight") target = addDays(key, 1);
    if (event.key === "ArrowUp") target = addDays(key, -7);
    if (event.key === "ArrowDown") target = addDays(key, 7);
    if (event.key === "Home") target = addDays(key, -((parseDate(key)!.getUTCDay() + 6) % 7));
    if (event.key === "End") target = addDays(key, 6 - ((parseDate(key)!.getUTCDay() + 6) % 7));
    if (event.key === "PageUp") target = moveMonth(key, event.shiftKey ? -12 : -1);
    if (event.key === "PageDown") target = moveMonth(key, event.shiftKey ? 12 : 1);
    if (target) { event.preventDefault(); focusDay(target); }
  }
  function choiceKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const buttons = [...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>("button:not(:disabled):not([aria-disabled=true])")];
    const index = buttons.indexOf(event.currentTarget);
    const movement: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    const target = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key in movement ? (index + movement[event.key] + buttons.length) % buttons.length : -1;
    if (target >= 0) { event.preventDefault(); buttons[target]?.focus(); }
  }

  useEffect(() => {
    if (!open) return;
    const refresh = () => {
      const current = new Date();
      setNow(previous => todayInZone(timeZone, previous) === todayInZone(timeZone, current) ? previous : current);
      const liveMin = minimumSelectableDate(providedMin, timeZone, current);
      const focusedDay = document.activeElement instanceof HTMLElement ? document.activeElement.dataset.calendarDay : undefined;
      if (focusedDay && !inRange(focusedDay, liveMin, max)) focusPending.current = true;
      setFocused(previous => clampDate(previous, liveMin, max));
      setView(previous => clampDate(previous, liveMin, max));
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh); document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [open, providedMin, max, timeZone]);

  useLayoutEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    dialog.showModal();
    function place() {
      const rect = triggerRef.current!.getBoundingClientRect();
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0, top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth, height = viewport?.height ?? window.innerHeight;
      const popupWidth = Math.min(328, width - 24), popupHeight = Math.min(dialog.scrollHeight + 2, height - 24);
      let popupTop = rect.bottom + 8;
      if (popupTop + popupHeight > top + height - 12 && rect.top - popupHeight - 8 >= top + 12) popupTop = rect.top - popupHeight - 8;
      popupTop = Math.max(top + 12, Math.min(popupTop, top + height - popupHeight - 12));
      const nextPosition = { left: Math.max(left + 12, Math.min(rect.left, left + width - popupWidth - 12)), top: popupTop, width: popupWidth };
      setPosition(previousPosition => JSON.stringify(previousPosition) === JSON.stringify(nextPosition) ? previousPosition : nextPosition);
    }
    place();
    const observer = new ResizeObserver(place); observer.observe(dialog); observer.observe(triggerRef.current!);
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    return () => { observer.disconnect(); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); window.visualViewport?.removeEventListener("resize", place); dialog.close(); };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !position || !focusPending.current) return;
    const selector = mode === "days" ? `[data-calendar-day="${focused}"]` : mode === "months" ? `[data-calendar-month="${month}"]:not(:disabled):not([aria-disabled=true])` : `[data-calendar-year="${year}"]:not(:disabled):not([aria-disabled=true])`;
    const target = dialogRef.current?.querySelector<HTMLButtonElement>(selector) ?? dialogRef.current?.querySelector<HTMLButtonElement>(".calendar-choices button:not(:disabled):not([aria-disabled=true])");
    target?.focus({ preventScroll: true }); focusPending.current = false;
  }, [open, position, focused, mode, month, year]);

  return <div className="date-picker-field">
    <label className="date-picker-label" id={`${id}-label`} htmlFor={`${id}-trigger`}>{label}</label>
    <Button ref={triggerRef} id={`${id}-trigger`} type="button" disabled={disabled} disabledReason="Wait for changes to finish saving before selecting a date." className={`date-picker-trigger${open ? " is-open" : ""}`}
      aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-popup` : undefined} onClick={show}>
      <span id={`${id}-value`} className={value ? "" : "date-picker-placeholder"}>{parseDate(value) ? format(value) : "Choose date"}</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="6" width="16" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M8 3v6m8-6v6M4 11h16M8 15h2m4 0h2M8 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </Button>
    <dialog ref={dialogRef} id={`${id}-popup`} className="calendar-popup" aria-labelledby={`${id}-title`} aria-describedby={`${id}-help`}
      style={position ?? { visibility: "hidden" }}
      onCancel={event => { event.preventDefault(); event.stopPropagation(); close(); }}
      onClick={event => { if (event.target !== dialogRef.current) return; const rect = dialogRef.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { event.stopPropagation(); close(); } }}>
      <div className="calendar-heading"><div><span className="calendar-eyebrow">{label.replace(/\s*·.*$/, "")}</span><h2 className="calendar-title" id={`${id}-title`}>Choose a date</h2></div>
        <Button className="calendar-icon-button" type="button" aria-label="Close calendar" onClick={close}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></Button>
      </div>
      <p id={`${id}-help`} className="sr-only">Use arrow keys to move between dates, Page Up or Page Down to change month, and Enter to select. Escape closes the calendar.</p>
      <div className="calendar-navigation">
        <Button className="calendar-icon-button" type="button" disabled={!previous} disabledReason="No earlier dates are available in the allowed range." aria-label={mode === "days" ? "Previous month" : mode === "months" ? "Previous year" : "Previous 12 years"} onClick={() => { if (previous) { setView(previous); setFocused(clampDate(previous, min, max)); } }}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
        <div className="calendar-period" id={`${id}-period`} aria-live="polite">
          <Button type="button" aria-label="Choose month" aria-pressed={mode === "months"} onClick={() => { setMode(mode === "months" ? "days" : "months"); focusPending.current = true; }}>{months[month]}</Button>
          <Button type="button" aria-label="Choose year" aria-pressed={mode === "years"} onClick={() => { setMode(mode === "years" ? "days" : "years"); focusPending.current = true; }}>{year}</Button>
        </div>
        <Button className="calendar-icon-button" type="button" disabled={!next} disabledReason="No later dates are available in the allowed range." aria-label={mode === "days" ? "Next month" : mode === "months" ? "Next year" : "Next 12 years"} onClick={() => { if (next) { setView(next); setFocused(clampDate(next, min, max)); } }}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
      </div>
      {mode === "days" ? <table className="calendar-grid" role="grid" aria-labelledby={`${id}-period`}>
        <thead><tr>{weekdays.map(day => <th key={day} scope="col" abbr={day}>{day.slice(0, 2)}</th>)}</tr></thead>
        <tbody>{Array.from({ length: 6 }, (_, week) => <tr key={week}>{days.slice(week * 7, week * 7 + 7).map(day => {
          const key = dateKey(day), valid = inRange(key, min, max), selected = key === value;
          return <td key={key} role="gridcell" aria-selected={selected}>
            <Button type="button" className={`calendar-day${day.getUTCMonth() !== month ? " is-outside" : ""}${key === today ? " is-today" : ""}${selected ? " is-selected" : ""}`}
              disabled={!valid} disabledReason={key < today ? "Past dates cannot be selected. Choose today or a later date." : min && key < min ? "Choose a date on or after " + format(min) + "." : max && key > max ? "Choose a date on or before " + format(max) + "." : "This date is outside the allowed range."} tabIndex={key === focused && valid ? 0 : -1} data-calendar-day={key}
              aria-label={parseDate(key) ? format(key, true) : "Unavailable date"} aria-current={key === today ? "date" : undefined}
              onFocus={() => setFocused(key)} onKeyDown={event => dayKeyDown(event, key)} onClick={() => select(key)}>{day.getUTCDate()}</Button>
          </td>;
        })}</tr>)}</tbody>
      </table> : <div><p className="calendar-choice-caption">{mode === "months" ? "Choose a month" : `${firstYear} – ${years.at(-1)}`}</p>
        <div className="calendar-choices">{mode === "months" ? months.map((name, index) => <Button key={name} type="button" data-calendar-month={index} disabled={!monthAllowed(year, index)} disabledReason="This month has no dates in the allowed range." className={month === index ? "is-selected" : ""} onKeyDown={choiceKeyDown}
          onClick={() => { const target = clampDate(dateKey(makeDate(year, index)), min, max); setView(target); setFocused(target); setMode("days"); focusPending.current = true; }}>{name.slice(0, 3)}</Button>)
          : years.map(number => <Button key={number} type="button" data-calendar-year={number} disabled={!yearAllowed(number)} disabledReason="This year has no dates in the allowed range." className={number === year ? "is-selected" : ""} onKeyDown={choiceKeyDown}
            onClick={() => { setView(dateKey(makeDate(number, month))); setMode("months"); focusPending.current = true; }}>{number}</Button>)}</div>
      </div>}
      <div className="calendar-footer"><Button type="button" onClick={() => select(today)} disabled={!inRange(today, min, max)} disabledReason="Today is outside the allowed date range.">Today</Button><span>{parseDate(value) ? format(value) : "No date selected"}</span><Button type="button" disabled={!value} disabledReason="There is no selected date to clear." onClick={() => { onChange(""); close(); }}>Clear</Button></div>
    </dialog>
  </div>;
}
