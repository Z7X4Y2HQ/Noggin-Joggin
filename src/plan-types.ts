export type PlanProfile = {
  engine:string; engineVersion:string; customEngine:string; narrative:string; pacing:string;
  presentation:string; target:string; detail:string; languageScope:string; playerCount:string;
  playModes:string[]; structures:string[]; systems:string[]; platforms:string[]; contentSources:string[];
  contentTypes:string[]; persistence:string[]; delivery:string[]; services:string[]; commerce:string[];
};
export type PlanOption = {id:string;label:string};
export type PlanOptions = {version:string;scalars:Record<string,PlanOption[]>;choices:Record<string,PlanOption[]>;defaults:PlanProfile};
export type PlanPreview = {
  version:string;token:string;profile:PlanProfile;curriculumTitle:string;targetLabel:string;scopeNote:string;notices:string[];
  modules:{key:string;title:string;core:boolean;enabled:boolean;reason:string}[];
  pages:{id:string;title:string;section:string;fields:{key:string;label:string}[]}[];
  stages:{id:string;title:string;description:string}[];
  curriculum:{id:string;title:string;description:string;gameSpecific?:boolean;tasks:{id:string;label:string}[]}[];
  taskCatalog:{id:string;title:string;tasks:{id:string;label:string;outcome:string}[]}[];
  milestones:{title:string;outcome:string}[];
};
export type PlanSummary = Pick<PlanPreview,'targetLabel'|'scopeNote'|'milestones'|'notices'>;
