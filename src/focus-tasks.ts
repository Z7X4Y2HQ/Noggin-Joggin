export type FocusEntry = { id: string; title: string; url: string; completed?: boolean; sourceTaskId?: string | null };
export type SourceTask = { id: string; label: string };

export function isTaskInFocus(items: FocusEntry[], taskId: string) {
  return items.some(item => !item.completed && (item.sourceTaskId === taskId || item.id === taskId));
}

export function addSourceTaskToFocus(items: FocusEntry[], task: SourceTask, sourceTaskId = task.id, url = "", makeId = () => crypto.randomUUID()) {
  // Guard in the state update too, so two clicks before a repaint cannot reorder or duplicate an active task.
  if (items.some(item => !item.completed && (item.sourceTaskId === sourceTaskId || item.id === task.id))) return items;
  const existing = items.find(item => item.sourceTaskId === sourceTaskId || item.id === task.id);
  const next: FocusEntry = existing ? { ...existing, sourceTaskId, completed: false }
    : { id: makeId(), sourceTaskId, title: task.label.replace(/^(Now|Next) — /, ""), url };
  return [...items.filter(item => !item.completed && item.id !== next.id), next,
    ...items.filter(item => item.completed && item.id !== next.id)];
}
