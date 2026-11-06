import {useEffect,useState} from 'react';
import {ActionButton as Button,ControlAvailability} from './ActionButton';
import {GameDialog,type Game,type GameValues} from './GameControls';
import {apiRequest} from './api';
import {dimensionOptions,type GameDimension} from './game-development';
import DatePicker from './DatePicker';
import type {PlanProfile,PlanOptions,PlanPreview} from './plan-types';
import './GamePlan.css';

const arrayKeys=['playModes','structures','systems','platforms','contentSources','contentTypes','persistence','delivery','services','commerce'] as const;
type ChoiceKey=typeof arrayKeys[number];
type ScalarKey='engine'|'presentation'|'narrative'|'pacing'|'target'|'detail'|'languageScope';
export default function GamePlanWizard({game,token,onCreate,onApply,onClose}:{
  game?:Game;token?:string;onCreate:(values:GameValues)=>Promise<void>;
  onApply:(profile:PlanProfile,dimension:GameDimension,enabledModules:string[],previewToken:string)=>Promise<void>;
  onClose:()=>void;
}) {
  const [options,setOptions]=useState<PlanOptions|null>(null);
  const [profile,setProfile]=useState<PlanProfile|null>(null);
  const [dimension,setDimension]=useState<GameDimension>(game?.gameDimension??'unspecified');
  const [name,setName]=useState(game?.name??'');
  const [date,setDate]=useState('');const [time,setTime]=useState('23:59');const [zone,setZone]=useState('Asia/Karachi');
  const [step,setStep]=useState(0);const [query,setQuery]=useState('');
  const [enabled,setEnabled]=useState<string[]|undefined>(game?.enabledModules??undefined);
  const [preview,setPreview]=useState<PlanPreview|null>(null);
  const [previewRefreshing,setPreviewRefreshing]=useState(false);
  const [error,setError]=useState('');const [pending,setPending]=useState(false);
  const loading=previewRefreshing||(step===3&&!preview&&!error);
  const [discard,setDiscard]=useState(false);const [baseline,setBaseline]=useState('');
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    let cancelled=false;
    void apiRequest<PlanOptions>('/story-dump/games/plan-options',token).then(data=>{
      if(cancelled)return;
      const initial={...data.defaults,...game?.planProfile};
      if(!game?.planProfile&&game)initial.systems=[...game.gameplayFeatures].filter(id=>data.choices.systems.some(o=>o.id===id));
      setOptions(data);setProfile(initial);
      setBaseline(JSON.stringify({profile:initial,dimension:game?.gameDimension??'unspecified',name:game?.name??'',date:'',time:'23:59',zone:'Asia/Karachi',enabled:game?.enabledModules??undefined}));
    }).catch(caught=>{if(!cancelled)setError(caught.message);});
    return()=>{cancelled=true;};
  },[game,token,attempt]);
  useEffect(()=>{
    if(step!==3||!profile)return;
    let cancelled=false;const controller=new AbortController();
    void apiRequest<PlanPreview>('/story-dump/games/preview',token,{method:'POST',signal:controller.signal,body:JSON.stringify({planProfile:profile,gameDimension:dimension,enabledModules:enabled})})
      .then(data=>{if(!cancelled)setPreview(data);}).catch(caught=>{if(!cancelled){setError(caught.message);setPreview(null);}}).finally(()=>{if(!cancelled)setPreviewRefreshing(false);});
    return()=>{cancelled=true;controller.abort();};
  },[step,profile,dimension,enabled,token,attempt]);
  const dirty=Boolean(profile&&baseline&&baseline!==JSON.stringify({profile,dimension,name,date,time,zone,enabled}));
  useEffect(()=>{
    if(!dirty)return;
    const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);
  const close=()=>{if(!pending){if(dirty)setDiscard(true);else onClose();}};
  function change(value:PlanProfile){setProfile(value);setEnabled(undefined);setPreview(null);setError('');}
  function choices(key:ChoiceKey,label:string,help?:string){
    if(!options||!profile)return null;
    const list=options.choices[key].filter(option=>key!=='systems'||!query.trim()||option.label.toLowerCase().includes(query.toLowerCase()));
    return <fieldset className="plan-question"><legend>{label}</legend>{help&&<p>{help}</p>}
      {key==='systems'&&<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search game systems" aria-label="Search game systems"/>}
      <div className="plan-options">{list.map(option=><Button key={option.id} type="button" aria-pressed={profile[key].includes(option.id)} onClick={()=>{
        let next=profile[key].includes(option.id)?profile[key].filter(id=>id!==option.id):[...profile[key],option.id];
        if(key==='persistence'&&option.id==='none'&&next.includes('none'))next=['none'];
        else if(key==='persistence'&&option.id!=='none')next=next.filter(id=>id!=='none');
        if(key==='services'&&option.id==='offline'&&next.includes('offline'))next=['offline'];
        else if(key==='services'&&option.id!=='offline')next=next.filter(id=>id!=='offline');
        change({...profile,[key]:next});
      }}>{option.label}</Button>)}</div>{list.length===0&&<p>No matching systems. Custom sections and tasks can be added after creation.</p>}</fieldset>;
  }
  function scalar(key:ScalarKey,label:string){return options&&profile?<fieldset className="plan-question"><legend>{label}</legend><div className="plan-options">{options.scalars[key].map(option=><Button type="button" key={option.id} aria-pressed={profile[key]===option.id} onClick={()=>change({...profile,[key]:option.id})}>{option.label}</Button>)}</div></fieldset>:null;}
  async function save(){
    if(!preview||!profile)return;
    setPending(true);setError('');
    try {
      const selected=preview.modules.filter(module=>module.enabled&&!module.core).map(module=>module.key);
      if(game)await onApply(profile,dimension,selected,preview.token);
      else await onCreate({name:name.trim(),timeZone:zone,deadlineDate:date,deadlineTime:time,gameDimension:dimension,gameplayFeatures:profile.systems.filter(id=>['movement','platforming','combat','ai','stealth','puzzles','dialogue','inventory','quests','crafting','building','vehicles','strategy'].includes(id)),planProfile:profile,enabledModules:selected,previewToken:preview.token});
      onClose();
    }catch(caught){setError(caught instanceof Error?caught.message:'Could not save this game plan.');}finally{setPending(false);}
  }
  return <GameDialog title={game?'Customize game plan':'Start a game'} className="game-plan-dialog" closeDisabled={pending} onClose={close}>
    <p className="game-dialog-intro">Build a guide and roadmap around your game. Leave uncertain choices open; you can revisit them later.</p>
    <nav className="plan-steps" aria-label="Game setup progress">{['Basics','How it plays','Production','Review plan'].map((label,i)=><Button type="button" key={label} aria-current={step===i?'step':undefined} disabled={pending||(!name.trim()&&!game&&i>0)} disabledReason={pending?'Wait for the game plan to finish saving.':'Enter a working title first.'} onClick={()=>setStep(i)}>{i+1}. {label}</Button>)}</nav>
    {error&&<p className="game-editor-error" role="alert">{error} <Button type="button" disabled={pending} disabledReason="Wait for saving to finish." onClick={()=>{setError('');setPreview(null);setAttempt(n=>n+1);}}>Retry</Button></p>}
    {!profile||!options?<p role="status">{error?'Game setup could not load.':'Loading game setup…'}</p>:<ControlAvailability disabled={pending} reason="Wait for the game plan to finish saving."><div className="plan-step-content">
      {step===0&&<>
        {!game&&<label className="plan-text-label">WORKING TITLE<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} autoFocus value={name} maxLength={120} onChange={e=>setName(e.target.value)} placeholder="Your game’s name"/></label>}
        <fieldset className="plan-question"><legend>2D OR 3D?</legend><div className="plan-options">{dimensionOptions.map(o=><Button key={o.id} type="button" aria-pressed={dimension===o.id} onClick={()=>{setDimension(o.id);setPreview(null);setError('');}}>{o.label}</Button>)}</div></fieldset>
        {scalar('presentation','PRESENTATION')}{scalar('engine','ENGINE')}
        {profile.engine==='other'&&<label className="plan-text-label">ENGINE NAME<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} value={profile.customEngine} maxLength={80} onChange={e=>change({...profile,customEngine:e.target.value})}/></label>}
        {profile.engine!=='undecided'&&<label className="plan-text-label">ENGINE VERSION · OPTIONAL<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} value={profile.engineVersion} maxLength={60} onChange={e=>change({...profile,engineVersion:e.target.value})} placeholder="Leave open if undecided"/></label>}
        {choices('platforms','TARGET DEVICES','Select known targets, or leave undecided.')}
      </>}
      {step===1&&<>
        {choices('playModes','WHO PLAYS?','Select all supported modes. Empty means undecided.')}
        {profile.playModes.some(m=>m!=='solo')&&<label className="plan-text-label">PLAYERS · OPTIONAL<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} value={profile.playerCount} maxLength={60} onChange={e=>change({...profile,playerCount:e.target.value})} placeholder="e.g. 6 players, or 2–4"/></label>}
        {choices('structures','HOW IS PLAY STRUCTURED?')}{scalar('pacing','TIME MODEL')}{scalar('narrative','AUTHORED STORY')}
        {choices('systems','GAME SYSTEMS','Choose what players actually do. A genre or engine does not automatically add mechanics.')}
      </>}
      {step===2&&<>
        {scalar('target','WHAT DO YOU WANT TO BUILD NEXT?')}
        <p className="plan-help">The next target shapes your stages and acceptance goals. Select suggestions later; development stages begin empty.</p>
        <details><summary>Assets and content production</summary>{choices('contentSources','WHERE WILL ASSETS COME FROM?')}{choices('contentTypes','CONTENT YOU NEED')}</details>
        <details><summary>Saving and supported languages</summary>{choices('persistence','WHAT PERSISTS?')}{scalar('languageScope','LANGUAGES')}</details>
        <details><summary>Distribution and ongoing services</summary>{choices('delivery','DELIVERY DESTINATION')}{choices('services','ONLINE SERVICE NEEDS')}{choices('commerce','COMMERCIAL FEATURES')}</details>
        {scalar('detail','DOCUMENTATION DEPTH')}
      </>}
      {step===3&&<>
        {loading&&<p role="status">Preparing your game plan…</p>}
        {preview&&<>
          {game&&game.planProfile&&options&&game.planCatalogVersion!==options.version&&<p className="plan-preservation" role="status">A refreshed optional learning curriculum is available for this game. Review the full engine path below; applying it preserves your current focus links.</p>}
          <div className="plan-preview-summary"><span>YOUR GAME PLAN</span><h3>{preview.pages.length} pages · {preview.stages.length} stages</h3><p>{preview.scopeNote}</p></div>
          {game&&<p className="plan-preservation">Review before applying. Generated pages may move to the archive; notes, custom entries, chosen development tasks, focus and dates stay saved. The full optional curriculum follows this engine; any game-specific study is listed separately. New stage suggestions are shown here; your existing stages remain yours to edit.</p>}
          {preview.notices.map(notice=><p key={notice} className="plan-help">{notice}</p>)}
          <details open><summary>Documentation sidebar <small>{preview.pages.length} pages</small></summary><div className="plan-index-preview">{preview.modules.map(module=><div key={module.key}><Button type="button" aria-pressed={module.enabled} disabled={module.core||previewRefreshing} disabledReason={previewRefreshing?"Wait for the plan preview to update.":"This shared foundation is included in every game. You can customize its entries afterward."} onClick={()=>{setEnabled(preview.modules.filter(m=>!m.core&&(m.key===module.key?!m.enabled:m.enabled)).map(m=>m.key));setPreviewRefreshing(true);setError('');}}>{module.enabled?'✓ ': '+ '}{module.title}</Button><p>{module.reason}</p>{module.enabled&&<ul>{preview.pages.filter(p=>p.section===module.title&&p.title!==module.title).map(p=><li key={p.id}>{p.title}</li>)}</ul>}</div>)}<div><strong>How to Use This Document & engine implementation</strong><ul>{preview.pages.filter(p=>p.id==='doc-1'||p.section.endsWith(' Implementation')).map(p=><li key={p.id}>{p.title}</li>)}</ul></div></div></details>
          <details><summary>Development roadmap <small>{preview.stages.length} stages</small></summary>{preview.stages.map(stage=><div className="plan-preview-stage" key={stage.id}><h4>{stage.title}</h4><p>{stage.description}</p><ul>{preview.taskCatalog.find(c=>c.id===stage.id)?.tasks.slice(0,4).map(task=><li key={task.id}>{task.label}</li>)}</ul><small>Suggestions to choose from · no tasks added automatically</small></div>)}</details>
          <details><summary>{preview.curriculumTitle} · full engine roadmap <small>{preview.curriculum.filter(phase=>!phase.gameSpecific).length} phases · {preview.curriculum.filter(phase=>!phase.gameSpecific).reduce((count,phase)=>count+phase.tasks.length,0)} topics</small></summary>{preview.curriculum.filter(phase=>!phase.gameSpecific).map(phase=><div className="plan-preview-stage" key={phase.id}><h4>{phase.title}</h4>{phase.description&&<p>{phase.description}</p>}<ul>{phase.tasks.map(task=><li key={task.id}>{task.label}</li>)}</ul></div>)}</details>
          {preview.curriculum.some(phase=>phase.gameSpecific)&&<details><summary>Optional topics for this game <small>{preview.curriculum.filter(phase=>phase.gameSpecific).reduce((count,phase)=>count+phase.tasks.length,0)} topics</small></summary><p className="plan-help">These are generated from the selected game profile and sit outside the complete engine curriculum.</p>{preview.curriculum.filter(phase=>phase.gameSpecific).map(phase=><div className="plan-preview-stage" key={phase.id}><h4>{phase.title}</h4><p>{phase.description}</p><ul>{phase.tasks.map(task=><li key={task.id}>{task.label}</li>)}</ul></div>)}</details>}
          <details><summary>Target acceptance goals</summary>{preview.milestones.map(goal=><div className="plan-preview-stage" key={goal.title}><h4>{goal.title}</h4><p>{goal.outcome}</p></div>)}</details>
          {!game&&<div className="game-editor plan-target-dates"><DatePicker disabled={pending} label="TARGET DATE · OPTIONAL" value={date} onChange={setDate} timeZone={zone}/><label>TARGET TIME<input type="time" value={time} disabled={pending||!date} data-disabled-reason={pending?'Wait for saving to finish.':!date?'Choose a target date first.':undefined} onChange={e=>setTime(e.target.value)}/></label><label>TIMEZONE<input disabled={pending} data-disabled-reason={pending?"Wait for saving to finish.":undefined} value={zone} onChange={e=>setZone(e.target.value)} required/></label><p className="plan-help">Dates stay empty until you choose them. Stage dates are not estimated automatically.</p></div>}
        </>}
      </>}
    </div><div className="game-dialog-actions plan-footer">
      <Button type="button" onClick={close}>Cancel</Button><Button type="button" disabled={step===0} disabledReason="You are on the first setup step." onClick={()=>setStep(n=>n-1)}>Back</Button>
      {step<3?<Button type="button" className="game-primary" disabled={!game&&!name.trim()} disabledReason="Enter a working title first." onClick={()=>setStep(n=>n+1)}>Continue</Button>:<Button type="button" className="game-primary" disabled={!preview||loading||pending||(!game&&!name.trim())||(!game&&Boolean(date)&&!time)} disabledReason={loading?'Wait for the plan preview.':error?'Resolve the profile errors before saving.':!game&&!name.trim()?'Enter a working title first.':!time?'Choose a target time.':'Wait for saving to finish.'} onClick={()=>void save()}>{pending?'Saving…':game?'Apply reviewed plan':'Create game'}</Button>}
    </div></ControlAvailability>}
    {discard&&<GameDialog title="Leave game setup?" onClose={()=>setDiscard(false)}><p className="game-dialog-intro">Your setup choices have not been saved.</p><div className="game-dialog-actions"><Button type="button" onClick={()=>setDiscard(false)}>Keep editing</Button><Button type="button" onClick={onClose}>Discard setup</Button><Button type="button" className="game-primary" onClick={()=>{setDiscard(false);setStep(3);}}>Review & save</Button></div></GameDialog>}
  </GameDialog>;
}
