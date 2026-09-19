import { useEffect, useMemo, useRef, useState } from 'react'
import { articles } from './content'
import './App.css'
const sections = [...new Set(articles.map((article) => article.section))]

type FieldValues = Record<string, string>

function NoteField({ fieldId, label, value, onChange }: { fieldId: string; label: string; value: string; onChange: (fieldId: string, value: string) => void }) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const resize = () => {
    if (!inputRef.current) return
    inputRef.current.style.height = '0px'
    inputRef.current.style.height = `${Math.max(inputRef.current.scrollHeight, 31)}px`
  }

  useEffect(() => resize(), [value])

  return <label className="field-row"><span>{label}</span><textarea ref={inputRef} value={value} onChange={(event) => { onChange(fieldId, event.target.value); resize() }} placeholder="Write here..." rows={1} /></label>
}

function App() {
  const [activeId, setActiveId] = useState('doc-1')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [saveState, setSaveState] = useState('Loading notes...')
  const notesLoaded = useRef(false)
  const importInputRef = useRef<HTMLInputElement>(null)
  const activeArticle = articles.find((article) => article.id === activeId) ?? articles[0]
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return articles
    return articles.filter((article) => [article.title, article.section, article.summary, ...article.tags].join(' ').toLowerCase().includes(normalizedQuery))
  }, [query])
  const selectArticle = (id: string) => { setActiveId(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const activeIndex = articles.findIndex((article) => article.id === activeArticle.id)
  const previousArticle = articles[activeIndex - 1]
  const nextArticle = articles[activeIndex + 1]
  useEffect(() => {
    fetch('/api/notes')
      .then((response) => response.json() as Promise<{ fields?: FieldValues }>)
      .then((saved) => {
        setFieldValues(saved.fields ?? {})
        notesLoaded.current = true
        setSaveState('Saved to notes.json')
      })
      .catch(() => setSaveState('Notes file unavailable'))
  }, [])
  useEffect(() => {
    if (!notesLoaded.current) return
    setSaveState('Saving...')
    const saveTimer = window.setTimeout(() => {
      fetch('/api/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: 1, savedAt: new Date().toISOString(), fields: fieldValues }) })
        .then(() => setSaveState('Saved to notes.json'))
        .catch(() => setSaveState('Could not save notes.json'))
    }, 350)
    return () => window.clearTimeout(saveTimer)
  }, [fieldValues])
  const updateField = (fieldId: string, value: string) => {
    setFieldValues((currentValues) => ({ ...currentValues, [fieldId]: value }))
  }
  const exportNotes = () => {
    const file = new Blob([JSON.stringify({ app: 'Noggin Joggin', version: 1, savedAt: new Date().toISOString(), fields: fieldValues }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'noggin-joggin-notes.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  const importNotes = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { fields?: FieldValues }
        if (!parsed.fields || typeof parsed.fields !== 'object') throw new Error('Invalid notes file')
        setFieldValues(parsed.fields)
        setSaveState('Imported; saving...')
      } catch {
        setSaveState('Could not import file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="brand-mark"><span className="brand-symbol">NJ</span><span><strong>Noggin</strong> Joggin</span></div>
        <div className="edition">FIELD GUIDE <span>v1.0</span></div>
        <nav className="side-nav" aria-label="Documentation sections">
          <button className="nav-home" type="button" onClick={() => selectArticle('doc-1')}><span className="nav-icon">⌂</span> Index</button>
          {sections.map((section) => <div className="nav-group" key={section}><p>{section}</p>{articles.filter((article) => article.section === section).map((article) => <button type="button" className={activeArticle.id === article.id ? 'active' : ''} key={article.id} onClick={() => selectArticle(article.id)}><span>{article.label}</span>{article.title}</button>)}</div>)}
        </nav>
        <div className="sidebar-footer"><span className="status-dot" /> Archive synced <span>⌘ K</span></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="menu-button" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>☰</button><div className="breadcrumbs"><span>NOGGIN JOGGIN</span><b>/</b>{activeArticle.section.toUpperCase()}<b>/</b><strong>{activeArticle.title.toUpperCase()}</strong></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the guide..." aria-label="Search the guide" /><kbd>⌘ K</kbd></label></header>
        <div className="content-wrap">
          <section className="intro-block"><div className="eyebrow">{activeArticle.kicker} <span>//</span> {activeArticle.label} / {String(articles.length).padStart(2, '0')}</div><h1>{activeArticle.title}</h1><p className="lead">{activeArticle.summary}</p><div className="tag-row">{activeArticle.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
          <div className="rule" />
          {query ? <section className="search-results"><div className="section-heading"><span>SEARCH RESULTS</span><small>{filteredArticles.length} matches</small></div>{filteredArticles.length ? filteredArticles.map((article) => <button className="result-row" type="button" key={article.id} onClick={() => selectArticle(article.id)}><span>{article.label}</span><strong>{article.title}</strong><small>{article.section}</small><i>↗</i></button>) : <p className="empty-state">No field notes match “{query}”.</p>}</section> : <article className="article-body"><div className="section-heading"><span>{activeArticle.id === 'doc-1' ? 'READ THIS FIRST' : 'FILL IN THIS SECTION'}</span>{activeArticle.id === 'doc-1' ? <small>GUIDANCE</small> : <div className="section-tools"><small>{saveState}</small><button type="button" onClick={exportNotes}>Export JSON</button><button type="button" onClick={() => importInputRef.current?.click()}>Import JSON</button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) importNotes(file); event.target.value = '' }} /></div>}</div>{activeArticle.id === 'doc-1' ? <div className="read-only-notes">{activeArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div> : <div className="field-list">{(activeArticle.body.length ? activeArticle.body : ['Section notes']).map((fieldLabel, index) => { const fieldId = `${activeArticle.id}-${index}`; return <NoteField fieldId={fieldId} label={fieldLabel} value={fieldValues[fieldId] ?? ''} onChange={updateField} key={fieldId} /> })}</div>}<blockquote>“The best discoveries are usually hiding in the detail you almost skipped.”</blockquote><div className="quick-links"><div><span className="quick-number">A</span><div><small>PREVIOUS ENTRY</small><button type="button" onClick={() => previousArticle && selectArticle(previousArticle.id)}>{previousArticle?.title ?? 'Start of document'} <b>↗</b></button></div></div><div><span className="quick-number">B</span><div><small>NEXT ENTRY</small><button type="button" onClick={() => nextArticle && selectArticle(nextArticle.id)}>{nextArticle?.title ?? 'End of document'} <b>↗</b></button></div></div></div></article>}
          {!query && <footer className="article-footer"><button type="button" disabled={!previousArticle} onClick={() => previousArticle && selectArticle(previousArticle.id)}><span>←</span><small>PREVIOUS</small><strong>{previousArticle?.title ?? 'Start'}</strong></button><button type="button" disabled={!nextArticle} onClick={() => nextArticle && selectArticle(nextArticle.id)}><small>NEXT</small><strong>{nextArticle?.title ?? 'End of guide'}</strong><span>→</span></button></footer>}
        </div>
      </main>
    </div>
  )
}

export default App
