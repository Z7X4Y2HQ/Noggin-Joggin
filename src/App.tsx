import { useMemo, useState } from 'react'
import { articles } from './content'
import './App.css'
const sections = [...new Set(articles.map((article) => article.section))]

function App() {
  const [activeId, setActiveId] = useState('doc-1')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('noggin-joggin-field-values') ?? '{}') as Record<string, string>
    } catch {
      return {}
    }
  })
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
  const updateField = (fieldId: string, value: string) => {
    setFieldValues((currentValues) => {
      const nextValues = { ...currentValues, [fieldId]: value }
      localStorage.setItem('noggin-joggin-field-values', JSON.stringify(nextValues))
      return nextValues
    })
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
          {query ? <section className="search-results"><div className="section-heading"><span>SEARCH RESULTS</span><small>{filteredArticles.length} matches</small></div>{filteredArticles.length ? filteredArticles.map((article) => <button className="result-row" type="button" key={article.id} onClick={() => selectArticle(article.id)}><span>{article.label}</span><strong>{article.title}</strong><small>{article.section}</small><i>↗</i></button>) : <p className="empty-state">No field notes match “{query}”.</p>}</section> : <article className="article-body"><div className="section-heading"><span>FILL IN THIS SECTION</span><small>{activeArticle.body.length || 1} FIELDS</small></div><div className="field-list">{(activeArticle.body.length ? activeArticle.body : ['Section notes']).map((fieldLabel, index) => { const fieldId = `${activeArticle.id}-${index}`; return <label className="field-row" key={fieldId}><span>{fieldLabel}</span><textarea value={fieldValues[fieldId] ?? ''} onChange={(event) => updateField(fieldId, event.target.value)} placeholder="Add your notes here..." rows={2} /></label> })}</div><blockquote>“The best discoveries are usually hiding in the detail you almost skipped.”</blockquote><div className="quick-links"><div><span className="quick-number">A</span><div><small>PREVIOUS ENTRY</small><button type="button" onClick={() => previousArticle && selectArticle(previousArticle.id)}>{previousArticle?.title ?? 'Start of document'} <b>↗</b></button></div></div><div><span className="quick-number">B</span><div><small>NEXT ENTRY</small><button type="button" onClick={() => nextArticle && selectArticle(nextArticle.id)}>{nextArticle?.title ?? 'End of document'} <b>↗</b></button></div></div></div></article>}
          {!query && <footer className="article-footer"><button type="button" disabled={!previousArticle} onClick={() => previousArticle && selectArticle(previousArticle.id)}><span>←</span><small>PREVIOUS</small><strong>{previousArticle?.title ?? 'Start'}</strong></button><button type="button" disabled={!nextArticle} onClick={() => nextArticle && selectArticle(nextArticle.id)}><small>NEXT</small><strong>{nextArticle?.title ?? 'End of guide'}</strong><span>→</span></button></footer>}
        </div>
      </main>
    </div>
  )
}

export default App
