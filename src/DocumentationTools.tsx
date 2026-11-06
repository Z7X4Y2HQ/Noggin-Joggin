import {useState} from 'react';
import {ActionButton as Button,ControlAvailability} from './ActionButton';
import {GameDialog} from './GameControls';
export type EditableArticle={id:string;title:string;section:string;body:string[]};
export default function DocumentationTools({article,articles,archived,onCreate,onEdit}:{article:EditableArticle;articles:EditableArticle[];archived:EditableArticle[];
  onCreate:(value:{title:string;section:string;prompts:string[]})=>Promise<void>;
  onEdit:(key:string,value:{title?:string;archived?:boolean;direction?:number})=>Promise<void>;
}) {
  const [mode,setMode]=useState<'add'|'rename'|'archive'|'library'|null>(null);
  const [title,setTitle]=useState('');const [section,setSection]=useState('');const [prompts,setPrompts]=useState('');
  const [pending,setPending]=useState(false);const [error,setError]=useState('');const [discard,setDiscard]=useState(false);const [baseline,setBaseline]=useState('');const [search,setSearch]=useState('');
  const snapshot=()=>JSON.stringify({title,section,prompts});
  function open(next:typeof mode){setError('');const initial={title:next==='rename'?article.title:'',section:article.section,prompts:article.id==='doc-1'?'Purpose\nRules and conditions\nImplementation notes\nTest scenarios':article.body.join('\n')};setTitle(initial.title);setSection(initial.section);setPrompts(initial.prompts);setBaseline(JSON.stringify(initial));setMode(next);}
  function close(){if(pending)return;if((mode==='add'||mode==='rename')&&snapshot()!==baseline)setDiscard(true);else setMode(null);}
  async function act(action:()=>Promise<void>){setPending(true);setError('');try{await action();setMode(null);}catch(caught){setError(caught instanceof Error?caught.message:'Could not update the index.');}finally{setPending(false);}}
  const lines=prompts.split('\n').map(s=>s.trim()).filter(Boolean);
  const invalid=!title.trim()||(mode==='add'&&(!section.trim()||lines.length<1||lines.length>30||lines.some(l=>l.length>240)||new Set(lines).size!==lines.length));
  const siblings=articles.filter(p=>p.section===article.section);const overview=siblings.find(p=>p.id.endsWith('-overview')||p.id.startsWith('section-')||p.title===p.section);const ordered=siblings.filter(p=>p.id!==overview?.id);const position=ordered.findIndex(p=>p.id===article.id);
  return <div className="documentation-tools">
    <Button type="button" onClick={()=>open('add')}>+ Add entry / section</Button>
    {article.id!=='doc-1'&&<><Button type="button" onClick={()=>open('rename')}>Rename</Button><Button type="button" onClick={()=>open('archive')}>Archive page</Button>
      <Button type="button" disabled={pending||position<=0} disabledReason={pending?'Wait for the index change to save.':'This page is the section overview or the first child page.'} onClick={()=>void act(()=>onEdit(article.id,{direction:-1}))}>Move up</Button>
      <Button type="button" disabled={pending||position<0||position===ordered.length-1} disabledReason={pending?'Wait for the index change to save.':'This page is the section overview or the last child page.'} onClick={()=>void act(()=>onEdit(article.id,{direction:1}))}>Move down</Button></>}
    <Button type="button" onClick={()=>open('library')}>Archived pages ({archived.length})</Button>
    {error&&!mode&&<p role="alert" className="game-editor-error">{error}</p>}
    {pending&&!mode&&<GameDialog title="Saving index order" closeDisabled onClose={()=>{}}><p role="status" className="game-dialog-intro">Saving your documentation order…</p></GameDialog>}
    {mode&&<GameDialog title={{add:'Add documentation entry',rename:'Rename page',archive:'Archive this page?',library:'Archived documentation'}[mode]} closeDisabled={pending} onClose={close}>
      <ControlAvailability disabled={pending} reason="Wait for the documentation change to save.">
      {error&&<p role="alert" className="game-editor-error">{error}</p>}
      {(mode==='add'||mode==='rename')&&<form className="game-editor plan-entry-form" onSubmit={event=>{event.preventDefault();if(!invalid)void act(()=>mode==='add'?onCreate({title,section,prompts:lines}):onEdit(article.id,{title}));}}>
        <p className="game-editor-help">{mode==='add'?'Create another role, ability, location, puzzle or custom page. The prompts below are copied from the current page and can be changed.':'The page keeps its notes and stable references.'}</p>
        <label>PAGE / ENTRY NAME<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} autoFocus value={title} maxLength={120} onChange={e=>setTitle(e.target.value)}/></label>
        {mode==='add'&&<><label>SECTION<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} value={section} maxLength={120} onChange={e=>setSection(e.target.value)}/></label><details><summary>Use an existing section</summary><div className="plan-options">{[...new Set(articles.map(a=>a.section))].map(name=><Button key={name} type="button" aria-pressed={section===name} onClick={()=>setSection(name)}>{name}</Button>)}</div></details><label>PROMPTS · ONE PER LINE<textarea disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} rows={8} value={prompts} onChange={e=>setPrompts(e.target.value)} maxLength={7500}/></label><p className="plan-help">1–30 distinct prompts, up to 240 characters each. A new section name creates a new sidebar group.</p></>}
        <div className="game-dialog-actions"><Button type="button" onClick={close}>Cancel</Button><Button type="submit" className="game-primary" disabled={invalid} disabledReason="Enter a name, section and 1–30 distinct prompts within the displayed limits.">{pending?'Saving…':'Save entry'}</Button></div>
      </form>}
      {mode==='archive'&&<><p className="game-dialog-intro">Archive “{article.title}”? Its notes stay saved and can be restored from Archived pages.</p><div className="game-dialog-actions"><Button type="button" onClick={close}>Keep page</Button><Button type="button" onClick={()=>void act(()=>onEdit(article.id,{archived:true}))}>Archive page</Button></div></>}
      {mode==='library'&&<><input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} className="plan-archive-search" type="search" aria-label="Search archived pages" placeholder="Search archived pages" value={search} onChange={e=>setSearch(e.target.value)}/><div className="plan-archive-list">{archived.filter(p=>(p.section+' '+p.title).toLowerCase().includes(search.toLowerCase())).map(page=><div key={page.id}><span><small>{page.section}</small>{page.title}</span><Button type="button" onClick={()=>void act(()=>onEdit(page.id,{archived:false}))}>Restore</Button></div>)}</div>{!archived.length&&<p className="game-editor-help">No archived pages. Profile changes preserve replaced pages here.</p>}</>}
      </ControlAvailability>
      {discard&&<GameDialog title="Discard entry changes?" onClose={()=>setDiscard(false)}><p className="game-dialog-intro">This entry has unsaved changes.</p><div className="game-dialog-actions"><Button type="button" onClick={()=>setDiscard(false)}>Keep editing</Button><Button type="button" onClick={()=>{setDiscard(false);setMode(null);}}>Discard changes</Button><Button type="button" disabled={invalid} disabledReason="Complete the entry’s required fields before saving." onClick={()=>{setDiscard(false);void act(()=>mode==='add'?onCreate({title,section,prompts:lines}):onEdit(article.id,{title}));}}>Save & close</Button></div></GameDialog>}
    </GameDialog>}
  </div>;
}
