'use strict';
const $=s=>document.querySelector(s), app=$('#app');
const SRC='https://fondationscp.wikidot.com/';
const NAV=[
['Base de données',[['Série SCP – FR','#/serie/fr'],['Série I (001–999)','#/serie/1'],['Série II (1000–1999)','#/serie/2'],['Série III (2000–2999)','#/serie/3'],['Série IV (3000–3999)','#/serie/4'],['Série V (4000–4999)','#/serie/5'],['Série VI (5000–5999)','#/serie/6'],['Série VII (6000–6999)','#/serie/7'],['Série VIII (7000–7999)','#/serie/8'],['Série IX (8000–8999)','#/serie/9'],['Série X (9000–9999)','#/serie/10']]],
['Contes',[['Contes français','#/contes/fr'],['Contes anglais (traduits)','#/contes/en'],['Séries et canons','#/canons']]],
['Informations',[['À propos de la Fondation','#/info/apropos'],['Classification SCP','#/info/classes'],['Accréditations','#/info/accreditations'],['Contribuer','#/info/contribuer']]]];
const SIDE=[['Séries SCP',NAV[0][1]],['Contes',NAV[1][1]],['Explications',NAV[2][1]]];
let DB={articles:[],pages:{}};
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inl=t=>esc(t).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%">').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>');
function md(s){return s.split(/\n{2,}/).map(b=>{b=b.trim();let m;if(!b)return'';
 if(m=b.match(/^(#{1,4}) (.*)/))return`<h${m[1].length+1}>${inl(m[2])}</h${m[1].length+1}>`;
 if(/^[-*] /.test(b))return'<ul>'+b.split('\n').map(l=>`<li>${inl(l.replace(/^[-*] /,''))}</li>`).join('')+'</ul>';
 if(b[0]=='>')return`<blockquote>${inl(b.replace(/^> ?/gm,''))}</blockquote>`;
 return`<p>${inl(b).replace(/\n/g,'<br>')}</p>`}).join('')}
const cls=c=>c?`<span class="badge c-${c.toLowerCase()}">${esc(c.toUpperCase())}</span>`:'';
const num=a=>{const m=a.slug.match(/^scp-(\d+)(-fr)?$/i);return m?{n:+m[1],fr:!!m[2]}:null};
const serieOf=a=>{const x=num(a);return !x?null:x.fr?'fr':Math.floor(x.n/1000)+1};
const card=a=>`<a class="card" href="#/article/${a.slug}"><h3>${esc(a.title)}</h3><span class="meta">${cls(a.classe)} ${esc(a.auteur||'')}</span><p>${esc(a.resume||'')}</p></a>`;

const views={
home(){const f=DB.articles.filter(a=>a.type=='scp');return`
<a class="warn" href="#/aleatoire">ATTENTION : LA BASE DE DONNÉES DE LA FONDATION EST CLASSIFIÉE. L’ACCÈS AU PERSONNEL NON AUTORISÉ EST STRICTEMENT INTERDIT. LES CONTREVENANTS SERONT TRAQUÉS, ARRÊTÉS ET EMPRISONNÉS.</a>
<h1>Sécuriser.<br>Contenir.<br>Protéger.</h1>
<p>Base de données francophone des objets, entités et phénomènes anormaux recensés par la Fondation SCP.</p>
<div class="cta"><a class="btn p" href="#/info/contribuer">Rejoindre le projet</a><a class="btn" href="#/info/apropos">Documentation</a><a class="btn" href="#/aleatoire">SCP aléatoire</a></div>
<h2>Dossiers à la une</h2><div class="grid">${f.slice(0,6).map(card).join('')||'<p>Aucun article. Ajoutez-en avec <code>tools/add_article.py</code>.</p>'}</div>
<h2>Parcourir</h2><div class="grid">
<a class="card" href="#/serie/fr"><h3>Série SCP – FR</h3><p>Les rapports de la branche francophone.</p></a>
<a class="card" href="#/serie/1"><h3>Séries I à X</h3><p>Les rapports SCP originaux, 001 à 9999.</p></a>
<a class="card" href="#/contes/fr"><h3>Contes</h3><p>Récits et fictions de l’univers de la Fondation.</p></a>
<a class="card" href="#/canons"><h3>Séries et canons</h3><p>Univers partagés et histoires à suivre.</p></a></div>
<h2>Une collaboration mondiale</h2><p>La Fondation compte des branches dans de nombreuses langues. Le site original de la branche française est <a href="${SRC}">fondationscp.wikidot.com</a> ; SCP International fédère les autres : <a href="http://scp-int.wikidot.com/">scp-int.wikidot.com</a>.</p>`},
serie(id){const fr=id=='fr',n=+id;const lo=fr?0:(n-1)*1000,hi=fr?899:lo+999;
 const have={};DB.articles.forEach(a=>{const x=num(a);if(x&&x.fr==fr&&x.n>=lo&&x.n<=hi)have[x.n]=a});
 let h=`<h1>Série SCP – ${fr?'FR':['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n]}</h1><p class="meta">${lo}–${hi} · ${Object.keys(have).length} article(s) importé(s). Les cases grisées ne sont pas encore ajoutées au site.</p>`;
 for(let s=lo;s<=hi;s+=100){h+=`<h2 id="${s}">${String(s).padStart(3,'0')} – ${s+99}</h2><div class="nums">`;
  for(let i=s;i<s+100&&i<=hi;i++){const l=String(i).padStart(3,'0')+(fr?'-FR':'');h+=have[i]?`<a href="#/article/${have[i].slug}" title="${esc(have[i].title)}">${l}</a>`:`<span>${l}</span>`}h+='</div>'}
 return h},
contes(l){const t=DB.articles.filter(a=>a.type=='conte'&&(a.langue||'fr')==l);return`<h1>Contes ${l=='fr'?'français':'anglais'}</h1><div class="grid">${t.map(card).join('')||'<p>Aucun conte importé pour l’instant.</p>'}</div>`},
canons(){return views.page('canons')},
page(s){const p=DB.pages[s];return p?`<h1>${esc(p.titre)}</h1>${md(p.corps)}`:views.nf()},
info(s){return views.page(s)},
article(s){const a=DB.articles.find(x=>x.slug==s);if(!a)return views.nf();
 return`<p class="meta"><a href="#/">Accueil</a> › <a href="#/serie/${serieOf(a)||'fr'}">${a.type=='scp'?'Séries SCP':'Contes'}</a></p>
 <h1>${esc(a.title)}</h1>${a.sous_titre?`<p class="meta">${esc(a.sous_titre)}</p>`:''}
 <div class="dossier"><p class="meta">${a.classe?`Classe d’objet : ${cls(a.classe)}`:''}<span>Auteur : ${esc(a.auteur||'inconnu')}</span>${a.traducteur?`<span>Traduction : ${esc(a.traducteur)}</span>`:''}</p></div>
 ${md(a.corps||a.resume||'')}
 <div class="rc"><p><b>Source et licence.</b> ${a.source?`Texte original : <a href="${esc(a.source)}">${esc(a.source)}</a>. `:''}© ${esc(a.auteur||'auteur·ice')}, sous licence <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.fr">CC BY-SA 3.0</a>.</p></div>`},
recherche(q){q=decodeURIComponent(q||'').toLowerCase();const r=DB.articles.filter(a=>(a.title+' '+(a.resume||'')+' '+(a.auteur||'')+' '+a.slug).toLowerCase().includes(q));
 return`<h1>Recherche : « ${esc(q)} »</h1><div class="grid">${r.map(card).join('')||'<p>Aucun résultat. Essayez un numéro (ex. 173) ou un mot-clé.</p>'}</div>`},
aleatoire(){const f=DB.articles.filter(a=>a.type=='scp');if(f.length)location.hash='#/article/'+f[Math.random()*f.length|0].slug;return''},
nf(){return'<h1>Dossier introuvable</h1><p>Cette page n’existe pas ou n’a pas encore été ajoutée. <a href="#/">Retour à l’accueil</a>.</p>'}};

function route(){const [,v='',arg]=location.hash.slice(1).split('/');
 const f=v==''?views.home:views[v]||views.nf;app.innerHTML=f(arg&&decodeURIComponent(arg));$('#side').classList.remove('open');
 if(v!='aleatoire')scrollTo(0,0);document.title=(app.querySelector('h1')?.textContent.replace(/\s+/g,' ')||'Accueil')+' – Fondation SCP'}
$('#nav').innerHTML=NAV.map(([t,l])=>`<div class="dd"><button type="button">${t} ▾</button><div class="menu">${l.map(([a,h])=>`<a href="${h}">${a}</a>`).join('')}</div></div>`).join('');
$('#side').innerHTML=SIDE.map(([t,l])=>`<h4>${t}</h4>${l.map(([a,h])=>`<a href="${h}">${a}</a>`).join('')}`).join('')+'<h4>Communauté</h4><a href="'+SRC+'forum:start">Forum</a><a href="'+SRC+'system:join">Rejoindre le site</a><a href="http://scp-int.wikidot.com/">SCP International</a>';
$('#search').onsubmit=e=>{e.preventDefault();location.hash='#/recherche/'+encodeURIComponent($('#q').value)};
$('#theme').onclick=()=>{const t=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
$('#burger').onclick=()=>$('#side').classList.toggle('open');
addEventListener('hashchange',route);
fetch('data/articles.json').then(r=>r.json()).then(d=>{DB=d}).catch(()=>{app.innerHTML='<p>Impossible de charger data/articles.json (ouvrez le site via un serveur ou GitHub Pages).</p>'}).finally(route);
