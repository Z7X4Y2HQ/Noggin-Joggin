export type HeadingDraft = {
  id: string; title: string; description: string; period: string; startsOn: string; endsOn: string; taskCategoryId?: string | null;
  tasks: { id: string; label: string; completed?: boolean }[];
};

export function headingSnapshot(draft: HeadingDraft) {
  return JSON.stringify({ title: draft.title, description: draft.description, startsOn: draft.startsOn, endsOn: draft.endsOn,
    taskCategoryId: draft.taskCategoryId ?? null, tasks: draft.tasks.map(task => ({ id: task.id, label: task.label, completed: Boolean(task.completed) })) });
}

export function headingHasChanges(draft: HeadingDraft, baseline: string, pendingTask = "") {
  return headingSnapshot(draft) !== baseline || Boolean(pendingTask.trim());
}

export function headingValidationError(draft: HeadingDraft, pendingTask = "") {
  if (!draft.title.trim()) return "Enter a stage title before saving.";
  if (draft.title.length > 100 || draft.description.length > 2000) return "Shorten the stage title or description before saving.";
  if (draft.tasks.length + Number(Boolean(pendingTask.trim())) > 200) return "A stage can have up to 200 tasks.";
  if (draft.tasks.some(task => !task.label.trim() || task.label.length > 500) || pendingTask.trim().length > 500) return "Give every task a title of up to 500 characters.";
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z")) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
  if (Boolean(draft.startsOn) !== Boolean(draft.endsOn) || (draft.startsOn && (!validDate(draft.startsOn) || !validDate(draft.endsOn) || draft.startsOn >= draft.endsOn))) return "Choose both dates, with the end date on or after the start date.";
  return "";
}

export function prepareHeadingDraft(draft: HeadingDraft, pendingTask = "", makeId = () => crypto.randomUUID()) {
  const error = headingValidationError(draft, pendingTask);
  if (error) throw new Error(error);
  return { ...draft, title: draft.title.trim(), tasks: [
    ...draft.tasks.map(task => ({ ...task, label: task.label.trim() })),
    ...(pendingTask.trim() ? [{ id: makeId(), label: pendingTask.trim() }] : []),
  ] };
}

export async function persistHeadingDraft({ draft, pendingTask, stages, isNew, formatPeriod, flush, write }: {
  draft: HeadingDraft; pendingTask: string; stages: HeadingDraft[]; isNew: boolean;
  formatPeriod: (value: HeadingDraft) => string; flush: () => Promise<void>;
  write: (value: HeadingDraft[]) => Promise<{ version: number }>;
}) {
  const prepared = prepareHeadingDraft(draft, pendingTask);
  const saved = { ...prepared, period: formatPeriod(prepared) };
  const nextStages = isNew ? [...stages, saved] : stages.map(stage => stage.id === saved.id ? saved : stage);
  await flush();
  const result = await write(nextStages);
  return { nextStages, result };
}
