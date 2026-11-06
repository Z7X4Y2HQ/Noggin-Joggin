import { ActionButton as Button } from "./ActionButton";
import DevelopmentProfileFields from "./DevelopmentProfileFields";
import type { DevelopmentProfile } from "./game-development";
import DatePicker from "./DatePicker";
import { useId, useLayoutEffect, useRef, useState } from "react";
import "./GameControls.css";
import GamePlanWizard from "./GamePlanWizard";
import type {PlanProfile} from "./plan-types";
import type {GameDimension} from "./game-development";

export type Game = DevelopmentProfile & { documentationVersion:number;planCatalogVersion:string|null;planProfile:PlanProfile|null;enabledModules:string[]|null; id: string; name: string; timeZone: string; version: number; focusVersion: number; dueAt: string | null; deadlineDate: string | null; deadlineTime: string | null };
export type GameValues = DevelopmentProfile & { name: string; timeZone: string; deadlineDate: string; deadlineTime: string;planProfile?:PlanProfile;enabledModules?:string[];previewToken?:string };
type Summary = { id: string; name: string };

export function GameDialog({ title, children, onClose, className = "", closeDisabled = false, dismissOnBackdrop = false }: { title: string; children: React.ReactNode; onClose: () => void; className?: string; closeDisabled?: boolean; dismissOnBackdrop?: boolean }) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className={"game-dialog " + className} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); event.stopPropagation(); if (!closeDisabled) onClose(); }}
    onClick={event => { if (!dismissOnBackdrop || closeDisabled || !ref.current || event.target !== ref.current) return; const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { event.stopPropagation(); onClose(); } }}>
    <div className="game-dialog-heading"><h2 id={titleId}>{title}</h2><Button type="button" disabled={closeDisabled} disabledReason="Wait for the current action to finish before closing." aria-label="Close dialog" onClick={onClose}>×</Button></div>
    {children}
  </dialog>;
}

