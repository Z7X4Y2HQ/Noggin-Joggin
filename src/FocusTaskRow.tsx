import { ActionButton } from "./ActionButton";
import type { SourceTask } from "./focus-tasks";

export default function FocusTaskRow({ task, inFocus, onFocus }: { task: SourceTask; inFocus: boolean; onFocus: () => void }) {
  return <div className={"essential-task" + (inFocus ? " is-in-focus" : "")} data-source-task-id={task.id}>
    <div className="roadmap-task">{task.label}{inFocus && <span className="focus-source-status">In Current Focus</span>}</div>
    <ActionButton className="focus-add-task" type="button" disabled={inFocus}
      disabledReason="This task is already in Current Focus. Complete or remove it there before adding it again."
      aria-label={inFocus ? task.label + " is already in Current Focus" : "Move " + task.label + " to Current Focus"} onClick={onFocus}>
      {inFocus ? "In Focus" : "+ Focus"}
    </ActionButton>
  </div>;
}
