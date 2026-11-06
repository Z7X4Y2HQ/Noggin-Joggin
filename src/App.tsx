import FocusTaskRow from "./FocusTaskRow";
import { addSourceTaskToFocus, isTaskInFocus, type FocusEntry } from "./focus-tasks";
import { ActionButton as Button } from "./ActionButton";
import type { TaskCategory } from "./TaskSuggestions";
import { headingHasChanges, headingSnapshot, headingValidationError, persistHeadingDraft } from "./heading-draft";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Article } from "./content";
import GameControls, { GameDialog, type Game, type GameValues } from "./GameControls";
import { apiRequest } from "./api";
import HeadingDialog from "./HeadingDialog";
import { createSaveQueue } from "./save-queue";
import "./App.css";
import "./Typography.css";
import type {PlanProfile,PlanSummary} from "./plan-types";
import type {GameDimension} from "./game-development";
import DocumentationTools from "./DocumentationTools";
import "./GamePlan.css";
const themeStorageKey = "noggin-joggin-theme";
const authTokenStorageKey = "noggin-joggin-session-v1";

type GameArticle = Article & { fieldIds: string[]; fieldKeys: string[] };
// Keep the guide's stable titles and IDs; remove outline numbering only in sidebar labels.
function sidebarTitle(title: string) { return title.replace(/^\d+(?:\.\d+)*\.?\s+/, ""); }
type FieldValues = Record<string, string>;
const emptyArticle: GameArticle = { id: "doc-1", section: "", label: "001", title: "Documentation", kicker: "", summary: "", body: [], tags: [], fieldIds: [], fieldKeys: [] };
function shiftDate(value: string, days: number) { return value ? new Date(Date.parse(value + "T00:00:00Z") + days * 86400000).toISOString().slice(0, 10) : ""; }
function stagePeriod(stage: RoadmapStage) {
  if (!stage.startsOn || !stage.endsOn) return "UNSCHEDULED";
  const start = new Date(stage.startsOn + "T00:00:00Z"), end = new Date(shiftDate(stage.endsOn, -1) + "T00:00:00Z");
  const month = (value: Date) => value.toLocaleDateString("en", { month: "short", timeZone: "UTC" }).toUpperCase();
  return start.getUTCFullYear() === end.getUTCFullYear() ? `${month(start)}–${month(end)} ${end.getUTCFullYear()}` : `${month(start)} ${start.getUTCFullYear()}–${month(end)} ${end.getUTCFullYear()}`;
}
type StoryData = {
  game: Game; articles: GameArticle[]; fields: FieldValues; noteVersions: Record<string, number>;
  roadmapStages: RoadmapStage[]; curriculum: CurriculumPhase[]; focusItems: FocusItem[];
  resources: { title: string; description: string; href: string }[]; taskCatalog: TaskCategory[]; roadmapVersion: number; archivedArticles:GameArticle[];curriculumTitle:string;planSummary:PlanSummary|null;
};
type FocusItem = FocusEntry;
type RoadmapTask = { id: string; label: string; completed?: boolean };
type RoadmapStage = {
  id: string;
  taskCategoryId?: string | null;
  period: string;
  startsOn: string;
  endsOn: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
};
type RoadmapStageDraft = RoadmapStage;
type HeadingIntent = { kind: "close" } | { kind: "new" } | { kind: "edit"; id: string };
type CurriculumPhase = {
  id: string;
  title: string;
  description?: string;
  gameSpecific?: boolean;
  topics: RoadmapTask[];
};
type CurriculumPart = { id: string; title: string; description: string; phases: CurriculumPhase[] };
function groupEngineCurriculum(phases: CurriculumPhase[]): CurriculumPart[] {
  const enginePhases = phases.filter((phase) => !phase.gameSpecific);
  if (enginePhases.length === 9) return [
    { id: "foundations", title: "Build the foundations", description: "Core systems, characters and world building.", phases: enginePhases.slice(0, 3) },
    { id: "experience", title: "Craft the experience", description: "Narrative, cinematics and presentation.", phases: enginePhases.slice(3, 6) },
    { id: "production", title: "Strengthen and ship", description: "Performance, advanced tools and production practice.", phases: enginePhases.slice(6, 9) },
  ];
  return enginePhases.length ? [{ id: "foundations", title: "Engine foundations", description: "Explore the core concepts and workflows at your own pace.", phases: enginePhases }] : [];
}
type SearchResult = {
  article: GameArticle;
  fieldId: string;
  fieldLabel: string;
  excerpt: string;
  isNote: boolean;
};

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
  const [articles, setArticles] = useState<GameArticle[]>([]);
  const sections = useMemo(() => [...new Set(articles.map(article => article.section))], [articles]);
  const [games, setGames] = useState<{ id: string; name: string }[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [requestedGameId, setRequestedGameId] = useState<string | null>(() => new URLSearchParams(window.location.search).get("game") ?? localStorage.getItem("noggin-joggin-selected-game"));
  const [optionalCurriculum, setCurriculum] = useState<CurriculumPhase[]>([]);
  const [curriculumTitle,setCurriculumTitle]=useState("Full Unity roadmap");
  const curriculumParts = useMemo(() => groupEngineCurriculum(optionalCurriculum), [optionalCurriculum]);
  const engineTopicCount = useMemo(() => optionalCurriculum.filter((phase) => !phase.gameSpecific).reduce((count, phase) => count + phase.topics.length, 0), [optionalCurriculum]);
  const [planSummary,setPlanSummary]=useState<PlanSummary|null>(null);
  const [archivedArticles,setArchivedArticles]=useState<GameArticle[]>([]);
  const [roadmapResources, setResources] = useState<{ title: string; description: string; href: string }[]>([]);
  const [newStageDraft, setNewStageDraft] = useState(false);
  const [removeHeadingId, setRemoveHeadingId] = useState<string | null>(null);
  const [initialUrlState] = useState(readUrlState);
  const [focusedField, setFocusedField] = useState({
    fieldId: initialUrlState.fieldId,
    cursor: initialUrlState.cursor,
  });
  const [activeId, setActiveId] = useState(initialUrlState.articleId);
  const [query, setQuery] = useState("");
  const [authToken, setAuthToken] = useState(
    () => sessionStorage.getItem(authTokenStorageKey),
  );
  const isAuthenticated = Boolean(authToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataLoadError, setDataLoadError] = useState("");
  const [dataLoadAttempt, setDataLoadAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(themeStorageKey) === "dark",
  );
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [editableRoadmapStages, setEditableRoadmapStages] =
    useState<RoadmapStage[]>([]);
  const [roadmapStageDraft, setRoadmapStageDraft] =
    useState<RoadmapStageDraft | null>(null);
  const [newRoadmapTaskLabel, setNewRoadmapTaskLabel] = useState("");
  const [taskCatalog, setTaskCatalog] = useState<TaskCategory[]>([]);
  const [headingBaseline, setHeadingBaseline] = useState("");
  const [headingIntent, setHeadingIntent] = useState<HeadingIntent | null>(null);
  const [headingPending, setHeadingPending] = useState(false);
  const [headingSaveError, setHeadingSaveError] = useState("");
  const headingDirty = Boolean(roadmapStageDraft && headingHasChanges(roadmapStageDraft, headingBaseline, newRoadmapTaskLabel));
  useEffect(() => {
    if (!headingDirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [headingDirty]);
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const [focusError, setFocusError] = useState("");
  const [editingFocusId, setEditingFocusId] = useState("");
  const [draggingFocusId, setDraggingFocusId] = useState("");
  const draggedFocusIdRef = useRef("");
  const [countdownNow, setCountdownNow] = useState(() => new Date());
  const [saveState, setSaveState] = useState("Loading your data...");
  const saveQueue = useMemo(() => createSaveQueue({ onState: (state) => { if (authToken) setSaveState(state); } }), [authToken]);
  const savedFieldsRef = useRef<FieldValues>({});
  const noteVersionsRef = useRef<Record<string, number>>({});
  const savedRoadmapRef = useRef("");
  const savedFocusRef = useRef("");
  const roadmapVersionRef = useRef(1);
  const focusVersionRef = useRef(1);
  useEffect(() => () => saveQueue.cancel(), [saveQueue]);
  const importInputRef = useRef<HTMLInputElement>(null);
  const activeArticle =
    articles.find((article) => article.id === activeId) ?? articles[0] ?? emptyArticle;
  const isRoadmapPage = activeId === "demo-roadmap";
  const today = new Date();
  const timeZone = currentGame?.timeZone ?? "Asia/Karachi";
  const todayParts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(today);
  const todayKey = ["year", "month", "day"].map(part => todayParts.find(value => value.type === part)?.value).join("-");
  const currentRoadmapStage = editableRoadmapStages.find(stage => stage.startsOn && stage.endsOn && stage.startsOn <= todayKey && todayKey < stage.endsOn);
  const deadline = currentGame?.dueAt ? new Date(currentGame.dueAt) : null;
  const deadlineLabel = deadline ? deadline.toLocaleDateString("en", { timeZone, day: "numeric", month: "long", year: "numeric" }) : "No deadline set";
  const deadlineShort = deadline ? deadline.toLocaleDateString("en", { timeZone, month: "short", year: "2-digit" }).toUpperCase() : "SET TARGET";
  const displayStages = editableRoadmapStages;
  const activeFocusItems = focusItems.filter((item) => !item.completed);
  const completedFocusItems = focusItems.filter((item) => item.completed);
  const countdownDistance = Math.max(
    0,
    (deadline?.getTime() ?? countdownNow.getTime()) - countdownNow.getTime(),
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
        const fieldId = article.fieldKeys[index] ?? `${article.id}-${index}`;
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
  }, [articles, fieldValues, query]);
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
    if (!authToken) return;
    let cancelled = false;
    const loadData = async () => {
      try {
        const list = await apiRequest<{ games: { id: string; name: string }[] }>("/story-dump/games", authToken);
        const selected = list.games.find(game => game.id === requestedGameId) ?? list.games[0];
        if (!selected) throw new Error("No game documentation is available.");
        const saved = await apiRequest<StoryData>(`/story-dump/games/${selected.id}`, authToken);
        if (cancelled) return;
        setGames(list.games); setCurrentGame(saved.game); setArticles(saved.articles);
        setCurriculum(saved.curriculum); setResources(saved.resources); setTaskCatalog(saved.taskCatalog ?? []);
        setCurriculumTitle(saved.curriculumTitle);setPlanSummary(saved.planSummary);setArchivedArticles(saved.archivedArticles??[]);
        savedFieldsRef.current = saved.fields; noteVersionsRef.current = saved.noteVersions;
        savedRoadmapRef.current = JSON.stringify(saved.roadmapStages); savedFocusRef.current = JSON.stringify(saved.focusItems);
        roadmapVersionRef.current = saved.roadmapVersion; focusVersionRef.current = saved.game.focusVersion;
        setFieldValues(saved.fields); setEditableRoadmapStages(saved.roadmapStages); setFocusItems(saved.focusItems);
        setRoadmapStageDraft(null); setNewStageDraft(false); setEditingFocusId(""); setQuery("");
        localStorage.setItem("noggin-joggin-selected-game", saved.game.id);
        const url = new URL(window.location.href); url.searchParams.set("game", saved.game.id); window.history.replaceState({}, "", url);
        setSaveState("Connected to server"); setDataLoadError(""); setDataReady(true);
      } catch (error) {
        if (!cancelled) setDataLoadError(error instanceof Error ? error.message : "Could not load this game.");
      }
    };
    void loadData();
    return () => { cancelled = true; };
  }, [authToken, requestedGameId, dataLoadAttempt]);

  useEffect(() => {
    if (!authToken || !dataReady || !currentGame) return;
    const gameId = currentGame.id;
    const roadmapSnapshot = JSON.stringify(editableRoadmapStages), focusSnapshot = JSON.stringify(focusItems);
    const fieldsSnapshot = { ...fieldValues };
    const fieldIds = new Map(articles.flatMap(article => article.fieldKeys.map((key, index) => [key, article.fieldIds[index]] as const)));
    if (JSON.stringify(fieldsSnapshot) === JSON.stringify(savedFieldsRef.current) && roadmapSnapshot === savedRoadmapRef.current && focusSnapshot === savedFocusRef.current) return;
    saveQueue.schedule(async () => {
      const keys = new Set([...Object.keys(savedFieldsRef.current), ...Object.keys(fieldsSnapshot)]);
      const changes = [...keys].filter(key => (fieldsSnapshot[key] ?? "") !== (savedFieldsRef.current[key] ?? "")).map(key => {
        const fieldId = fieldIds.get(key);
        if (!fieldId) throw new Error("A note does not match the documentation template. Export your notes before reloading.");
        return { fieldId, body: fieldsSnapshot[key] ?? "", expectedVersion: noteVersionsRef.current[fieldId] ?? 0 };
      });
      if (changes.length) {
        const result = await apiRequest<{ versions: Record<string, number> }>(`/story-dump/games/${gameId}/notes`, authToken, { method: "PUT", body: JSON.stringify({ changes,expectedDocumentationVersion:currentGame.documentationVersion }) });
        noteVersionsRef.current = { ...noteVersionsRef.current, ...result.versions };
      }
      savedFieldsRef.current = fieldsSnapshot;
      if (roadmapSnapshot !== savedRoadmapRef.current) {
        const result = await apiRequest<{ version: number }>(`/story-dump/games/${gameId}/roadmap`, authToken, { method: "PUT", body: JSON.stringify({ stages: editableRoadmapStages, expectedVersion: roadmapVersionRef.current }) });
        roadmapVersionRef.current = result.version; savedRoadmapRef.current = roadmapSnapshot;
      }
      if (focusSnapshot !== savedFocusRef.current) {
        const result = await apiRequest<{ version: number }>(`/story-dump/games/${gameId}/focus`, authToken, { method: "PUT", body: JSON.stringify({ items: focusItems, expectedVersion: focusVersionRef.current }) });
        focusVersionRef.current = result.version; savedFocusRef.current = focusSnapshot;
      }
    });
  }, [authToken, dataReady, currentGame, articles, editableRoadmapStages, fieldValues, focusItems, saveQueue]);

  async function switchGame(id: string) {
    if (id === currentGame?.id) return;
    if (roadmapStageDraft || editingFocusId) throw new Error("Save or cancel the open stage or focus editor before switching games.");
    await saveQueue.flush();
    setDataReady(false); setDataLoadError(""); setRequestedGameId(id);
  }
  async function createGame(values: GameValues) {
    if (roadmapStageDraft || editingFocusId) throw new Error("Save or cancel the open editor before creating another game.");
    await saveQueue.flush();
    const result = await apiRequest<{ game: Game }>("/story-dump/games", authToken ?? undefined, { method: "POST", body: JSON.stringify(values) });
    await switchGame(result.game.id);
  }
  async function deleteGame() {
    if (!currentGame) throw new Error("Choose a game before deleting it.");
    if (games.length <= 1) throw new Error("You must keep at least one game. Create another game first.");
    if (roadmapStageDraft || editingFocusId) throw new Error("Save or cancel the open stage or focus editor before deleting this game.");
    await saveQueue.flush();
    const result = await apiRequest<{ games: { id: string; name: string }[]; nextGameId: string }>(
      "/story-dump/games/" + currentGame.id, authToken ?? undefined, { method: "DELETE" });
    saveQueue.cancelPending();
    setDataReady(false); setDataLoadError(""); setCurrentGame(null); setGames(result.games);
    setRequestedGameId(result.nextGameId); setDataLoadAttempt(attempt => attempt + 1);
  }
  async function updateDocument(path:string,method:string,body:object) {
    if(!currentGame)throw new Error('Choose a game first.');
    if(roadmapStageDraft||editingFocusId)throw new Error('Save or close the open stage or focus editor first.');
    await saveQueue.flush();
    const saved=await apiRequest<StoryData>('/story-dump/games/'+currentGame.id+path,authToken??undefined,{method,body:JSON.stringify({...body,expectedVersion:currentGame.version,expectedDocumentationVersion:currentGame.documentationVersion})});
    saveQueue.cancelPending();
    savedFieldsRef.current=saved.fields;noteVersionsRef.current=saved.noteVersions;
    savedRoadmapRef.current=JSON.stringify(saved.roadmapStages);savedFocusRef.current=JSON.stringify(saved.focusItems);
    roadmapVersionRef.current=saved.roadmapVersion;focusVersionRef.current=saved.game.focusVersion;
    setFieldValues(saved.fields);setCurrentGame(saved.game);setArticles(saved.articles);setArchivedArticles(saved.archivedArticles??[]);
    setCurriculum(saved.curriculum);setCurriculumTitle(saved.curriculumTitle);setPlanSummary(saved.planSummary);
    setResources(saved.resources);setTaskCatalog(saved.taskCatalog);setEditableRoadmapStages(saved.roadmapStages);setFocusItems(saved.focusItems);
  }
  async function applyGamePlan(planProfile:PlanProfile,gameDimension:GameDimension,enabledModules:string[],previewToken:string){
    await updateDocument('/plan','PUT',{planProfile,gameDimension,enabledModules,previewToken});
  }
  async function updateGame(values: GameValues) {
    if (!currentGame) return;
    await saveQueue.flush();
    const result = await apiRequest<{ game: Game }>(`/story-dump/games/${currentGame.id}`, authToken ?? undefined, { method: "PATCH", body: JSON.stringify({ ...values, expectedVersion: currentGame.version }) });
    setCurrentGame(result.game); setGames(items => items.map(game => game.id === result.game.id ? { id: game.id, name: result.game.name } : game));
  }
  useEffect(() => {
    const timer = window.setInterval(() => setCountdownNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
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
      { id: crypto.randomUUID(), title, url },
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
    setFocusItems(items => addSourceTaskToFocus(items, task, sourceTaskId, url));
  };
  function applyHeadingIntent(intent: HeadingIntent, stages = editableRoadmapStages) {
    setHeadingIntent(null); setHeadingSaveError(""); setNewRoadmapTaskLabel(""); setRemoveHeadingId(null);
    if (intent.kind === "close") { setRoadmapStageDraft(null); setNewStageDraft(false); setHeadingBaseline(""); return; }
    const selected = intent.kind === "new"
      ? { id: crypto.randomUUID(), title: "", description: "", startsOn: "", endsOn: "", period: "UNSCHEDULED", tasks: [] }
      : stages.find(stage => stage.id === intent.id);
    if (!selected) { setRoadmapStageDraft(null); setNewStageDraft(false); return; }
    const draft = { ...selected, tasks: selected.tasks.map(task => ({ ...task })) };
    setHeadingBaseline(headingSnapshot(draft));
    setNewStageDraft(intent.kind === "new"); setRoadmapStageDraft(draft);
  }
  function requestHeadingIntent(intent: HeadingIntent) {
    if (headingPending || (intent.kind === "edit" && roadmapStageDraft?.id === intent.id)) return;
    if (roadmapStageDraft && headingHasChanges(roadmapStageDraft, headingBaseline, newRoadmapTaskLabel)) { setHeadingIntent(intent); return; }
    applyHeadingIntent(intent);
  }
  const startEditingRoadmapStage = (stage: RoadmapStage) => requestHeadingIntent({ kind: "edit", id: stage.id });
  const addHeading = () => requestHeadingIntent({ kind: "new" });
  const saveRoadmapStage = async (after: HeadingIntent = { kind: "close" }) => {
    if (!roadmapStageDraft || !currentGame || !authToken || headingPending) return;
    if (!headingHasChanges(roadmapStageDraft, headingBaseline, newRoadmapTaskLabel)) { applyHeadingIntent(after); return; }
    setHeadingSaveError("");
    try {
      setHeadingPending(true);
      const { nextStages, result } = await persistHeadingDraft({ draft: roadmapStageDraft, pendingTask: newRoadmapTaskLabel,
        stages: editableRoadmapStages, isNew: newStageDraft, formatPeriod: stagePeriod, flush: () => saveQueue.retry(),
        write: stages => apiRequest<{ version: number }>("/story-dump/games/" + currentGame.id + "/roadmap", authToken,
          { method: "PUT", body: JSON.stringify({ stages, expectedVersion: roadmapVersionRef.current }) }) });
      roadmapVersionRef.current = result.version; savedRoadmapRef.current = JSON.stringify(nextStages);
      setEditableRoadmapStages(nextStages); setSaveState("Saved to server");
      applyHeadingIntent(after, nextStages);
    } catch (caught) {
      setHeadingSaveError(caught instanceof Error ? caught.message : "Could not save this stage. Your draft is still open.");
    } finally { setHeadingPending(false); }
  };
  const addSuggestedRoadmapTask = (label: string, taskCategoryId: string) => {
    setRoadmapStageDraft(draft => draft && draft.tasks.length < 200 && !draft.tasks.some(task => task.label.trim().toLowerCase() === label.trim().toLowerCase())
      ? { ...draft, taskCategoryId, tasks: [...draft.tasks, { id: crypto.randomUUID(), label }] } : draft);
  };
  const addRoadmapStageTask = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const label = newRoadmapTaskLabel.trim();
    if (!roadmapStageDraft || !label || roadmapStageDraft.tasks.length >= 200 || headingPending) return;
    setRoadmapStageDraft((draft) =>
      draft
        ? {
            ...draft,
            tasks: [...draft.tasks, { id: crypto.randomUUID(), label }],
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
            version: 3,
            archivedArticles,
            curriculumTitle,planSummary,
            game: currentGame,
            roadmapStages: editableRoadmapStages,
            focusItems,
            curriculum: optionalCurriculum,
            articles,
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
    link.download = `${currentGame?.name.replace(/[^a-z0-9-]/gi, "-") ?? "game"}-documentation.json`;
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
        if (!parsed.fields || typeof parsed.fields !== "object" || Array.isArray(parsed.fields) || !Object.values(parsed.fields).every(value => typeof value === "string") || Object.keys(parsed.fields).some(key => !articles.some(article => article.fieldKeys.includes(key))))
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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginPending(true);
    try {
      const result = await apiRequest<{ token: string }>(
        "/story-dump/auth/login",
        undefined,
        {
        method: "POST",
        body: JSON.stringify({ username, password }),
        },
      );
      sessionStorage.setItem(authTokenStorageKey, result.token);
      setAuthToken(result.token);
      setLoginError("");
      setDataLoadError("");
      setPassword("");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Could not sign in to the server.",
      );
    } finally {
      setLoginPending(false);
    }
  };

  const signOut = async () => {
    try { await saveQueue.flush(); } catch { return; }
    if (authToken) {
      try {
        await apiRequest<void>("/story-dump/auth/logout", authToken, { method: "POST" });
      } catch (error) {
        console.error("Could not end the server session.", error);
      }
    }
    sessionStorage.removeItem(authTokenStorageKey);
    setAuthToken(null);
    setDataReady(false);
    setDataLoadError("");
  };

  if (!isAuthenticated) {
    return (
      <main className={`login-screen ${darkMode ? "theme-dark" : ""}`}>
        <Button
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
        </Button>
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
            <Button type="submit" disabled={loginPending} disabledReason="Wait for sign-in to finish.">
              {loginPending ? "Signing in..." : <>Enter the archive <span>→</span></>}
            </Button>
          </form>
        </div>
        <div className="login-mark">NJ / 01</div>
      </main>
    );
  }

  if (!dataReady) {
    return (
      <main className={`login-screen ${darkMode ? "theme-dark" : ""}`}>
        <div className="login-panel">
          <div className="login-kicker">FIELD GUIDE // PRIVATE ACCESS</div>
          <h1>{dataLoadError ? "Server unavailable." : "Loading your data."}</h1>
          <p>
            {dataLoadError
              ? dataLoadError
              : "Connecting to your private workspace..."}
          </p>
          {dataLoadError && (
            <Button
              type="button"
              onClick={() => {
                setDataLoadError("");
                setDataLoadAttempt((attempt) => attempt + 1);
              }}
            >
              Try again
            </Button>
          )}
          <Button type="button" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
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
        <GameControls games={games} current={currentGame} onSwitch={switchGame} onCreate={createGame} onUpdate={updateGame} onDelete={deleteGame} token={authToken??undefined} onApplyPlan={applyGamePlan} />
        <nav className="side-nav" aria-label="Documentation sections">
          <Button
            className="nav-home"
            type="button"
            onClick={() => selectArticle("doc-1")}
          >
            <span className="nav-icon">⌂</span> Index
          </Button>
          <Button
            className={`roadmap-nav ${isRoadmapPage ? "active" : ""}`}
            type="button"
            onClick={() => selectArticle("demo-roadmap")}
          >
            <span>{deadlineShort}</span> Deadline & roadmap
          </Button>
          {sections.map((section) => {
            const sectionArticles = articles.filter(article => article.section === section);
            const overview = sectionArticles.find(article => article.title === section);
            const target = overview ?? sectionArticles[0];
            if (!target) return null;
            const children = overview ? sectionArticles.filter(article => article.id !== overview.id) : sectionArticles;
            const selected = !isRoadmapPage && activeArticle.id === overview?.id;
            return <div className="nav-group" key={section}>
              <Button type="button" className={selected ? "nav-section active" : "nav-section"}
                aria-current={selected ? "page" : undefined} onClick={() => selectArticle(target.id)}>
                {sidebarTitle(section)}
              </Button>
              <div className="nav-group-children">
                {children.map(article => {
                  const childSelected = !isRoadmapPage && activeArticle.id === article.id;
                  return <Button type="button" className={childSelected ? "nav-subsection active" : "nav-subsection"}
                    aria-current={childSelected ? "page" : undefined} key={article.id} onClick={() => selectArticle(article.id)}>
                    {sidebarTitle(article.title)}
                  </Button>;
                })}
              </div>
            </div>;
          })}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> {saveState || "Connected"} <span>⌘ K</span>
        </div>
      </aside>
      {menuOpen && (
        <Button
          className="menu-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {roadmapStageDraft && <HeadingDialog key={roadmapStageDraft.id} draft={roadmapStageDraft} isNew={newStageDraft}
        headings={editableRoadmapStages} onSwitchHeading={id => requestHeadingIntent({ kind: "edit", id })} onNewHeading={addHeading}
        onRemove={() => setRemoveHeadingId(roadmapStageDraft.id)} pending={headingPending} dirty={headingDirty}
        saveError={headingIntent ? "" : headingSaveError} timeZone={timeZone} developmentProfile={currentGame ?? undefined}
        taskCatalog={taskCatalog} onAddSuggestion={addSuggestedRoadmapTask}
        onChange={setRoadmapStageDraft} taskLabel={newRoadmapTaskLabel} onTaskLabelChange={setNewRoadmapTaskLabel}
        onAddTask={() => addRoadmapStageTask()} onSave={() => saveRoadmapStage()}
        onClose={() => requestHeadingIntent({ kind: "close" })}>
        {headingIntent && <GameDialog title="Unsaved stage changes" closeDisabled={headingPending} onClose={() => { if (!headingPending) { setHeadingIntent(null); setHeadingSaveError(""); } }}>
          <p className="game-dialog-intro">You have unsaved changes in <strong>{roadmapStageDraft.title || "this new stage"}</strong>.
            {headingIntent.kind === "close" ? " Save them before closing, or discard this draft." : " Save or discard them before opening " + (headingIntent.kind === "new" ? "a new stage." : (editableRoadmapStages.find(stage => stage.id === headingIntent.id)?.title ?? "the selected stage") + ".")}</p>
          {headingSaveError && <p className="game-editor-error" role="alert">{headingSaveError} Your draft has been kept.</p>}
          {headingValidationError(roadmapStageDraft, newRoadmapTaskLabel) && <p className="game-editor-help">{headingValidationError(roadmapStageDraft, newRoadmapTaskLabel)} Keep editing to fix it, or discard the draft.</p>}
          <div className="game-dialog-actions heading-unsaved-actions">
            <Button type="button" autoFocus disabled={headingPending} disabledReason="Wait for this stage to finish saving." onClick={() => { setHeadingIntent(null); setHeadingSaveError(""); }}>Keep editing</Button>
            <Button type="button" disabled={headingPending} disabledReason="Wait for this stage to finish saving." onClick={() => applyHeadingIntent(headingIntent)}>{headingIntent.kind === "close" ? "Discard & close" : "Discard & switch"}</Button>
            <Button type="button" className="game-primary" disabled={headingPending || Boolean(headingValidationError(roadmapStageDraft, newRoadmapTaskLabel))} disabledReason={headingPending ? "Wait for this stage to finish saving." : headingValidationError(roadmapStageDraft, newRoadmapTaskLabel)}
              onClick={() => void saveRoadmapStage(headingIntent)}>{headingPending ? "Saving…" : headingIntent.kind === "close" ? "Save & close" : "Save & switch"}</Button>
          </div>
        </GameDialog>}
        {removeHeadingId && <GameDialog title="Remove this stage?" onClose={() => setRemoveHeadingId(null)}>
          <p className="game-dialog-intro">The stage and its tasks will leave this roadmap, including any edits in this draft. Existing focus items stay in your queue.</p>
          <div className="game-dialog-actions"><Button type="button" onClick={() => setRemoveHeadingId(null)}>Keep stage</Button><Button className="game-primary" type="button" onClick={() => { setEditableRoadmapStages(stages => stages.filter(stage => stage.id !== removeHeadingId)); applyHeadingIntent({ kind: "close" }); }}>Remove stage</Button></div>
        </GameDialog>}
      </HeadingDialog>}
      <main className="main-content">
        <header className="topbar">
          <Button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </Button>
          <div className="breadcrumbs">
            <span>{currentGame?.name.toUpperCase() ?? "NOGGIN JOGGIN"}</span>
            <b>/</b>
            {isRoadmapPage ? "GAME TARGET" : activeArticle.section.toUpperCase()}
            <b>/</b>
            <strong>
              {isRoadmapPage ? deadlineLabel.toUpperCase() : activeArticle.title.toUpperCase()}
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
          <Button
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
          </Button>
          <Button className="theme-toggle" type="button" onClick={() => void signOut()} title="Sign out">
            ↪
          </Button>
        </header>
        <div className="content-wrap">
          <section className="intro-block">
            <div className="eyebrow">
              {isRoadmapPage ? (
                <>GAME MILESTONE <span>//</span> {deadlineLabel.toUpperCase()}</>
              ) : (
                <>
                  {activeArticle.kicker} <span>//</span> {activeArticle.label} /{" "}
                  {String(articles.length).padStart(2, "0")}
                </>
              )}
            </div>
            <h1>{isRoadmapPage ? "Your game roadmap" : activeArticle.title}</h1>
            <p className="lead">
              {isRoadmapPage
                ? `Plan the next milestones for ${currentGame?.name}. Add stages, break them into tasks, and keep your current focus close.`
                : activeArticle.summary}
            </p>
            <div className="tag-row">
              {(isRoadmapPage
                ? ["GAME ROADMAP", "MILESTONES", "CURRENT FOCUS"]
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
                  <Button
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
                  </Button>
                ))
              ) : (
                <p className="empty-state">No stages or saved notes match “{query}”.</p>
              )}
            </section>
          ) : (
            <article className="article-body">
              <div className="section-heading">
                <span>
                  {isRoadmapPage
                    ? "YOUR GAME PLAN"
                    : activeArticle.id === "doc-1"
                    ? "READ THIS FIRST"
                    : "FILL IN THIS SECTION"}
                </span>
                {isRoadmapPage ? (
                  <div className="section-tools">
                    <small role="status">{saveState}</small>
                    {saveState.startsWith("Could not save:") && <Button type="button" onClick={() => void saveQueue.retry().catch(() => {})}>Retry save</Button>}
                    <Button type="button" onClick={exportNotes}>Export game JSON</Button>
                  </div>
                ) : activeArticle.id === "doc-1" ? (
                  <small>GUIDANCE</small>
                ) : (
                  <div className="section-tools">
                    <small>{saveState}</small>
                    {saveState.startsWith("Could not save:") && <Button type="button"
                      onClick={() => void saveQueue.retry().catch(() => {})}>Retry save</Button>}
                    <Button type="button" onClick={exportNotes}>
                      Export game JSON
                    </Button>
                    <Button type="button" onClick={openImportPicker}>
                      Import notes JSON
                    </Button>
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
              {!isRoadmapPage&&currentGame?.planProfile&&<DocumentationTools article={activeArticle} articles={articles} archived={archivedArticles} onCreate={value=>updateDocument("/documentation","POST",value)} onEdit={(key,value)=>updateDocument("/documentation/"+encodeURIComponent(key),"PATCH",value)}/>}
              {isRoadmapPage ? (
                <div className="roadmap-content">
                  <section className="countdown-panel" aria-label={`Countdown: ${deadlineLabel}`}>
                    <div>
                      <span className="roadmap-overline">TIME TO YOUR TARGET</span>
                      {deadline ? <strong>
                        {countdownDays} <small>days</small>{" "}
                        {String(countdownHours).padStart(2, "0")} <small>hours</small>{" "}
                        {String(countdownMinutes).padStart(2, "0")} <small>min</small>{" "}
                        {String(countdownSeconds).padStart(2, "0")} <small>sec</small>
                      </strong> : <strong>No deadline set</strong>}
                      <p>{deadline ? `Target: ${deadlineLabel}, ${currentGame?.deadlineTime} (${timeZone})` : "Open Game settings to choose a target date and time."}</p>
                    </div>
                    <div className="countdown-date">
                      <span>GAME TARGET</span>
                      <b>{deadline ? <>{deadline.toLocaleDateString("en", { month: "short", timeZone }).toUpperCase()}<br />{deadline.toLocaleDateString("en", { year: "numeric", timeZone })}</> : "—"}</b>
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
                            <Button
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
                            </Button>
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
                                  <Button type="submit">Save</Button>
                                  <Button type="button" onClick={() => setEditingFocusId("")}>Cancel</Button>
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
                                  <Button
                                    className="focus-move"
                                    type="button"
                                    aria-label={`Move ${item.title} up`}
                                    disabled={index === 0} disabledReason="This is already the first item in Current Focus."
                                    onClick={() => moveFocusItem(item.id, -1)}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    className="focus-move"
                                    type="button"
                                    aria-label={`Move ${item.title} down`}
                                    disabled={index === activeFocusItems.length - 1} disabledReason="This is already the last item in Current Focus."
                                    onClick={() => moveFocusItem(item.id, 1)}
                                  >
                                    ↓
                                  </Button>
                                  <Button
                                    className="focus-edit"
                                    type="button"
                                    onClick={() => {
                                      setEditingFocusId(item.id);
                                      setFocusError("");
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
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
                                  </Button>
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
                      <Button type="submit">Add item <b>+</b></Button>
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
                                    <Button type="submit">Save</Button>
                                    <Button type="button" onClick={() => setEditingFocusId("")}>Cancel</Button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="focus-item-details">
                                    <h3>{item.title}</h3>
                                    {item.url && <a href={item.url} target="_blank" rel="noreferrer">Open resource <span>↗</span></a>}
                                  </div>
                                  <div className="focus-item-actions">
                                    <Button className="focus-edit" type="button" onClick={() => setEditingFocusId(item.id)}>Edit</Button>
                                    <Button
                                      className="focus-remove"
                                      type="button"
                                      aria-label={`Remove ${item.title} from completed`}
                                      onClick={() => setFocusItems((items) => items.filter((focusItem) => focusItem.id !== item.id))}
                                    >
                                      Remove
                                    </Button>
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
                  <div className="roadmap-heading-bar"><h2>Your roadmap stages</h2><Button type="button" onClick={addHeading}>+ Add stage</Button></div>
                  {deadline && editableRoadmapStages.some(stage => stage.endsOn && stage.endsOn > (currentGame?.deadlineDate ?? "")) && <p className="deadline-warning">A stage runs beyond your deadline. Review its dates or adjust your game target in Game settings.</p>}
                  {!displayStages.length && <p className="roadmap-empty">Your game's roadmap is ready to build. Add a stage, then add the tasks you want to work through.</p>}
                  <div className="roadmap-stages">
                    {displayStages.map((stage, index) => (
                      <section className="roadmap-stage" key={stage.id}>
                        <div className="stage-heading">
                          <span className="stage-number">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <span className="roadmap-overline">{stage.period}{stage.id === currentRoadmapStage?.id ? " · CURRENT" : ""}</span>
                            <h2>{stage.title}</h2><p>{stage.description}</p>
                          </div>
                          <Button className="stage-edit-button" type="button" aria-label={"Edit " + stage.title} onClick={() => startEditingRoadmapStage(stage)}>Edit</Button>
                        </div>
                        <div className="roadmap-task-list">{stage.tasks.map(task => (
                          <FocusTaskRow key={task.id} task={task} inFocus={isTaskInFocus(focusItems, task.id)} onFocus={() => addTaskToFocus(task, task.id)} />
                        ))}</div>
                        <div className="roadmap-empty-tasks">{stage.tasks.length === 0 && <p>No tasks yet. Choose suggestions or write your own.</p>}
                          <Button type="button" onClick={() => startEditingRoadmapStage(stage)}>+ Add tasks</Button>
                        </div>
                      </section>
                    ))}
                  </div>
                  {planSummary&&<section className="plan-milestone-checks"><h2>{planSummary.targetLabel.charAt(0).toUpperCase()+planSummary.targetLabel.slice(1)} acceptance goals</h2>{planSummary.notices.map(notice=><p key={notice}>{notice}</p>)}{planSummary.milestones.map(goal=><details key={goal.title}><summary>{goal.title}</summary><p>{goal.outcome}</p></details>)}</section>}
                  <section className="scope-note">
                    <span className="roadmap-overline">KEEP YOUR NEXT TARGET FINISHABLE</span>
                    <p>
                      {planSummary?.scopeNote ?? "Build one complete playable unit before expanding. Keep learning connected to the next useful experiment and choose only the work your game needs."}
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
                    <div className="resource-list">
                      {roadmapResources.map((resource) => (
                        <a href={resource.href} target="_blank" rel="noreferrer" key={resource.title}>
                          <span><strong>{resource.title}</strong><small>{resource.description}</small></span>
                          <b>↗</b>
                        </a>
                      ))}
                    </div>
                    <p className="later-topics">Use these references to explore engine concepts at your own pace.</p>
                  </section>
                  <section className="curriculum-shelf">
                    <div className="resource-heading">
                      <div>
                        <span className="roadmap-overline">OPTIONAL · FUTURE LEARNING</span>
                        <h2>{curriculumTitle}</h2>
                      </div>
                      <small>{curriculumParts.length === 3 ? "3 learning areas" : `${curriculumParts.reduce((count, part) => count + part.phases.length, 0)} phases`} · {engineTopicCount} topics</small>
                    </div>
                    <p className="curriculum-intro">
                      A standalone optional learning path for general game development, foundational concepts and advanced engine skills. Its content follows engine choice only; until an engine is selected, it begins with shared foundations. Explore one area or phase at a time, with no completion deadline.
                    </p>
                    <div className="curriculum-phase-groups">
                      {curriculumParts.map((part) => (
                        <section className="curriculum-phase-group" key={part.id}>
                          <div className="curriculum-group-heading">
                            <div><span className="roadmap-overline">LEARNING AREA</span><h3>{part.title}</h3></div>
                            <p>{part.description}</p>
                          </div>
                          <div className="curriculum-phases">
                            {part.phases.map((phase) => (
                              <details className="curriculum-phase" key={phase.id}>
                                <summary><span>{phase.title}</span><small>{phase.topics.length} TOPICS</small></summary>
                                {phase.description && <p className="curriculum-phase-description">{phase.description}</p>}
                                <div className="roadmap-task-list">
                                  {phase.topics.map((topic) => (
                                    <FocusTaskRow key={topic.id} task={topic} inFocus={isTaskInFocus(focusItems, topic.id)} onFocus={() => addTaskToFocus(topic, topic.id)} />
                                  ))}
                                </div>
                              </details>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </section>
                  {optionalCurriculum.filter((phase) => phase.gameSpecific).map((phase) => (
                    <section className="game-specific-learning-shelf" key={phase.id}>
                      <span className="roadmap-overline">FOR THIS GAME · OPTIONAL</span>
                      <h2>Extra topics for this game</h2>
                      <p className="curriculum-intro">These practice ideas come from this game’s selected systems, content and target devices. This separate list does not change the full engine learning roadmap.</p>
                      <details className="curriculum-phase">
                        <summary><span>View {phase.topics.length} selected topics</span></summary>
                        <p className="curriculum-phase-description">{phase.description}</p>
                        <div className="roadmap-task-list">
                          {phase.topics.map((topic) => (
                            <FocusTaskRow key={topic.id} task={topic} inFocus={isTaskInFocus(focusItems, topic.id)} onFocus={() => addTaskToFocus(topic, topic.id)} />
                          ))}
                        </div>
                      </details>
                    </section>
                  ))}
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
                    const fieldId = activeArticle.fieldKeys[index] ?? `${activeArticle.id}-${index}`;
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
                    <Button
                      type="button"
                      onClick={() =>
                        previousArticle && selectArticle(previousArticle.id)
                      }
                    >
                      {previousArticle?.title ?? "Start of document"} <b>↗</b>
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="quick-number">B</span>
                  <div>
                    <small>NEXT ENTRY</small>
                    <Button
                      type="button"
                      onClick={() =>
                        nextArticle && selectArticle(nextArticle.id)
                      }
                    >
                      {nextArticle?.title ?? "End of document"} <b>↗</b>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )}
          {!query && !isRoadmapPage && (
            <footer className="article-footer">
              <Button
                type="button"
                disabled={!previousArticle} disabledReason="This is the first page of the documentation."
                onClick={() =>
                  previousArticle && selectArticle(previousArticle.id)
                }
              >
                <span>←</span>
                <small>PREVIOUS</small>
                <strong>{previousArticle?.title ?? "Start"}</strong>
              </Button>
              <Button
                type="button"
                disabled={!nextArticle} disabledReason="This is the last page of the documentation."
                onClick={() => nextArticle && selectArticle(nextArticle.id)}
              >
                <small>NEXT</small>
                <strong>{nextArticle?.title ?? "End of guide"}</strong>
                <span>→</span>
              </Button>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
