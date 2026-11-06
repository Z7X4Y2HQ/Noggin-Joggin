import { ActionButton as Button } from "./ActionButton";
import { dimensionOptions, tailorTaskIdeas, type DevelopmentProfile, type TaskIdea } from "./game-development";
import { useId, useState } from "react";
import "./TaskSuggestions.css";

export type TaskCategory = {
  id: string; title: string; description?: string;
  tasks: TaskIdea[];
};
const normalize = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function TaskSuggestions({ catalog, developmentProfile, categoryId, headingTitle, selectedLabels, onCategoryChange, onAdd, disabled = false }: {
  disabled?: boolean; catalog: TaskCategory[]; developmentProfile?: DevelopmentProfile; categoryId?: string | null; headingTitle: string; selectedLabels: string[];
  onCategoryChange: (id: string) => void; onAdd: (label: string, categoryId: string) => void;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(selectedLabels.length === 0);
  const [query, setQuery] = useState("");
  const [recommendedOnly, setRecommendedOnly] = useState(true);
  const [showOtherSystems, setShowOtherSystems] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const category = catalog.find(item => item.id === categoryId)
    ?? catalog.find(item => normalize(item.title) === normalize(headingTitle)) ?? catalog[0];
  if (!category) return null;
  const selected = new Set(selectedLabels.map(normalize));
  const tokens = normalize(query).split(" ").filter(Boolean);
  const ideas = tailorTaskIdeas(category.tasks, developmentProfile, showOtherSystems);
  const systems = developmentProfile?.gameplayFeatures ?? [];
  const gameType = dimensionOptions.find(option => option.id === developmentProfile?.gameDimension)?.label ?? "Not decided";
  const results = ideas.filter(task => (!recommendedOnly || task.recommended)
    && tokens.every(token => normalize(`${task.label} ${task.topic} ${task.outcome ?? ""}`).includes(token)));
  const recommendations = ideas.filter(task => task.recommended).length;
  const limitReached = selectedLabels.length >= 200;

  return <section className="task-suggestions" aria-label="Task suggestions">
    <Button type="button" className="task-library-toggle" aria-expanded={expanded} aria-controls={`${id}-library`} onClick={() => setExpanded(value => !value)}>
      <span><span className="task-library-overline">TASK LIBRARY</span><span>Browse task suggestions <small>{ideas.length}</small></span></span>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={expanded ? "is-open" : ""}><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Button>
    {expanded && <div className="task-library-panel" id={`${id}-library`}>
      <p className="task-library-intro">Build something playable, then check the result. Recommended tasks match your game type and selected systems; every added task can be edited.</p>
      <details className="task-category-menu">
        <summary><span><small>TASK LIST</small>{category.title}</span><span className="task-category-change">Change</span></summary>
        <div className="task-category-options">{catalog.map(item => <Button key={item.id} type="button" aria-pressed={item.id === category.id}
          onClick={event => { onCategoryChange(item.id); event.currentTarget.closest("details")?.removeAttribute("open"); }}>{item.title}<span>{item.tasks.length}</span></Button>)}</div>
      </details>
      <div className="task-profile-summary">
        <span>{gameType}{systems.length ? " · " + systems.length + (systems.length === 1 ? " game system" : " game systems") : " · General gameplay foundations"}</span>
        <p>{systems.length ? "Suggestions use your choices in Game settings." : "Choose game systems in Game settings to include mechanics such as combat, puzzles, or dialogue in Recommended."}</p>
        {gameType === "Not decided" && <p>Choose 2D or 3D in Game settings for dimension-specific recommendations.</p>}
        {systems.length > 0 && <Button type="button" aria-pressed={showOtherSystems} onClick={() => { setShowOtherSystems(value => !value); if (!showOtherSystems) setRecommendedOnly(false); }}>{showOtherSystems ? "Use my game systems" : "Explore other game systems"}</Button>}
      </div>
      <label className="task-search-label" htmlFor={`${id}-search`}>SEARCH THIS TASK LIST</label>
      <div className="task-search-box"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="m12.5 12.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <input id={`${id}-search`} type="search" disabled={disabled} data-disabled-reason={disabled ? "Wait for this stage to finish saving." : undefined} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search jump, health, camera, save…" autoComplete="off"
          onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); }} />
      </div>
      <div className="task-library-filters" aria-label="Suggestion filters">
        <Button type="button" aria-pressed={!recommendedOnly} onClick={() => setRecommendedOnly(false)}>All tasks <span>{ideas.length}</span></Button>
        <Button type="button" aria-pressed={recommendedOnly} onClick={() => setRecommendedOnly(true)}>Recommended <span>{recommendations}</span></Button>
      </div>
      <p className="task-result-count" role="status">{results.length} {results.length === 1 ? "suggestion" : "suggestions"}{query.trim() ? ` matching “${query.trim()}”` : ""}</p>
      {results.length ? <ul className="task-suggestion-results" aria-label={`Suggestions for ${category.title}`}>{results.map(task => {
        const added = selected.has(normalize(task.label));
        return <li key={task.id}>
          <div><div className="task-suggestion-meta"><span>{task.topic}</span>{task.dimensions?.length === 1 && <span className="task-dimension-badge">{task.dimensions[0].toUpperCase()}</span>}{task.recommended && <span className="task-recommended-badge">Recommended</span>}</div><p>{task.label}</p>{task.outcome && <p className="task-outcome"><strong>Done when</strong> {task.outcome}</p>}</div>
          <Button type="button" disabled={added || limitReached} disabledReason={added ? "This task is already added to this stage." : "This stage has reached its 200-task limit. Remove a task before adding another."} className={added ? "is-added" : ""} aria-label={added ? `${task.label}, already added` : `Add task: ${task.label}`}
            onClick={() => { onAdd(task.label, category.id); setAnnouncement(`Added ${task.label} to this stage.`); }}>{added ? "Added" : "+ Add"}</Button>
        </li>;
      })}</ul> : <p className="task-search-empty">No matching suggestions. Try All tasks, explore another system, or write your own task below.</p>}
      {limitReached && <p className="task-search-empty">This stage has reached its 200-task limit.</p>}
      <p className="task-library-note">Suggestions are optional. Add only what your game needs.</p>
    </div>}
    <span className="task-library-announcement" role="status" aria-live="polite">{announcement}</span>
  </section>;
}
