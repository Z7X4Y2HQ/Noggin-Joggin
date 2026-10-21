import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { articles } from "./content";
import "./App.css";
const sections = [...new Set(articles.map((article) => article.section))];
const themeStorageKey = "noggin-joggin-theme";
const focusStorageKey = "noggin-joggin-current-focus";
const roadmapPlanStorageKey = "noggin-joggin-roadmap-plan";
const demoDeadline = new Date(2027, 9, 1);

type FieldValues = Record<string, string>;
type FocusItem = {
  id: string;
  title: string;
  url: string;
  completed?: boolean;
  sourceTaskId?: string;
};
type RoadmapTask = { id: string; label: string };
type RoadmapStage = {
  id: string;
  period: string;
  startsOn: string;
  endsOn: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
};
type RoadmapStageDraft = Pick<RoadmapStage, "id" | "title" | "tasks">;
type CurriculumPhase = {
  id: string;
  title: string;
  topics: RoadmapTask[];
};
type SearchResult = {
  article: (typeof articles)[number];
  fieldId: string;
  fieldLabel: string;
  excerpt: string;
  isNote: boolean;
};

const roadmapStages: RoadmapStage[] = [
  {
    id: "learn",
    period: "OCT–DEC 2026",
    startsOn: "2026-10-01",
    endsOn: "2027-01-01",
    title: "Finish the essentials",
    description:
      "Aim for working familiarity, not mastery: follow this order and make small experiments. If a topic takes longer, carry it into the vertical slice instead of delaying the demo to finish a course.",
    tasks: [
      { id: "controller", label: "Build your own character controller using what you learned about movement" },
      { id: "character", label: "Create one usable player character and connect its movement/animation" },
      { id: "scene-management", label: "Learn the scene/loading flow needed to move through the demo" },
      { id: "environment", label: "Build one small environment for the vertical slice" },
      { id: "film-color-theory", label: "Learn cinematography basics, film language, and color theory" },
      { id: "cinemachine", label: "Learn Cinemachine for framing, camera moves, and transitions" },
      { id: "timeline", label: "Learn Timeline and make one small story cutscene" },
      { id: "visual-pass", label: "Choose a realism/stylization target; practice lighting and materials" },
    ],
  },
  {
    id: "vertical-slice",
    period: "JAN–MAR 2027",
    startsOn: "2027-01-01",
    endsOn: "2027-04-01",
    title: "Make a complete first slice",
    description:
      "Choose a contained story premise and prove the whole experience before making more content. This is the key go/no-go checkpoint.",
    tasks: [
      { id: "story-scope", label: "Set the story scope: one protagonist, a few characters, one compact setting" },
      { id: "narrative-loop", label: "Build dialogue, choices, and a small number of consequences" },
      { id: "vertical-slice", label: "Finish a 5–8 minute playable beginning-to-end slice" },
      { id: "playtest-slice", label: "Playtest it and cut features that do not support the story" },
    ],
  },
  {
    id: "demo-content",
    period: "APR–JUN 2027",
    startsOn: "2027-04-01",
    endsOn: "2027-07-01",
    title: "Build the 20–30 minute demo",
    description:
      "Expand the proven slice into one short, coherent narrative adventure. Prefer a few meaningful decisions over expensive branching paths.",
    tasks: [
      { id: "story-complete", label: "Write and lock the demo's beginning, middle, and ending" },
      { id: "content-complete", label: "Build the complete 20–30 minute playable route" },
      { id: "save-load", label: "Add only the save/load behavior the demo actually needs" },
      { id: "content-playtest", label: "Playtest for pacing, clarity, and a reliable start-to-finish run" },
    ],
  },
  {
    id: "presentation",
    period: "JUL–AUG 2027",
    startsOn: "2027-07-01",
    endsOn: "2027-09-01",
    title: "Polish the presentation",
    description:
      "Apply the camera, cutscene, and visual foundations from the essentials to the finished demo. Keep animation and facial work within the character and scene count you can finish.",
    tasks: [
      { id: "audio-subtitles", label: "Add essential audio, readable subtitles, and basic accessibility options" },
    ],
  },
  {
    id: "release-prep",
    period: "SEP–OCT 2027",
    startsOn: "2027-09-01",
    endsOn: "2027-11-01",
    title: "Optimize, test, and ship a demo build",
    description:
      "Put interface and optimization polish here after the story is playable. Reserve the remaining time for fixes and packaging, not new systems. Confirm the official Next Fest dates separately.",
    tasks: [
      { id: "ui-basics", label: "Finish the demo UI: menus, dialogue, subtitles, and essential settings" },
      { id: "performance", label: "Profile and fix the biggest performance or loading problems" },
      { id: "qa", label: "Test a clean start-to-finish build on a target PC" },
      { id: "bugfix", label: "Fix blockers and leave time for a final regression pass" },
      { id: "build", label: "Create and verify the demo build and store materials" },
    ],
  },
];

function loadSavedRoadmapStages(): RoadmapStage[] {
  const saved = localStorage.getItem(roadmapPlanStorageKey);
  if (!saved) return roadmapStages;
  return JSON.parse(saved) as RoadmapStage[];
}

