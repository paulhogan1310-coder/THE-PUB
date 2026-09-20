import { put, head } from "@vercel/blob";
const KEY="the-pub/state.json";
const defaults={
version:2,phase:"PRE-MATCH",lastUpdated:"2026-09-20T07:35:00-04:00",
fixture:{home:"Bournemouth",away:"Liverpool",date:"Sep 20, 2026",venue:"Vitality Stadium",kickoff:"9:00 AM EDT / 2:00 PM BST"},
gaffer:{manager:"Andoni Iraola",status:"CURRENT",lastVerified:"Sep 20 2026 07:35 EDT",takeaways:["No new injuries reported in the cited Liverpool team-news item.","Unavailable: Conor Bradley, Federico Chiesa, Hugo Ekitike and Giovanni Leoni — verify again before publication.","Returning to Vitality adds context to the fixture; keep any direct quotation tied to its official source."],unavailable:["Conor Bradley","Federico Chiesa","Hugo Ekitike","Giovanni Leoni"],sourceLabel:"Liverpool FC team news — verify current page before matchday publication",sourceUrl:"https://www.liverpoolfc.com/news/afc-bournemouth-v-liverpool-team-news-1"},
pubTalk:{lastVerified:"Sep 20 2026 07:35 EDT",bigStory:"Iraola returns to Vitality as Liverpool head coach. Refresh this item from current official reporting before participant release.",footballQuestion:"How much will familiarity between Iraola and Bournemouth shape the match?",aroundClub:"Use this space for one verified, genuinely current club talking point.",pubTake:"Does familiarity favor Iraola, or does it help Bournemouth anticipate his approach?"},
why:{then:["Liverpool and Bournemouth have produced notable high-scoring and upset results in prior meetings.","Andoni Iraola previously managed Bournemouth — historical context only."],now:["CURRENT MANAGERS — verify from official club sources on match morning.","TEAM NEWS — Liverpool unavailable list requires final matchday verification; Bournemouth remains awaiting verified official update.","FORM — refresh from official competition/club sources before publication."]},
terrace:[
{title:"You'll Never Walk Alone",type:"EVERGREEN",story:"Liverpool's pre-match anthem and enduring supporter ritual.",when:"Pre-match and often after full-time",url:""},
{title:"Fields of Anfield Road",type:"EVERGREEN",story:"Long-standing Liverpool supporter song.",when:"Commonly heard from supporters",url:""},
{title:"Allez Allez Allez",type:"EVERGREEN",story:"A modern Liverpool terrace staple associated strongly with European runs.",when:"Often after big moments and on European nights",url:""},
{title:"Virgil van Dijk",type:"CURRENT PLAYER — REVERIFY",story:"Keep only while current-player relevance is verified; do not invent or reproduce unverified lyrics.",when:"When heard from supporters",url:""}
],
ground:{status:"AWAITING LIVE",teamStatus:"AWAITING OFFICIAL UPDATE — T-60",teamText:"Confirmed teams expected approximately one hour before kickoff. Check back when official teams drop.",updates:[]},
round:{question:"What's your pre-match call?",options:["Bournemouth 0-2 Liverpool","Bournemouth 1-2 Liverpool","1-1 Draw","Bournemouth 2-1 Liverpool"]},
fulltime:{score:"Score to be confirmed live.",motm:"Awaiting full time.",feeling:"",managerReaction:"Awaiting verified reaction.",lastSong:"Only publish when genuinely identifiable / verified."}
};
async function load(){try{const m=await head(KEY);const r=await fetch(m.url,{cache:"no-store"});if(r.ok)return await r.json()}catch{}const s={content:defaults,votes:{},events:[]};await save(s);return s}
async function save(s){await put(KEY,JSON.stringify(s),{access:"public",addRandomSuffix:false,allowOverwrite:true,contentType:"application/json"})}
const send=(res,n,o)=>{res.setHeader("Cache-Control","no-store");return res.status(n).json(o)};
const authed=req=>process.env.PUB_ADMIN_TOKEN&&(req.headers.authorization||"")===`Bearer ${process.env.PUB_ADMIN_TOKEN}`;
export default async function handler(req,res){try{const p=(req.url||"").split("?")[0],s=await load();
if(p.endsWith("/content")){if(req.method==="GET")return send(res,200,s.content);if(req.method==="PUT"){if(!authed(req))return send(res,401,{error:"Unauthorized"});s.content={...req.body,lastUpdated:new Date().toISOString()};await save(s);return send(res,200,s.content)}}
if(p.endsWith("/votes")){if(req.method==="GET")return send(res,200,s.votes||{});if(req.method==="POST"){const o=String(req.body?.option||"").slice(0,100);if(!o)return send(res,400,{error:"Missing option"});s.votes=s.votes||{};s.votes[o]=(Number(s.votes[o])||0)+1;await save(s);return send(res,200,s.votes)}}
if(p.endsWith("/events")&&req.method==="POST"){const e=req.body||{};s.events=Array.isArray(s.events)?s.events:[];s.events.push({t:new Date().toISOString(),type:String(e.type||"").slice(0,40),detail:String(e.detail||"").slice(0,120),sid:String(e.sid||"").slice(0,80)});s.events=s.events.slice(-500);await save(s);return send(res,200,{ok:true})}
return send(res,405,{error:"Method not allowed"})}catch(e){return send(res,500,{error:"Backend error",detail:String(e?.message||e)})}}
