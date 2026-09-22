import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { articles } from "./content";
import { keepCursorInView } from "./caret";
import "./App.css";
const sections = [...new Set(articles.map((article) => article.section))];
const themeStorageKey = "noggin-joggin-theme";

type FieldValues = Record<string, string>;
type SearchResult = {
  article: (typeof articles)[number];
  fieldId: string;
  fieldLabel: string;
  excerpt: string;
  isNote: boolean;
};
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
    const textarea = inputRef.current;
    if (!textarea) return;
    const parent = textarea.parentElement;

    const prevScrollY = window.scrollY;

    // Prevent parent container and document height from collapsing,
    // which would cause the browser to clamp scrollY upwards
    if (parent) {
      parent.style.minHeight = `${parent.offsetHeight}px`;
    }

    textarea.style.height = "auto";
    const computed = window.getComputedStyle(textarea);
    const borderBoxOffset =
      computed.boxSizing === "border-box"
        ? (parseFloat(computed.borderTopWidth) || 0) +
          (parseFloat(computed.borderBottomWidth) || 0)
        : 0;
    const newHeight = Math.max(textarea.scrollHeight + borderBoxOffset, 31);
    textarea.style.height = `${newHeight}px`;

    if (parent) {
      parent.style.minHeight = "";
    }

    // If window.scrollY was shifted during measurement, restore it immediately
    if (window.scrollY !== prevScrollY) {
      window.scrollTo({ top: prevScrollY });
    }
  };

  useLayoutEffect(() => {
    resize();
  }, [value]);

  // Handle focusOnLoad: only programmatically focus if not already focused
  useEffect(() => {
    if (!focusOnLoad || !inputRef.current) return;
    if (document.activeElement === inputRef.current) return;

    inputRef.current.focus({ preventScroll: true });
    inputRef.current.setSelectionRange(cursor, cursor);
    keepCursorInView(inputRef.current, { alignMiddle: true });
  }, [focusOnLoad, cursor]);

  // Keep cursor visible when mobile virtual keyboard opens/resizes or visualViewport scrolls
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportChange = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        keepCursorInView(inputRef.current, { immediate: false });
      }
    };

    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);

    return () => {
      vv.removeEventListener("resize", handleViewportChange);
      vv.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  return (
    <label className="field-row">
      <span>{label}</span>
      <textarea
        ref={inputRef}
        value={value}
        onFocus={(event) => {
          const target = event.currentTarget;
          onCursorChange(fieldId, target.selectionStart);
          keepCursorInView(target, { alignMiddle: false });
          // Re-check after mobile virtual keyboard animation completes (~350ms)
          window.setTimeout(() => {
            if (document.activeElement === target) {
              keepCursorInView(target, { alignMiddle: false });
            }
          }, 350);
        }}
        onClick={(event) => {
          onCursorChange(fieldId, event.currentTarget.selectionStart);
          keepCursorInView(event.currentTarget, { immediate: true });
        }}
        onKeyUp={(event) => {
          onCursorChange(fieldId, event.currentTarget.selectionStart);
          keepCursorInView(event.currentTarget, { immediate: true });
        }}
        onSelect={(event) => {
          onCursorChange(fieldId, event.currentTarget.selectionStart);
        }}
        onChange={(event) => {
          onChange(fieldId, event.target.value);
          onCursorChange(fieldId, event.target.selectionStart);
          resize();
          keepCursorInView(event.currentTarget, { immediate: true });
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
  const [saveState, setSaveState] = useState("Loading notes...");
  const notesLoaded = useRef(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const activeArticle =
    articles.find((article) => article.id === activeId) ?? articles[0];
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
            {activeArticle.section.toUpperCase()}
            <b>/</b>
            <strong>{activeArticle.title.toUpperCase()}</strong>
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
              {activeArticle.kicker} <span>//</span> {activeArticle.label} /{" "}
              {String(articles.length).padStart(2, "0")}
            </div>
            <h1>{activeArticle.title}</h1>
            <p className="lead">{activeArticle.summary}</p>
            <div className="tag-row">
              {activeArticle.tags.map((tag) => (
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
                  {activeArticle.id === "doc-1"
                    ? "READ THIS FIRST"
                    : "FILL IN THIS SECTION"}
                </span>
                {activeArticle.id === "doc-1" ? (
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
              {activeArticle.id === "doc-1" ? (
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
          {!query && (
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