function GameDeletionDialog({ game, onDelete, onClose }: { game: Game; onDelete: () => Promise<void>; onClose: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <GameDialog title="Delete this game?" closeDisabled={pending} onClose={() => { if (!pending) onClose(); }}>
    <p className="game-dialog-intro">Permanently delete <strong>{game.name}</strong> and its notes, roadmap stages, tasks, focus items, and deadline. This cannot be undone.</p>
    <p className="game-editor-help">Another saved game will open after deletion.</p>
    {error && <p className="game-editor-error" role="alert">{error}</p>}
    <div className="game-dialog-actions">
      <Button type="button" autoFocus disabled={pending} disabledReason="Wait for the current action to finish." onClick={onClose}>Keep game</Button>
      <Button type="button" className="game-danger" disabled={pending} disabledReason="Wait for the current action to finish." onClick={async () => {
        setPending(true); setError("");
        try { await onDelete(); onClose(); }
        catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete this game."); }
        finally { setPending(false); }
      }}>{pending ? "Deleting…" : "Delete game"}</Button>
    </div>
  </GameDialog>;
}

function GameEditor({ game, onSave, onClose, onRequestDelete, canDelete }: { game?: Game; onSave: (values: GameValues) => Promise<void>; onClose: () => void; onRequestDelete: () => void; canDelete: boolean }) {
  const [name, setName] = useState(game?.name ?? "");
  const [developmentProfile, setDevelopmentProfile] = useState<DevelopmentProfile>({ gameDimension: game?.gameDimension ?? "unspecified", gameplayFeatures: game?.gameplayFeatures ?? [] });
  const [deadlineDate, setDate] = useState(game?.deadlineDate ?? "");
  const [deadlineTime, setTime] = useState(game?.deadlineTime ?? "23:59");
  const [timeZone, setZone] = useState(game?.timeZone ?? "Asia/Karachi");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <GameDialog title={game ? "Game settings" : "Start another game"} closeDisabled={pending} onClose={() => { if (!pending) onClose(); }}>
    <p className="game-dialog-intro">{game ? "Your deadline, roadmap, and notes belong to this game." : "Start with the complete documentation index and prompts. Notes start blank, with empty production roadmap stages ready to customize."}</p>
    <form className="game-editor" onSubmit={async event => {
      event.preventDefault(); setPending(true); setError("");
      try { await onSave({ name, deadlineDate, deadlineTime, timeZone, ...developmentProfile }); onClose(); }
      catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save game."); }
      finally { setPending(false); }
    }}>
      <label>GAME NAME<input autoFocus value={name} maxLength={120} required onChange={event => setName(event.target.value)} placeholder="Your game's working title" /></label>
      {game?.planProfile ? <p className="game-editor-help">Use Customize game plan to review changes to your game’s systems, documentation and roadmaps.</p> : <DevelopmentProfileFields value={developmentProfile} onChange={setDevelopmentProfile} disabled={pending} />}
      <div className="game-editor-dates">
        <DatePicker label="TARGET DATE · OPTIONAL" value={deadlineDate} onChange={setDate} timeZone={timeZone} disabled={pending} />
        <label>TARGET TIME<input type="time" value={deadlineTime} disabled={!deadlineDate} data-disabled-reason={!deadlineDate ? "Choose a target date before setting its time." : undefined} required={Boolean(deadlineDate)} onChange={event => setTime(event.target.value)} /></label>
      </div>
      <label>TIMEZONE<input value={timeZone} required list="game-timezones" onChange={event => setZone(event.target.value)} /></label>
      <datalist id="game-timezones"><option value="Asia/Karachi" /><option value="UTC" /><option value="Europe/London" /><option value="America/New_York" /></datalist>
      <p className="game-editor-help">The countdown ends at the exact date and time above, in this timezone. Leave the date empty if you do not have a deadline yet.</p>
      {error && <p className="game-editor-error" role="alert">{error}</p>}
      <div className="game-dialog-actions"><Button type="button" disabled={pending} disabledReason="Wait for the current action to finish." onClick={onClose}>Cancel</Button><Button className="game-primary" disabled={pending || !name.trim()} disabledReason={pending ? "Wait for this game to finish saving." : "Enter a game name before saving."} type="submit">{pending ? "Saving..." : game ? "Save game" : "Create game"}</Button></div>
    </form>
    {game && <section className="game-delete-section" aria-label="Delete game">
      <h3>Delete game</h3>
      <p>Remove this game and all of its saved content.</p>
      <Button type="button" className="game-delete-control" disabled={pending || !canDelete} disabledReason={pending ? "Wait for this game to finish saving." : "Create another game before deleting the last remaining game."} aria-describedby={!canDelete ? "last-game-help" : undefined} onClick={onRequestDelete}>Delete game</Button>
      {!canDelete && <p id="last-game-help" className="game-last-game-help">You must keep at least one game. Create another game before deleting this one.</p>}
    </section>}
  </GameDialog>;
}

export default function GameControls({ games, current, onSwitch, onCreate, onUpdate, onDelete,token,onApplyPlan }: {
  token?:string;onApplyPlan:(profile:PlanProfile,dimension:GameDimension,enabledModules:string[],previewToken:string)=>Promise<void>;
  games: Summary[]; current: Game | null; onSwitch: (id: string) => Promise<void>;
  onCreate: (values: GameValues) => Promise<void>; onUpdate: (values: GameValues) => Promise<void>; onDelete: () => Promise<void>;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [editor, setEditor] = useState<"new" | "settings" | "delete" | "plan" | null>(null);
  const [error, setError] = useState("");
  const [switching, setSwitching] = useState(false);
  return <div className="game-controls">
    <span className="game-controls-label">CURRENT GAME</span>
    <details className="game-picker" ref={ref}>
      <summary><span className="game-picker-name">{current?.name ?? "Choose a game"}</span>
        <svg className="game-picker-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </summary>
      <div className="game-picker-list" role="group" aria-label="Choose game">
        {games.map(game => <Button type="button" key={game.id} disabled={switching} disabledReason="Wait for the selected game to finish opening." className={game.id === current?.id ? "is-selected" : ""}
          onClick={async () => { setSwitching(true); setError(""); try { await onSwitch(game.id); if (ref.current) ref.current.open = false; } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not switch games."); } finally { setSwitching(false); } }}>
          {game.name}{game.id === current?.id && <span aria-hidden="true">✓</span>}
        </Button>)}
      </div>
    </details>
    <div className="game-controls-actions"><Button type="button" onClick={() => setEditor("new")}>+ New game</Button><Button type="button" onClick={() => setEditor("settings")}>Game settings</Button><Button type="button" onClick={()=>setEditor("plan")}>Customize game plan</Button></div>
    {error && <p className="game-editor-error" role="alert">{error}</p>}
    {editor === "delete" && current && <GameDeletionDialog game={current} onDelete={onDelete} onClose={() => setEditor(null)} />}
    {(editor==="new"||editor==="plan")&&<GamePlanWizard game={editor==="plan"?current??undefined:undefined} token={token} onCreate={onCreate} onApply={onApplyPlan} onClose={()=>setEditor(null)}/>}
    {editor === "settings" && <GameEditor game={current ?? undefined} onSave={onUpdate} onClose={() => setEditor(null)} onRequestDelete={() => setEditor("delete")} canDelete={games.length > 1} />}
  </div>;
}
