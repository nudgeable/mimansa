/* Mimansa shared layer.
   1. Membership: visitor / member / creator. In this review draft the state lives in the browser
      (the switch at the bottom-left lets reviewers see each view). On the live site, Ghost's
      member login replaces it: the same pages, the same rules.
   2. Gates: anything marked data-members is hidden from visitors; data-gate shows the join card.
   3. Saving: forms save to the draft's shared inbox (db capability) when the viewer may write. */
try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(!location.hash){window.scrollTo(0,0);addEventListener('load',function(){setTimeout(function(){window.scrollTo(0,0)},60)});}}catch(e){}

(function(){
  var S=document.currentScript, ROOT=(S&&S.dataset.root)||'';
  var KEY='mimansa-role', mem={role:null};
  function load(){try{return localStorage.getItem(KEY)}catch(e){return mem.role}}
  function save(v){mem.role=v;try{localStorage.setItem(KEY,v)}catch(e){}}
  var role=load()||'visitor';
  var MM=window.MM={root:ROOT,role:function(){return role}};

  var HILL='<svg viewBox="0 0 220 36" aria-hidden="true"><path class="land-fill" d="M8 20 C50 6 170 4 212 18 C196 30 40 33 8 20 Z"/><path class="land-line" d="M14 17 C60 6 160 5 206 15"/><path class="tick" d="M38 13 l-3 -6 M44 12 l1 -6 M176 11 l3 -6 M182 12 l5 -5 M104 7 l0 -5"/></svg>';
  var LOCK='<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5.2" width="8" height="6" rx="1.2" fill="currentColor"/><path d="M3.8 5.2V3.8a2.2 2.2 0 0 1 4.4 0v1.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  MM.HILL=HILL; MM.LOCK=LOCK;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  MM.esc=esc;

  /* ---------- the gate card ---------- */
  function gateHTML(o){
    o=o||{};
    var items=(o.items||[]).map(function(t){return '<li>'+esc(t)+'</li>'}).join('');
    var art=o.pose==='none'?'<div class="mm-k" style="width:60px;align-self:start;padding-top:8px"><span style="display:block;width:14px;height:14px;border-radius:50%;background:#E09A00;box-shadow:0 0 0 7px rgba(224,154,0,.15)"></span></div>'
      :'<div class="mm-k"><img src="'+ROOT+'articles/assets/kyun/'+(o.pose||'raising')+'.webp" alt="">'+HILL+'</div>';
    return art+
      '<div><span class="lab">'+esc(o.label||'Mimansa')+'</span><h3>'+esc(o.title||'Sign up. Be the first to get new articles and stories.')+'</h3>'+
      '<p>'+esc(o.text||'Everything on Mimansa is free. Sign up to be the first to get new articles and stories.')+'</p>'+
      (items?'<ul>'+items+'</ul>':'')+
      '<div class="mm-row"><a class="mm-btn" href="'+ROOT+'join.html">Join</a><a class="mm-btn ghost" href="'+ROOT+'signin.html">Sign in</a></div></div>';
  }
  MM.gateHTML=gateHTML;
  var modal;
  MM.gate=function(o){
    if(!modal){modal=document.createElement('div');modal.className='mm-modal mm';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.hidden=true;document.body.appendChild(modal);
      modal.addEventListener('click',function(e){if(e.target===modal||e.target.closest('.mm-x'))modal.hidden=true});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal)modal.hidden=true});}
    modal.innerHTML='<div class="mm-gate nofade"><button class="mm-x" aria-label="Close">×</button>'+gateHTML(o)+'</div>';
    modal.hidden=false; var b=modal.querySelector('.mm-btn'); if(b)b.focus();
  };

  /* ---------- apply the current role to the page ---------- */
  /* 30 Oct 2026: everything on Mimansa is free. FREE=true opens every gate; joining is only for the letter. */
  /* Production settings for the developer:
     DRAFT shows the review switch (Reader / Signed in / Team). Keep false on the live site.
     FORM_ENDPOINT: paste the URL of your form backend (Tally webhook, Formspree, Ghost, your own API).
     Every Tell Kyun and Studio form POSTs its answers there as JSON. */
  var DRAFT=false, FORM_ENDPOINT='https://formsubmit.co/ajax/hitanshu@nudgeable.ai';
  var FREE=true; function locked(){return !FREE&&role==='visitor'}
  MM.free=FREE;
  var hooks=[];
  MM.onRole=function(fn){hooks.push(fn);fn(role)};
  function apply(){
    var h=document.documentElement;
    h.classList.toggle('mm-member',role!=='visitor');
    h.classList.toggle('mm-creator',role==='creator');
    document.querySelectorAll('[data-members]').forEach(function(el){el.hidden=locked()});
    document.querySelectorAll('[data-locked]').forEach(function(el){el.hidden=!locked()});
    document.querySelectorAll('[data-visitors]').forEach(function(el){el.hidden=role!=='visitor'});
    document.querySelectorAll('[data-creators]').forEach(function(el){el.hidden=role!=='creator'});
    document.querySelectorAll('[data-gate]').forEach(function(el){
      if(locked()){ if(!el.dataset.built){var o={};try{o=JSON.parse(el.dataset.gate||'{}')}catch(e){} el.className='mm-gate mm'+(el.dataset.nofade!=null?' nofade':''); el.innerHTML=gateHTML(o); el.dataset.built='1'} el.hidden=false; }
      else el.hidden=true;
    });
    document.querySelectorAll('[data-mm-auth]').forEach(function(a){
      if(role==='visitor'){a.textContent='Join';a.href=ROOT+'join.html';a.classList.remove('is-member')}
      else{a.textContent=role==='creator'?'Account · team':'My account';a.href=ROOT+'account.html';a.classList.add('is-member')}
    });
    document.querySelectorAll('.mm-switch button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.role===role))});
    hooks.forEach(function(fn){try{fn(role)}catch(e){}});
  }
  MM.setRole=function(r){role=r;save(r);apply()};

  /* members-only links (downloads, film): visitors get the gate instead */
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-members-link]'); if(!a||!locked())return;
    e.preventDefault(); e.stopPropagation();
    var o={}; try{o=JSON.parse(a.dataset.membersLink||'{}')}catch(x){}
    MM.gate(o);
  },true);

  /* tool downloads for members: the viewer saves files through the downloads capability */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-dl]'); if(!a||locked())return;
    e.preventDefault();
    var label=a.querySelector('span'); var old=label?label.textContent:'';
    function say(t){if(label){label.textContent=t;setTimeout(function(){label.textContent=old},2600)}}
    var dlp=window.claude&&claude.use?claude.use('downloads'):Promise.resolve(null);
    Promise.all([dlp,fetch(a.dataset.dl).then(function(r){if(!r.ok)throw 0;return a.dataset.enc==='b64'?r.text():r.blob()})]).then(function(r){
      var dl=r[0],data=r[1];
      if(a.dataset.enc==='b64'){var bin=atob(data.trim()),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);data=new Blob([u])}
      if(!dl){ if(a.dataset.enc==='raw'){window.open(a.dataset.dl,'_blank','noopener')} else say('Download opens on claude.ai'); return }
      return dl.save({filename:a.dataset.name,data:data}).then(function(){say('Saved')},function(err){if(err&&err.code!=='declined')say('Could not save here')});
    }).catch(function(){say('Could not load the file')});
  });

  /* ---------- article pages: short version open to all, full version for members ---------- */
  function articleGate(){
    if(FREE)return;
    var full=document.getElementById('v-full'); if(!full)return;
    var bF=document.getElementById('bFull'), bS=document.getElementById('bShort');
    if(bF&&!bF.querySelector('.mm-lock-tag')){var t=document.createElement('span');t.className='mm-lock-tag';t.innerHTML=LOCK;t.title='Members';bF.appendChild(t)}
    var o={};
    document.addEventListener('click',function(e){
      if(role!=='visitor')return;
      var t=e.target.closest('#bFull,[data-go="full"],#goFull,[data-jump]');
      if(!t)return; e.preventDefault(); e.stopImmediatePropagation(); MM.gate(o);
    },true);
    MM.onRole(function(r){ if(r==='visitor'&&!full.hidden&&bS){bS.click()} });
  }

  /* ---------- the preview switch ---------- */
  function switcher(){
    if(!DRAFT)return;
    if(document.querySelector('.mm-switch'))return;
    var d=document.createElement('div');d.className='mm-switch';d.setAttribute('role','group');d.setAttribute('aria-label','Review draft: see the site as');
    d.innerHTML='<span>Draft · see as</span><button data-role="visitor">Reader</button><button data-role="member">Signed in</button><button data-role="creator">Team</button>';
    d.addEventListener('click',function(e){var b=e.target.closest('button');if(b)MM.setRole(b.dataset.role)});
    document.body.appendChild(d);
  }

  /* ---------- shared inbox (db) ---------- */
  var dbp=null;
  MM.store=function(){
    if(dbp)return dbp;
    dbp=new Promise(function(res){
      if(!window.claude||!claude.use){res(null);return}
      Promise.all([claude.use('db'),claude.use('user')]).then(function(r){res(r[0]?{db:r[0],user:r[1]}:null)}).catch(function(){res(null)});
    });
    return dbp;
  };
  MM.submit=function(record){
    return MM.store().then(function(s){
      if(!s){
        if(!FORM_ENDPOINT)return {saved:false,why:'offline'};
        record.createdAt=new Date().toISOString(); record.status='new';
        return fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.assign({_cc:'team@mimansa.work',_template:'table',_captcha:'false',_subject:'Mimansa: '+(record.kind||'new submission')},record))})
          .then(function(r){return {saved:r.ok,why:r.ok?null:'http '+r.status}},function(){return {saved:false,why:'network'}});
      }
      var can=null; try{can=s.user&&s.user.can?s.user.can('data.write'):null}catch(e){}
      return Promise.resolve(can).then(function(ok){
        if(ok===false)return {saved:false,why:'readonly'};
        return Promise.resolve(s.user&&s.user.id?s.user.id():null).then(function(uid){
          record.createdAt=new Date().toISOString(); record.by=uid||null; record.status=record.status||'new';
          return s.db.collection('submissions').add(record).then(function(ref){return {saved:true,id:ref.id}},function(err){return {saved:false,why:(err&&err.code)||'error'}});
        });
      });
    });
  };
  MM.copyText=function(record){
    var lines=[];Object.keys(record).forEach(function(k){var v=record[k];if(v==null||v==='')return;if(typeof v==='object')v=JSON.stringify(v,null,2);lines.push(k.toUpperCase()+':\n'+v+'\n')});
    return lines.join('\n');
  };

  function boot(){
    articleGate(); switcher(); apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* v28 share */
(function(){
  function menu(btn){
    var old=document.querySelector('.mm-share-menu'); if(old){old.remove(); if(old._for===btn)return;}
    var url=location.href.split('#')[0], title=document.title.replace(/ · Mimansa$/,'');
    var e=encodeURIComponent;
    var m=document.createElement('div'); m.className='mm-share-menu'; m._for=btn; m.setAttribute('role','menu');
    m.innerHTML='<a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url='+e(url)+'">LinkedIn</a>'+
      '<a target="_blank" rel="noopener" href="https://wa.me/?text='+e(title+' '+url)+'">WhatsApp</a>'+
      '<a href="mailto:?subject='+e(title)+'&body='+e(title+'\n'+url)+'">Email</a>'+
      '<button type="button" data-copy>Copy link</button>';
    var w=btn.parentNode; if(!w.classList||!w.classList.contains('mm-share-wrap')){w=document.createElement('span');w.className='mm-share-wrap';btn.parentNode.insertBefore(w,btn);w.appendChild(btn);}
    w.appendChild(m);
    m.querySelector('[data-copy]').onclick=function(){var b=this;
      (navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(function(){b.textContent='Link copied'},function(){window.prompt('Copy this link',url)});};
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-share]');
    if(!b){ if(!ev.target.closest('.mm-share-menu')){var o=document.querySelector('.mm-share-menu'); if(o)o.remove();} return; }
    ev.preventDefault();
    var data={title:document.title,url:location.href.split('#')[0]};
    if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share(data).catch(function(){});}
    else menu(b);
  });
})();
/* /v28 */

