(function(){
  var views={short:document.getElementById('v-short'),full:document.getElementById('v-full')};
  if(!views.short||!views.full)return;
  var mode=document.body.dataset.shortmode||'author';
  var door=document.getElementById('doorway');
  var btns=document.querySelectorAll('.depth button');
  var depth='short';
  var slug=document.body.dataset.slug||'a';
  function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function anchorInView(){
    var els=views[depth].querySelectorAll('[data-sync]'),best=null;
    els.forEach(function(el){var t=el.getBoundingClientRect().top; if(t<160) best={key:el.dataset.sync,top:t};});
    return best;
  }
  var status=document.getElementById('depthStatus'),stS=document.getElementById('st-short'),stF=document.getElementById('st-full');
  var thumb=document.getElementById('thumb'),toastEl=document.getElementById('toast'),toastTx=document.getElementById('toastText'),tt;
  function moveThumb(){var b=document.querySelector('.depth button[aria-pressed="true"]'); if(b){thumb.style.left=b.offsetLeft+'px'; thumb.style.width=b.offsetWidth+'px';}}
  function toast(msg){toastTx.textContent=msg; toastEl.hidden=false; clearTimeout(tt); tt=setTimeout(function(){toastEl.hidden=true},3600);}
  function replay(el,cls){el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);}
  function setDepth(d,opt){
    opt=opt||{};
    if(d===depth&&!opt.jump&&!opt.init){return}
    var mid=!opt.init&&!opt.jump&&status.getBoundingClientRect().bottom<0;
    var a=mid?anchorInView():null;
    depth=d;
    views.short.hidden=d!=='short'; views.full.hidden=d!=='full'; if(door)door.hidden=d!=='short';
    stS.hidden=d!=='short'; stF.hidden=d!=='full';
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.depth===d))});
    moveThumb();
    store('mimansa-depth',d);
    if(!opt.init){replay(views[d],'entering'); replay(status,'flash');}
    if(opt.jump){var t=document.getElementById(opt.jump); if(t){t.scrollIntoView({block:'start'}); window.scrollBy(0,-90);} }
    else if(a){var c=views[d].querySelector('[data-sync="'+a.key+'"]'); if(c){window.scrollBy(0,c.getBoundingClientRect().top-a.top);} }
    if(!opt.init&&(mid||opt.jump)){toast(d==='full'?'Now reading the full article · new parts have a line beside them':(mode==='key'?'Now reading the key passages':'Now reading the 2-minute version'));}
    onScroll();
  }
  btns.forEach(function(b){b.addEventListener('click',function(){setDepth(b.dataset.depth)})});
  document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){setDepth(b.dataset.go)})});
  var gf=document.getElementById('goFull'); if(gf)gf.addEventListener('click',function(){setDepth('full',{jump:'v-full'})});
  document.querySelectorAll('[data-jump]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();setDepth('full',{jump:a.dataset.jump})})});
  window.addEventListener('resize',moveThumb);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(moveThumb)}

  var whys=document.querySelector('.whys[data-names]'),names=whys?JSON.parse(whys.dataset.names):null;
  document.querySelectorAll('.why-pick').forEach(function(b){b.addEventListener('click',function(){
    var w=b.dataset.why;
    document.querySelectorAll('.why-pick').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.why===w))});
    var r=document.getElementById('recall'); if(r&&names)r.textContent='At the start, you suspected '+names[w-1]+'. Still think so?';
  })});
  document.querySelectorAll('.poll button').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('.poll button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
    document.getElementById('pollOut').textContent='You chose: '+b.dataset.v+'. Live results will show here once the poll opens.';
  })});

  var bar=document.getElementById('progress'),rbar=document.getElementById('rbar');
  function onScroll(){
    var v=views[depth],r=v.getBoundingClientRect(),h=window.innerHeight;
    var p=Math.min(1,Math.max(0,(h*0.35-r.top)/(r.height)));
    bar.style.width=(p*100)+'%';
    rbar.classList.toggle('past',rbar.getBoundingClientRect().top<=2&&window.scrollY>200);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',onScroll);
  var nb=document.getElementById('notesBtn');
  if(nb)nb.addEventListener('click',function(){var on=document.body.classList.toggle('notes');nb.setAttribute('aria-pressed',String(on));nb.textContent=on?'Hide design notes':'Show design notes'});
  var h=(location.hash||'').slice(1);
  setDepth(h==='full'?'full':h==='short'?'short':(load('mimansa-depth')||'short'),{init:true});
})();