const optionalCurriculum: CurriculumPhase[] = [
  {
    id: "core-systems",
    title: "Phase 1 — Core game systems",
    topics: [
      { id: "architecture", label: "1.1 Game architecture" },
      { id: "scriptable-objects", label: "1.2 ScriptableObjects & data-driven design" },
      { id: "events", label: "1.3 Events" },
      { id: "state-machines", label: "1.4 State machines" },
      { id: "interaction-system", label: "1.5 Interaction system" },
      { id: "scene-management", label: "1.6 Scene management" },
      { id: "save-load", label: "1.7 Save/load" },
      { id: "input-system", label: "1.8 Input System" },
    ],
  },
  {
    id: "characters",
    title: "Phase 2 — Characters",
    topics: [
      { id: "character-creation", label: "2.1 Character creation" },
      { id: "animation", label: "2.2 Animation" },
      { id: "animation-rigging", label: "2.3 Animation Rigging / IK" },
      { id: "facial-animation", label: "2.4 Facial animation" },
      { id: "lip-sync", label: "2.5 Lip sync" },
      { id: "npc-ai", label: "2.6 NPC AI / NavMesh" },
    ],
  },
  {
    id: "world",
    title: "Phase 3 — World",
    topics: [
      { id: "environment-building", label: "3.1 Environment building" },
      { id: "terrain", label: "3.2 Terrain" },
      { id: "lighting", label: "3.3 Lighting" },
      { id: "materials-pbr", label: "3.4 Materials / PBR" },
      { id: "vfx", label: "3.5 VFX" },
      { id: "audio", label: "3.6 Audio" },
    ],
  },
  {
    id: "narrative",
    title: "Phase 4 — Narrative",
    topics: [
      { id: "dialogue-system", label: "4.1 Dialogue system" },
      { id: "choices", label: "4.2 Choices" },
      { id: "branching-narrative", label: "4.3 Branching narrative" },
      { id: "game-state", label: "4.4 Game-state variables" },
      { id: "consequences", label: "4.5 Consequences" },
      { id: "narrative-save-load", label: "4.6 Save/load narrative state" },
    ],
  },
  {
    id: "cinematic",
    title: "Phase 5 — Cinematic",
    topics: [
      { id: "timeline", label: "5.1 Timeline" },
      { id: "cinemachine", label: "5.2 Cinemachine" },
      { id: "cutscene-architecture", label: "5.3 Cutscene architecture" },
      { id: "camera-transitions", label: "5.4 Camera transitions" },
      { id: "animation-sequencing", label: "5.5 Animation sequencing" },
      { id: "facial-voice-sync", label: "5.6 Facial/voice/subtitle synchronization" },
    ],
  },
  {
    id: "presentation",
    title: "Phase 6 — Presentation",
    topics: [
      { id: "ui", label: "6.1 UI" },
      { id: "menus", label: "6.2 Menus" },
      { id: "dialogue-ui", label: "6.3 Dialogue UI" },
      { id: "subtitles", label: "6.4 Subtitles" },
      { id: "settings", label: "6.5 Settings" },
      { id: "accessibility", label: "6.6 Accessibility" },
    ],
  },
  {
    id: "performance",
    title: "Phase 7 — Performance",
    topics: [
      { id: "profiler", label: "7.1 Profiler" },
      { id: "memory-profiler", label: "7.2 Memory Profiler" },
      { id: "lod", label: "7.3 LOD" },
      { id: "occlusion", label: "7.4 Occlusion" },
      { id: "addressables", label: "7.5 Addressables" },
      { id: "async-scene-loading", label: "7.6 Async scene loading" },
      { id: "asset-optimization", label: "7.7 Texture/mesh/audio optimization" },
    ],
  },
  {
    id: "advanced-unity",
    title: "Phase 8 — Advanced Unity",
    topics: [
      { id: "jobs", label: "8.1 Jobs" },
      { id: "burst", label: "8.2 Burst" },
      { id: "dots-ecs", label: "8.3 DOTS / ECS" },
      { id: "multithreading", label: "8.4 Multithreading" },
      { id: "advanced-rendering", label: "8.5 Advanced rendering" },
    ],
  },
  {
    id: "production",
    title: "Phase 9 — Production",
    topics: [
      { id: "version-control", label: "9.1 Git / version control" },
      { id: "build-pipeline", label: "9.2 Build pipeline" },
      { id: "pc-optimization", label: "9.3 PC build optimization" },
      { id: "crash-logging", label: "9.4 Crash/error logging" },
      { id: "testing", label: "9.5 Testing" },
      { id: "debugging-tools", label: "9.6 Debugging tools" },
    ],
  },
];

const roadmapResources = [
  {
    title: "Motion Matching for Unity",
    description: "Reference documentation for the system you're learning now.",
    href: "https://motion-matching-for-unity.readthedocs.io/en/latest/",
  },
  {
    title: "Learned Motion Matching",
    description: "Unity Asset Store package to explore after the current series.",
    href: "https://assetstore.unity.com/packages/tools/animation/learned-motion-matching-312510",
  },
  {
    title: "Ubisoft: Learned Motion Matching",
    description: "Background on Ubisoft La Forge's learned approach.",
    href: "https://www.ubisoft.com/en-us/studio/laforge/news/6xXL85Q3bF2vEj76xmnmIu/introducing-learned-motion-matching",
  },
  {
    title: "Khronos: Procedural Animation & IK",
    description: "Physics-driven leaning tutorial; save for the focused animation study.",
    href: "https://github.khronos.org/Vulkan-Site/tutorial/latest/Advanced_glTF/Procedural_Animation_IK/06_physics_driven_lean.html",
  },
  {
    title: "Aikodex",
    description: "Tools for real-time animated storytelling.",
    href: "https://www.aikodex.com/",
  },
];

const currentMotionMatchingSeries =
  "https://www.youtube.com/watch?v=7MPeKDD6TgI&list=PLV3KWwaS27WJqBeZCOVp1h5VKTshdrQrk&index=7";

function readSavedFocusItems(): FocusItem[] {
  const saved = localStorage.getItem(focusStorageKey);
  if (!saved) {
    return [
      {
        id: "motion-matching",
        title: "Motion Matching for Unity (MxM)",
        url: currentMotionMatchingSeries,
      },
      { id: "procedural-animation", title: "Procedural animation and IK/FK", url: "" },
    ];
  }
  const parsed: unknown = JSON.parse(saved);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.url === "string" &&
        (item.completed === undefined || typeof item.completed === "boolean") &&
        (item.sourceTaskId === undefined || typeof item.sourceTaskId === "string"),
    )
  ) {
    throw new Error("Saved current-focus list has an invalid format.");
  }
  return parsed;
}

