import { ActionButton as Button, ControlAvailability } from "./ActionButton";
import type { ReactNode } from "react";
import type { DevelopmentProfile } from "./game-development";
import { headingValidationError, type HeadingDraft } from "./heading-draft";
import TaskSuggestions, { type TaskCategory } from "./TaskSuggestions";
import DatePicker from "./DatePicker";
import { GameDialog } from "./GameControls";
import "./HeadingDialog.css";

function shiftDate(value: string, days: number) {
  return value ? new Date(Date.parse(`${value}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10) : "";
}

export default function HeadingDialog({ draft, isNew, headings, onSwitchHeading, onNewHeading, onRemove, pending, dirty, saveError,
  developmentProfile, taskCatalog, onAddSuggestion, timeZone = "Asia/Karachi", onChange, taskLabel, onTaskLabelChange,
  onAddTask, onSave, onClose, children }: {
  draft: HeadingDraft; isNew: boolean; headings: HeadingDraft[]; onSwitchHeading: (id: string) => void; onNewHeading: () => void;
  onRemove: () => void; pending: boolean; dirty: boolean; saveError: string; children?: ReactNode;
  developmentProfile?: DevelopmentProfile; taskCatalog: TaskCategory[]; onAddSuggestion: (label: string, categoryId: string) => void;
  timeZone?: string; onChange: (value: HeadingDraft) => void; taskLabel: string; onTaskLabelChange: (value: string) => void;
  onAddTask: () => void; onSave: () => Promise<void>; onClose: () => void;
}) {
  const validationError = headingValidationError(draft, taskLabel);
  return <GameDialog title={isNew ? "New roadmap stage" : "Roadmap stage"} className="heading-workspace-dialog" closeDisabled={pending} dismissOnBackdrop onClose={onClose}>
    <div className="heading-workspace-body">
      <aside className="heading-switcher">
        <span className="heading-switcher-label">ROADMAP STAGES</span>
        <p>Switch stages here. Unsaved changes are checked before leaving.</p>
        <nav aria-label="Choose a roadmap stage">{headings.map(heading => <Button type="button" key={heading.id} disabled={pending} disabledReason="Wait for this stage to finish saving."
          aria-current={heading.id === draft.id ? "true" : undefined} onClick={() => onSwitchHeading(heading.id)}>
          <span>{heading.title}</span><small>{heading.tasks.length} {heading.tasks.length === 1 ? "task" : "tasks"} · Add / edit tasks</small>
        </Button>)}</nav>
        <Button type="button" className="heading-switcher-new" disabled={pending || isNew} disabledReason={pending ? "Wait for this stage to finish saving." : "You are already creating a stage. Save or close this draft first."} onClick={onNewHeading}>+ New stage</Button>
      </aside>
      <div className="heading-workspace-main">
        <p className="heading-editor-state" role="status">{pending ? "Saving to server…" : dirty ? "Unsaved changes" : "No unsaved changes"}</p>
        {saveError && <p className="game-editor-error" role="alert">{saveError}</p>}
        <form className="game-editor heading-dialog-editor" onSubmit={event => { event.preventDefault(); if (!validationError && !pending) void onSave(); }}>
          <ControlAvailability disabled={pending} reason="Wait for this stage to finish saving."><fieldset className="heading-editor-fields" aria-disabled={pending}>
            <label>STAGE NAME<input autoFocus value={draft.title} maxLength={100} required placeholder="e.g. Build the first playable slice"
              disabled={pending} data-disabled-reason={pending ? "Wait for this stage to finish saving." : undefined} onChange={event => onChange({ ...draft, title: event.target.value })} /></label>
            <label>DESCRIPTION · OPTIONAL<textarea value={draft.description} maxLength={2000} rows={3}
              disabled={pending} data-disabled-reason={pending ? "Wait for this stage to finish saving." : undefined} onChange={event => onChange({ ...draft, description: event.target.value })} placeholder="What do you want to achieve?" /></label>
            <div className="game-editor-dates">
              <DatePicker label="START DATE · OPTIONAL" value={draft.startsOn} timeZone={timeZone} disabled={pending} onChange={value => onChange({ ...draft, startsOn: value })} />
              <DatePicker label="END DATE · OPTIONAL" value={shiftDate(draft.endsOn, -1)} min={draft.startsOn} timeZone={timeZone} disabled={pending}
                onChange={value => onChange({ ...draft, endsOn: shiftDate(value, 1) })} />
            </div>
            <fieldset className="heading-dialog-tasks">
              <legend>TASKS <span>{draft.tasks.length}</span></legend>
              {draft.tasks.length ? <ol>{draft.tasks.map((task, index) => <li key={task.id}>
                <span className="heading-dialog-task-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <input value={task.label} maxLength={500} required aria-label={`Task ${index + 1}`}
                  disabled={pending} data-disabled-reason={pending ? "Wait for this stage to finish saving." : undefined} onChange={event => onChange({ ...draft, tasks: draft.tasks.map(item => item.id === task.id ? { ...item, label: event.target.value } : item) })} />
                <Button type="button" className="heading-dialog-remove" aria-label={`Remove task ${index + 1}`}
                  onClick={() => onChange({ ...draft, tasks: draft.tasks.filter(item => item.id !== task.id) })}>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </Button>
              </li>)}</ol> : <p className="game-editor-help">Choose suggestions or write tasks for this stage.</p>}
              <TaskSuggestions disabled={pending} developmentProfile={developmentProfile} catalog={taskCatalog} categoryId={draft.taskCategoryId} headingTitle={draft.title}
                selectedLabels={draft.tasks.map(task => task.label)} onAdd={onAddSuggestion}
                onCategoryChange={taskCategoryId => onChange({ ...draft, taskCategoryId })} />
              <div className="heading-dialog-add-task">
                <input disabled={pending} data-disabled-reason={pending ? "Wait for this stage to finish saving." : undefined} value={taskLabel} maxLength={500} aria-label="New task" placeholder="Or write your own task"
                  onChange={event => onTaskLabelChange(event.target.value)}
                  onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); if (taskLabel.trim() && draft.tasks.length < 200) onAddTask(); } }} />
                <Button type="button" disabled={!taskLabel.trim() || draft.tasks.length >= 200} disabledReason={draft.tasks.length >= 200 ? "This stage has reached its 200-task limit. Remove a task before adding another." : "Type a task before adding it."} onClick={onAddTask}>Add task +</Button>
              </div>
            </fieldset>
            {validationError && <p className="heading-validation-help">{validationError}</p>}
            <div className="game-dialog-actions heading-editor-actions">
              {!isNew && <Button type="button" className="heading-editor-remove" onClick={onRemove}>Remove stage</Button>}
              <Button type="button" onClick={onClose}>Close</Button>
              <Button type="submit" className="game-primary" disabled={Boolean(validationError)} disabledReason={validationError}>{pending ? "Saving…" : isNew ? "Create stage" : "Save & close"}</Button>
            </div>
          </fieldset></ControlAvailability>
        </form>
      </div>
    </div>
    {children}
  </GameDialog>;
}