/* v41 phone menu */
(function(){
  function setup(){
    var nav=document.querySelector('nav[aria-label="Main"]'); if(!nav||nav.dataset.mmMenu)return;
    nav.dataset.mmMenu='1'; if(!nav.id)nav.id='mm-main-nav';
    var head=nav.closest('header')||nav.parentNode;
    var b=document.createElement('button'); b.type='button'; b.className='mm-burger';
    b.setAttribute('aria-expanded','false'); b.setAttribute('aria-controls',nav.id);
    b.innerHTML='<span class="mm-burger-ico" aria-hidden="true"><i></i><i></i><i></i></span><span class="mm-burger-txt">Menu</span>';
    nav.parentNode.insertBefore(b,nav.nextSibling);
    function close(){head.classList.remove('mm-open');document.documentElement.classList.remove('mm-menu-open');b.setAttribute('aria-expanded','false');b.querySelector('.mm-burger-txt').textContent='Menu';}
    function open(){var r=head.getBoundingClientRect();document.documentElement.style.setProperty('--mm-head',Math.max(0,Math.round(r.bottom))+'px');
      head.classList.add('mm-open');document.documentElement.classList.add('mm-menu-open');b.setAttribute('aria-expanded','true');b.querySelector('.mm-burger-txt').textContent='Close';
      var f=nav.querySelector('a:not([hidden])');if(f)f.focus();}
    b.addEventListener('click',function(){head.classList.contains('mm-open')?close():open()});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&head.classList.contains('mm-open')){close();b.focus()}});
    window.addEventListener('resize',function(){if(window.innerWidth>760)close()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
/* /v41 */