function getExternalUrl(value: string): string | null {
  if (!value.trim()) return "";
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

type UrlState = { articleId: string; fieldId: string; cursor: number };

function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);
  return {
    articleId: params.get("page") ?? "doc-1",
    fieldId: params.get("field") ?? "",
    cursor: Number(params.get("cursor") ?? 0),
  };
}

function writeUrlState(articleId: string, fieldId = "", cursor = 0) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", articleId);
  if (fieldId) {
    url.searchParams.set("field", fieldId);
    url.searchParams.set("cursor", String(cursor));
  } else {
    url.searchParams.delete("field");
    url.searchParams.delete("cursor");
  }
  window.history.replaceState({}, "", url);
}

function NoteField({
  fieldId,
  label,
  value,
  focusOnLoad,
  cursor,
  onChange,
  onCursorChange,
}: {
  fieldId: string;
  label: string;
  value: string;
  focusOnLoad: boolean;
  cursor: number;
  onChange: (fieldId: string, value: string) => void;
  onCursorChange: (fieldId: string, cursor: number) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    inputRef.current.style.height = `${Math.max(inputRef.current.scrollHeight, 31)}px`;
  };

  useEffect(() => resize(), [value]);
  useEffect(() => {
    if (!focusOnLoad || !inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.setSelectionRange(cursor, cursor);
  }, [cursor, focusOnLoad]);

  return (
    <label className="field-row">
      <span>{label}</span>
      <textarea
        ref={inputRef}
        value={value}
        onFocus={(event) =>
          onCursorChange(fieldId, event.currentTarget.selectionStart)
        }
        onSelect={(event) =>
          onCursorChange(fieldId, event.currentTarget.selectionStart)
        }
        onChange={(event) => {
          onChange(fieldId, event.target.value);
          onCursorChange(fieldId, event.target.selectionStart);
        }}
        placeholder="Write here..."
        rows={1}
      />
    </label>
  );
}

function App() {
  const [initialUrlState] = useState(readUrlState);
  const [focusedField, setFocusedField] = useState({
    fieldId: initialUrlState.fieldId,
    cursor: initialUrlState.cursor,
  });
  const [activeId, setActiveId] = useState(initialUrlState.articleId);
  const [query, setQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(themeStorageKey) === "dark",
  );
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [editableRoadmapStages, setEditableRoadmapStages] =
    useState<RoadmapStage[]>(loadSavedRoadmapStages);
  const [roadmapStageDraft, setRoadmapStageDraft] =
    useState<RoadmapStageDraft | null>(null);
  const [newRoadmapTaskLabel, setNewRoadmapTaskLabel] = useState("");
  const [focusItems, setFocusItems] = useState<FocusItem[]>(readSavedFocusItems);
  const [focusError, setFocusError] = useState("");
  const [editingFocusId, setEditingFocusId] = useState("");
  const [draggingFocusId, setDraggingFocusId] = useState("");
  const draggedFocusIdRef = useRef("");
  const [countdownNow, setCountdownNow] = useState(() => new Date());
  const [saveState, setSaveState] = useState("Loading notes...");
  const notesLoaded = useRef(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const activeArticle =
    articles.find((article) => article.id === activeId) ?? articles[0];
  const isRoadmapPage = activeId === "demo-roadmap";
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentRoadmapStage =
    editableRoadmapStages.find((stage) => {
      const start = new Date(`${stage.startsOn}T00:00:00`);
      const end = new Date(`${stage.endsOn}T00:00:00`);
      return todayDate >= start && todayDate < end;
    }) ?? editableRoadmapStages[editableRoadmapStages.length - 1];
  const activeFocusItems = focusItems.filter((item) => !item.completed);
  const completedFocusItems = focusItems.filter((item) => item.completed);
  const countdownDistance = Math.max(
    0,
    demoDeadline.getTime() - countdownNow.getTime(),
  );
  const countdownDays = Math.floor(countdownDistance / 86_400_000);
  const countdownHours = Math.floor((countdownDistance % 86_400_000) / 3_600_000);
  const countdownMinutes = Math.floor((countdownDistance % 3_600_000) / 60_000);
  const countdownSeconds = Math.floor((countdownDistance % 60_000) / 1_000);
  const searchResults = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];
    return articles.flatMap((article) => {
      const headingMatches: SearchResult[] = [];
      const noteMatches: SearchResult[] = [];
      const articleText = [
        article.title,
        article.section,
        article.summary,
        ...article.tags,
      ]
        .join(" ")
        .toLowerCase();
      const normalizedArticleText = normalizeSearchText(articleText);
      if (normalizedArticleText.includes(normalizedQuery))
        headingMatches.push({
          article,
          fieldId: "",
          fieldLabel: "HEADING / SUBHEADING",
          excerpt: article.title,
          isNote: false,
        });
      const fieldLabels = article.body.length ? article.body : ["Section notes"];
      fieldLabels.forEach((fieldLabel, index) => {
        const fieldId = `${article.id}-${index}`;
        const note = fieldValues[fieldId] ?? "";
        const normalizedNote = normalizeSearchText(note);
        if (!normalizedNote.includes(normalizedQuery)) return;
        const matchStart = Math.max(
          0,
          normalizedNote.indexOf(normalizedQuery),
        );
        const excerptStart = Math.max(0, matchStart - 42);
        const excerpt = `${excerptStart > 0 ? "... " : ""}${note.slice(excerptStart, excerptStart + 120)}${note.length > excerptStart + 120 ? " ..." : ""}`;
        noteMatches.push({
          article,
          fieldId,
          fieldLabel: `NOTE · ${fieldLabel}`,
          excerpt,
          isNote: true,
        });
      });
      return [...headingMatches, ...noteMatches];
    });
  }, [fieldValues, query]);
  const selectArticle = (id: string) => {
    setActiveId(id);
    setQuery("");
    setFocusedField({ fieldId: "", cursor: 0 });
    writeUrlState(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSearchResult = (fieldId: string, articleId: string) => {
    setQuery("");
    setActiveId(articleId);
    setFocusedField({ fieldId, cursor: 0 });
    writeUrlState(articleId, fieldId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const activeIndex = articles.findIndex(
    (article) => article.id === activeArticle.id,
  );
  const previousArticle = articles[activeIndex - 1];
  const nextArticle = articles[activeIndex + 1];
  useEffect(() => {
    fetch("/api/notes")
      .then((response) => response.json() as Promise<{ fields?: FieldValues }>)
      .then((saved) => {
        setFieldValues(saved.fields ?? {});
        notesLoaded.current = true;
        setSaveState("Saved to notes.json");
      })
      .catch(() => setSaveState("Notes file unavailable"));
  }, []);
  useEffect(() => {
    if (!notesLoaded.current) return;
    setSaveState("Saving...");
    const saveTimer = window.setTimeout(() => {
      fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: 1,
          savedAt: new Date().toISOString(),
          fields: fieldValues,
        }),
      })
        .then(() => setSaveState("Saved to notes.json"))
        .catch(() => setSaveState("Could not save notes.json"));
    }, 350);
    return () => window.clearTimeout(saveTimer);
  }, [fieldValues]);
  useEffect(() => {
    const timer = window.setInterval(() => setCountdownNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    localStorage.setItem(focusStorageKey, JSON.stringify(focusItems));
  }, [focusItems]);
  useEffect(() => {
    localStorage.setItem(
      roadmapPlanStorageKey,
      JSON.stringify(editableRoadmapStages),
    );
  }, [editableRoadmapStages]);
  const addFocusItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("focus-title") ?? "").trim();
    const rawUrl = String(formData.get("focus-url") ?? "").trim();
    const url = getExternalUrl(rawUrl);
    if (url === null) {
      setFocusError("Add a valid http:// or https:// link, or leave the link empty.");
      return;
    }
    setFocusItems((items) => [
      ...items,
      { id: `${Date.now()}-${title}`, title, url },
    ]);
    setFocusError("");
    form.reset();
  };
  const saveFocusItem = (event: FormEvent<HTMLFormElement>, itemId: string) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("edit-title") ?? "").trim();
    const rawUrl = String(formData.get("edit-url") ?? "").trim();
    const url = getExternalUrl(rawUrl);
    if (url === null) {
      setFocusError("Add a valid http:// or https:// link, or leave the link empty.");
      return;
    }
    setFocusItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, title, url } : item)),
    );
    setFocusError("");
    setEditingFocusId("");
  };
  const moveFocusItem = (itemId: string, direction: -1 | 1) => {
    setFocusItems((items) => {
      const activeItems = items.filter((item) => !item.completed);
      const completedItems = items.filter((item) => item.completed);
      const currentIndex = activeItems.findIndex((item) => item.id === itemId);
      const nextIndex = currentIndex + direction;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= activeItems.length)
        return items;
      const reordered = [...activeItems];
      [reordered[currentIndex], reordered[nextIndex]] = [
        reordered[nextIndex],
        reordered[currentIndex],
      ];
      return [...reordered, ...completedItems];
    });
  };
  const reorderFocusItem = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    setFocusItems((items) => {
      const activeItems = items.filter((item) => !item.completed);
      const completedItems = items.filter((item) => item.completed);
      const fromIndex = activeItems.findIndex((item) => item.id === draggedId);
      const toIndex = activeItems.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return items;
      const [draggedItem] = activeItems.splice(fromIndex, 1);
      activeItems.splice(toIndex, 0, draggedItem);
      return [...activeItems, ...completedItems];
    });
  };
  const addTaskToFocus = (
    task: RoadmapTask,
    sourceTaskId: string,
    url = "",
  ) => {
    const existingId = `roadmap-${sourceTaskId}`;
    setFocusItems((items) => {
      const existing = items.find(
        (item) =>
          item.sourceTaskId === sourceTaskId ||
          item.id === existingId ||
          item.id === task.id,
      );
      const nextItem: FocusItem = existing
        ? { ...existing, sourceTaskId, completed: false }
        : {
            id: existingId,
            sourceTaskId,
            title: task.label.replace(/^(Now|Next) — /, ""),
            url,
          };
      const activeItems = items.filter(
        (item) => !item.completed && item.id !== nextItem.id,
      );
      const completedItems = items.filter(
        (item) => item.completed && item.id !== nextItem.id,
      );
      return [...activeItems, nextItem, ...completedItems];
    });
  };
  const startEditingRoadmapStage = (stage: RoadmapStage) => {
    setRoadmapStageDraft({
      id: stage.id,
      title: stage.title,
      tasks: stage.tasks.map((task) => ({ ...task })),
    });
    setNewRoadmapTaskLabel("");
  };
  const saveRoadmapStage = () => {
    if (!roadmapStageDraft) return;
    setEditableRoadmapStages((stages) =>
      stages.map((stage) =>
        stage.id === roadmapStageDraft.id
          ? { ...stage, title: roadmapStageDraft.title, tasks: roadmapStageDraft.tasks }
          : stage,
      ),
    );
    setRoadmapStageDraft(null);
    setNewRoadmapTaskLabel("");
  };
  const addRoadmapStageTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = newRoadmapTaskLabel.trim();
    if (!roadmapStageDraft || !label) return;
    setRoadmapStageDraft((draft) =>
      draft
        ? {
            ...draft,
            tasks: [...draft.tasks, { id: `${draft.id}-${Date.now()}`, label }],
          }
        : draft,
    );
    setNewRoadmapTaskLabel("");
  };
  const updateField = (fieldId: string, value: string) => {
    setFieldValues((currentValues) => ({ ...currentValues, [fieldId]: value }));
  };
  const updateCursor = (fieldId: string, cursor: number) => {
    setFocusedField({ fieldId, cursor });
    writeUrlState(activeArticle.id, fieldId, cursor);
  };
  const exportNotes = () => {
    const file = new Blob(
      [
        JSON.stringify(
          {
            app: "Noggin Joggin",
            version: 1,
            savedAt: new Date().toISOString(),
            fields: fieldValues,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "noggin-joggin-notes.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const importNotes = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          fields?: FieldValues;
        };
        if (!parsed.fields || typeof parsed.fields !== "object")
          throw new Error("Invalid notes file");
        setFieldValues(parsed.fields);
        setSaveState("Imported; saving...");
      } catch {
        setSaveState("Could not import file");
      }
    };
    reader.readAsText(file);
  };
  const openImportPicker = () => importInputRef.current?.click();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "Ywen Wander" && password === "whyeven") {
      setIsAuthenticated(true);
      setLoginError("");
      return;
    }
    setLoginError("That username or password is not correct.");
  };

  if (!isAuthenticated) {
    return (
      <main className={`login-screen ${darkMode ? "theme-dark" : ""}`}>
        <button
          className="login-theme-toggle"
          type="button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => {
            const nextMode = !darkMode;
            setDarkMode(nextMode);
            localStorage.setItem(themeStorageKey, nextMode ? "dark" : "light");
          }}
        >
          {darkMode ? "☼" : "☾"}
        </button>
        <div className="login-panel">
          <div className="login-brand">
            <span className="brand-symbol">NJ</span>
            <span>
              <strong>Noggin</strong> Joggin
            </span>
          </div>
          <div className="login-kicker">FIELD GUIDE // PRIVATE ACCESS</div>
          <h1>Welcome back.</h1>
          <p>Enter your credentials to open the story archive.</p>
          <form onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {loginError && (
              <div className="login-error" role="alert">
                {loginError}
              </div>
            )}
            <button type="submit">
              Enter the archive <span>→</span>
            </button>
          </form>
        </div>
        <div className="login-mark">NJ / 01</div>
      </main>
    );
  }

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : ""}`}>
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand-mark">
          <span className="brand-symbol">NJ</span>
          <span>
            <strong>Noggin</strong> Joggin
          </span>
        </div>
        <div className="edition">
          FIELD GUIDE <span>v1.0</span>
        </div>
        <nav className="side-nav" aria-label="Documentation sections">
          <button
            className="nav-home"
            type="button"
            onClick={() => selectArticle("doc-1")}
          >
            <span className="nav-icon">⌂</span> Index
          </button>
          <button
            className={`roadmap-nav ${isRoadmapPage ? "active" : ""}`}
            type="button"
            onClick={() => selectArticle("demo-roadmap")}
          >
            <span>OCT ’27</span> Demo countdown & roadmap
          </button>
          {sections.map((section) => (
            <div className="nav-group" key={section}>
              <p>{section}</p>
              {articles
                .filter((article) => article.section === section)
                .map((article) => (
                  <button
                    type="button"
                    className={activeArticle.id === article.id ? "active" : ""}
                    key={article.id}
                    onClick={() => selectArticle(article.id)}
                  >
                    <span>{article.label}</span>
                    {article.title}
                  </button>
                ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> Archive synced <span>⌘ K</span>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="menu-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <div className="breadcrumbs">
            <span>NOGGIN JOGGIN</span>
            <b>/</b>
            {isRoadmapPage ? "DEMO DEADLINE" : activeArticle.section.toUpperCase()}
            <b>/</b>
            <strong>
              {isRoadmapPage ? "OCTOBER 2027" : activeArticle.title.toUpperCase()}
            </strong>
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the guide..."
              aria-label="Search the guide"
            />
            <kbd>⌘ K</kbd>
          </label>
          <button
            className="theme-toggle"
            type="button"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => {
              const nextMode = !darkMode;
              setDarkMode(nextMode);
              localStorage.setItem(
                themeStorageKey,
                nextMode ? "dark" : "light",
              );
            }}
          >
            {darkMode ? "☼" : "☾"}
          </button>
        </header>
        <div className="content-wrap">
          <section className="intro-block">
            <div className="eyebrow">
              {isRoadmapPage ? (
                <>PERSONAL MILESTONE <span>//</span> OCTOBER 2027</>
              ) : (
                <>
                  {activeArticle.kicker} <span>//</span> {activeArticle.label} /{" "}
                  {String(articles.length).padStart(2, "0")}
                </>
              )}
            </div>
            <h1>{isRoadmapPage ? "The demo deadline" : activeArticle.title}</h1>
            <p className="lead">
              {isRoadmapPage
                ? "A practical countdown and staged plan to turn your Unity learning into a focused 20–30 minute narrative-adventure demo."
                : activeArticle.summary}
            </p>
            <div className="tag-row">
              {(isRoadmapPage
                ? ["20–30 MINUTES", "LEARNING → PLAYABLE DEMO", "FOCUS CHECKLIST SAVES HERE"]
                : activeArticle.tags
              ).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
          <div className="rule" />
          {query ? (
            <section className="search-results">
              <div className="section-heading">
                <span>GUIDE SEARCH</span>
                <small>{searchResults.length} matches</small>
              </div>
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button
                    className="result-row"
                    type="button"
                    key={`${result.article.id}-${result.fieldId || "heading"}`}
                    onClick={() =>
                      openSearchResult(result.fieldId, result.article.id)
                    }
                  >
                    <span>{result.article.label}</span>
                    <div>
                      <strong>{result.article.title}</strong>
                      <em>{result.fieldLabel}</em>
                      <p>{result.excerpt}</p>
                    </div>
                    <small>{result.article.section}</small>
                    <i>↗</i>
                  </button>
                ))
              ) : (
                <p className="empty-state">No headings or saved notes match “{query}”.</p>
              )}
            </section>
          ) : (
            <article className="article-body">
              <div className="section-heading">
                <span>
                  {isRoadmapPage
                    ? "YOUR OCTOBER 2027 PLAN"
                    : activeArticle.id === "doc-1"
                    ? "READ THIS FIRST"
                    : "FILL IN THIS SECTION"}
                </span>
                {isRoadmapPage ? (
                  <small>DEMO-FIRST TIMELINE</small>
                ) : activeArticle.id === "doc-1" ? (
                  <small>GUIDANCE</small>
                ) : (
                  <div className="section-tools">
                    <small>{saveState}</small>
                    <button type="button" onClick={exportNotes}>
                      Export JSON
                    </button>
                    <button type="button" onClick={openImportPicker}>
                      Import JSON
                    </button>
                    <input
                      ref={importInputRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) importNotes(file);
                        event.target.value = "";
                      }}
                    />
                  </div>
                )}
              </div>
              {isRoadmapPage ? (
                <div className="roadmap-content">
                  <section className="countdown-panel" aria-label="Countdown to October 2027">
                    <div>
                      <span className="roadmap-overline">TIME TO YOUR TARGET</span>
                      <strong>
                        {countdownDays} <small>days</small>{" "}
                        {String(countdownHours).padStart(2, "0")} <small>hours</small>{" "}
                        {String(countdownMinutes).padStart(2, "0")} <small>min</small>{" "}
                        {String(countdownSeconds).padStart(2, "0")} <small>sec</small>
                      </strong>
                      <p>Target: October 1, 2027 · confirm the official Steam Next Fest dates separately.</p>
                    </div>
                    <div className="countdown-date">
                      <span>DEMO BUILD TARGET</span>
                      <b>OCT<br />’27</b>
                    </div>
                  </section>
                  <section className="current-focus">
                    <div className="focus-heading">
                      <span className="roadmap-overline">CURRENT FOCUS</span>
                      <h2>Your learning queue</h2>
                      <p>Drag the handle or use the arrows to reorder. Checking an item moves it into Completed.</p>
                    </div>
                    <div className="focus-item-list">
                      {activeFocusItems.length ? (
                        activeFocusItems.map((item, index) => (
                          <div
                            className={`focus-item ${index === 0 ? "is-current" : ""} ${draggingFocusId === item.id ? "is-dragging" : ""}`}
                            key={item.id}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault();
                              reorderFocusItem(draggedFocusIdRef.current, item.id);
                              draggedFocusIdRef.current = "";
                              setDraggingFocusId("");
                            }}
                          >
                            <button
                              className="focus-drag-handle"
                              type="button"
                              draggable
                              aria-label={`Drag ${item.title} to reorder`}
                              title="Drag to reorder"
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", item.id);
                                draggedFocusIdRef.current = item.id;
                                setDraggingFocusId(item.id);
                              }}
                              onDragEnd={() => {
                                draggedFocusIdRef.current = "";
                                setDraggingFocusId("");
                              }}
                            >
                              ⠿
                            </button>
                            <label className="focus-complete" aria-label={`Mark ${item.title} ${item.completed ? "incomplete" : "complete"}`}>
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={(event) =>
                                  setFocusItems((items) =>
                                    items.map((focusItem) => focusItem.id === item.id
                                      ? { ...focusItem, completed: event.target.checked }
                                      : focusItem),
                                  )
                                }
                              />
                              <span aria-hidden="true">✓</span>
                            </label>
                            <span className="focus-order">
                              {index === 0 ? "NOW" : `UP NEXT ${String(index).padStart(2, "0")}`}
                            </span>
                            {editingFocusId === item.id ? (
                              <form
                                className="focus-edit-form"
                                onSubmit={(event) => saveFocusItem(event, item.id)}
                              >
                                <label>
                                  <span>TITLE</span>
                                  <input
                                    name="edit-title"
                                    type="text"
                                    defaultValue={item.title}
                                    maxLength={120}
                                    required
                                  />
                                </label>
                                <label>
                                  <span>LINK (OPTIONAL)</span>
                                  <input
                                    name="edit-url"
                                    type="url"
                                    defaultValue={item.url}
                                    placeholder="https://..."
                                  />
                                </label>
                                <div className="focus-edit-actions">
                                  <button type="submit">Save</button>
                                  <button type="button" onClick={() => setEditingFocusId("")}>Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="focus-item-details">
                                  <h3>{item.title}</h3>
                                  {item.url && (
                                    <a href={item.url} target="_blank" rel="noreferrer">
                                      Open resource <span>↗</span>
                                    </a>
                                  )}
                                </div>
                                <div className="focus-item-actions">
                                  <button
                                    className="focus-move"
                                    type="button"
                                    aria-label={`Move ${item.title} up`}
                                    disabled={index === 0}
                                    onClick={() => moveFocusItem(item.id, -1)}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    className="focus-move"
                                    type="button"
                                    aria-label={`Move ${item.title} down`}
                                    disabled={index === activeFocusItems.length - 1}
                                    onClick={() => moveFocusItem(item.id, 1)}
                                  >
                                    ↓
                                  </button>
                                  <button
                                    className="focus-edit"
                                    type="button"
                                    onClick={() => {
                                      setEditingFocusId(item.id);
                                      setFocusError("");
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="focus-remove"
                                    type="button"
                                    aria-label={`Remove ${item.title} from focus`}
                                    onClick={() =>
                                      setFocusItems((items) =>
                                        items.filter((focusItem) => focusItem.id !== item.id),
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="focus-empty">No focus items yet. Add your current task below.</p>
                      )}
                    </div>
                    <form className="focus-form" onSubmit={addFocusItem}>
                      <label>
                        <span>ADD TO FOCUS</span>
                        <input
                          name="focus-title"
                          type="text"
                          placeholder="What are you working on?"
                          required
                          maxLength={120}
                        />
                      </label>
                      <label>
                        <span>LINK (OPTIONAL)</span>
                        <input
                          name="focus-url"
                          type="url"
                          placeholder="https://..."
                        />
                      </label>
                      <button type="submit">Add item <b>+</b></button>
                      {focusError && <small className="focus-error" role="alert">{focusError}</small>}
                    </form>
                    <details className="focus-completed-section" aria-labelledby="completed-focus-heading" open>
                      <summary className="focus-completed-heading">
                        <h3 id="completed-focus-heading">Completed</h3>
                        <small>{completedFocusItems.length} {completedFocusItems.length === 1 ? "item" : "items"}</small>
                      </summary>
                      {completedFocusItems.length ? (
                        <div className="focus-item-list">
                          {completedFocusItems.map((item) => (
                            <div className="focus-item is-complete" key={item.id}>
                              <label className="focus-complete" aria-label={`Mark ${item.title} incomplete`}>
                                <input
                                  type="checkbox"
                                  checked
                                  onChange={() =>
                                    setFocusItems((items) =>
                                      items.map((focusItem) => focusItem.id === item.id
                                        ? { ...focusItem, completed: false }
                                        : focusItem),
                                    )
                                  }
                                />
                                <span aria-hidden="true">✓</span>
                              </label>
                              <span className="focus-order">DONE</span>
                              {editingFocusId === item.id ? (
                                <form
                                  className="focus-edit-form"
                                  onSubmit={(event) => saveFocusItem(event, item.id)}
                                >
                                  <label>
                                    <span>TITLE</span>
                                    <input name="edit-title" type="text" defaultValue={item.title} maxLength={120} required />
                                  </label>
                                  <label>
                                    <span>LINK (OPTIONAL)</span>
                                    <input name="edit-url" type="url" defaultValue={item.url} placeholder="https://..." />
                                  </label>
                                  <div className="focus-edit-actions">
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditingFocusId("")}>Cancel</button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="focus-item-details">
                                    <h3>{item.title}</h3>
                                    {item.url && <a href={item.url} target="_blank" rel="noreferrer">Open resource <span>↗</span></a>}
                                  </div>
                                  <div className="focus-item-actions">
                                    <button className="focus-edit" type="button" onClick={() => setEditingFocusId(item.id)}>Edit</button>
                                    <button
                                      className="focus-remove"
                                      type="button"
                                      aria-label={`Remove ${item.title} from completed`}
                                      onClick={() => setFocusItems((items) => items.filter((focusItem) => focusItem.id !== item.id))}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="focus-empty">Completed focus items will appear here.</p>
                      )}
                    </details>
                  </section>
                  <div className="roadmap-stages">
                    {editableRoadmapStages.map((stage, index) => {
                      const isEditingStage = roadmapStageDraft?.id === stage.id;
                      return (
                        <section className="roadmap-stage" key={stage.id}>
                          <div className="stage-heading">
                            <span className="stage-number">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <span className="roadmap-overline">{stage.period}</span>
                              {isEditingStage ? (
                                <label className="stage-title-editor">
                                  <span>SECTION TITLE</span>
                                  <input
                                    value={roadmapStageDraft.title}
                                    onChange={(event) =>
                                      setRoadmapStageDraft((draft) =>
                                        draft
                                          ? { ...draft, title: event.target.value }
                                          : draft,
                                      )
                                    }
                                    maxLength={100}
                                  />
                                </label>
                              ) : (
                                <h2>{stage.title}</h2>
                              )}
                              <p>{stage.description}</p>
                            </div>
                            {isEditingStage ? (
                              <div className="stage-editor-actions">
                                <button type="button" onClick={saveRoadmapStage}>Save</button>
                                <button type="button" onClick={() => setRoadmapStageDraft(null)}>Cancel</button>
                              </div>
                            ) : (
                              <button
                                className="stage-edit-button"
                                type="button"
                                aria-label={`Edit ${stage.title}`}
                                onClick={() => startEditingRoadmapStage(stage)}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="roadmap-task-list">
                            {isEditingStage
                              ? roadmapStageDraft.tasks.map((task) => (
                                  <div className="stage-task-editor" key={task.id}>
                                    <input
                                      value={task.label}
                                      aria-label="Roadmap item"
                                      maxLength={180}
                                      onChange={(event) =>
                                        setRoadmapStageDraft((draft) =>
                                          draft
                                            ? {
                                                ...draft,
                                                tasks: draft.tasks.map((draftTask) =>
                                                  draftTask.id === task.id
                                                    ? { ...draftTask, label: event.target.value }
                                                    : draftTask,
                                                ),
                                              }
                                            : draft,
                                        )
                                      }
                                    />
                                    <button
                                      type="button"
                                      aria-label={`Remove ${task.label}`}
                                      onClick={() =>
                                        setRoadmapStageDraft((draft) =>
                                          draft
                                            ? {
                                                ...draft,
                                                tasks: draft.tasks.filter(
                                                  (draftTask) => draftTask.id !== task.id,
                                                ),
                                              }
                                            : draft,
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))
                              : stage.tasks.map((task) => (
                                  <div className="essential-task" key={task.id}>
                                    <div className="roadmap-task">{task.label}</div>
                                    {stage.id === currentRoadmapStage?.id && (
                                      <button
                                        className="focus-add-task"
                                        type="button"
                                        aria-label={`Move ${task.label.replace(/^(Now|Next) — /, "")} to Current Focus`}
                                        onClick={() =>
                                          addTaskToFocus(
                                            task,
                                            `stage:${stage.id}:${task.id}`,
                                          )
                                        }
                                      >
                                        + Focus
                                      </button>
                                    )}
                                  </div>
                                ))}
                          </div>
                          {isEditingStage && (
                            <form className="stage-add-task-form" onSubmit={addRoadmapStageTask}>
                              <input
                                value={newRoadmapTaskLabel}
                                onChange={(event) => setNewRoadmapTaskLabel(event.target.value)}
                                placeholder="Add a roadmap item"
                                aria-label="New roadmap item"
                                maxLength={180}
                              />
                              <button type="submit" disabled={!newRoadmapTaskLabel.trim()}>
                                Add item +
                              </button>
                            </form>
                          )}
                        </section>
                      );
                    })}
                  </div>
                  <section className="scope-note">
                    <span className="roadmap-overline">KEEP THE DEMO FINISHABLE</span>
                    <p>
                      Aim for one polished story route, a small cast, one or two compact locations, and a handful of meaningful choices. Make a complete vertical slice before expanding. Learn film/color theory and realism techniques alongside the project; avoid delaying production to master every Unity system.
                    </p>
                  </section>
                  <section className="resource-shelf">
                    <div className="resource-heading">
                      <div>
                        <span className="roadmap-overline">SAVE FOR LATER</span>
                        <h2>Learning shelf</h2>
                      </div>
                      <small>Useful references · not the current priority</small>
                    </div>
                    <p className="download-note"><strong>Aikodex is a tool/resource, not the tutorials you downloaded.</strong> Your Real-time Animated Storytelling tutorials are a separate downloaded resource; work through them when they fit your schedule.</p>
                    <div className="resource-list">
                      {roadmapResources.map((resource) => (
                        <a href={resource.href} target="_blank" rel="noreferrer" key={resource.title}>
                          <span><strong>{resource.title}</strong><small>{resource.description}</small></span>
                          <b>↗</b>
                        </a>
                      ))}
                    </div>
                    <p className="later-topics">The optional curriculum below also covers deeper facial animation/lip sync, NPC AI, advanced rendering, DOTS/ECS, and other systems beyond this demo's essentials.</p>
                  </section>
                  <section className="curriculum-shelf">
                    <div className="resource-heading">
                      <div>
                        <span className="roadmap-overline">OPTIONAL · FUTURE LEARNING</span>
                        <h2>Full Unity roadmap</h2>
                      </div>
                    </div>
                    <p className="curriculum-intro">
                      This is the complete nine-phase curriculum you listed. It’s here as a reference if you choose to study beyond what the demo needs; it is not a prerequisite or a reason to delay making the game. Expand a phase to review its topics.
                    </p>
                    <div className="curriculum-phases">
                      {optionalCurriculum.map((phase) => {
                        return (
                          <details className="curriculum-phase" key={phase.id}>
                            <summary>
                              <span>{phase.title}</span>
                            </summary>
                            <div className="roadmap-task-list">
                              {phase.topics.map((topic) => (
                                <div className="essential-task" key={topic.id}>
                                  <div className="roadmap-task">{topic.label}</div>
                                  <button
                                    className="focus-add-task"
                                    type="button"
                                    aria-label={`Move ${topic.label} to Current Focus`}
                                    onClick={() =>
                                      addTaskToFocus(
                                        topic,
                                        `curriculum:${phase.id}:${topic.id}`,
                                      )
                                    }
                                  >
                                    + Focus
                                  </button>
                                </div>
                              ))}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </section>
                </div>
              ) : activeArticle.id === "doc-1" ? (
                <div className="read-only-notes">
                  {activeArticle.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="field-list">
                  {(activeArticle.body.length
                    ? activeArticle.body
                    : ["Section notes"]
                  ).map((fieldLabel, index) => {
                    const fieldId = `${activeArticle.id}-${index}`;
                    return (
                      <NoteField
                        fieldId={fieldId}
                        label={fieldLabel}
                        value={fieldValues[fieldId] ?? ""}
                        focusOnLoad={focusedField.fieldId === fieldId}
                        cursor={focusedField.cursor}
                        onChange={updateField}
                        onCursorChange={updateCursor}
                        key={fieldId}
                      />
                    );
                  })}
                </div>
              )}
              <blockquote>
                “The best discoveries are usually hiding in the detail you
                almost skipped.”
              </blockquote>
              <div className="quick-links">
                <div>
                  <span className="quick-number">A</span>
                  <div>
                    <small>PREVIOUS ENTRY</small>
                    <button
                      type="button"
                      onClick={() =>
                        previousArticle && selectArticle(previousArticle.id)
                      }
                    >
                      {previousArticle?.title ?? "Start of document"} <b>↗</b>
                    </button>
                  </div>
                </div>
                <div>
                  <span className="quick-number">B</span>
                  <div>
                    <small>NEXT ENTRY</small>
                    <button
                      type="button"
                      onClick={() =>
                        nextArticle && selectArticle(nextArticle.id)
                      }
                    >
                      {nextArticle?.title ?? "End of document"} <b>↗</b>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}
          {!query && !isRoadmapPage && (
            <footer className="article-footer">
              <button
                type="button"
                disabled={!previousArticle}
                onClick={() =>
                  previousArticle && selectArticle(previousArticle.id)
                }
              >
                <span>←</span>
                <small>PREVIOUS</small>
                <strong>{previousArticle?.title ?? "Start"}</strong>
              </button>
              <button
                type="button"
                disabled={!nextArticle}
                onClick={() => nextArticle && selectArticle(nextArticle.id)}
              >
                <small>NEXT</small>
                <strong>{nextArticle?.title ?? "End of guide"}</strong>
                <span>→</span>
              </button>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
