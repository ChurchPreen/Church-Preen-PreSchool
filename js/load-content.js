// Church Preen Pre-School — Content Loader
(async function() {
  try {
    const r = await fetch('./data/content.json?v=' + Date.now());
    if (!r.ok) return;
    const c = await r.json();
    applyContact(c.contact);
    applyNews(c.news);
    applyEvents(c.events);
    applyTerms(c.terms);
    applyGallery(c.gallery);
    applyOfsted(c.ofsted);
    applyTestimonials(c.testimonials);
  } catch(e) { console.log('Content loader: using static content', e); }
})();
function applyContact(c){if(!c)return;document.querySelectorAll('[data-content="phone-link"]').forEach(el=>{el.href='tel:'+( c.phone||'').replace(/\s/g,'');el.textContent=c.phone||'';});document.querySelectorAll('[data-content="email"]').forEach(el=>{el.href='mailto:'+c.email;el.textContent=c.email||'';});document.querySelectorAll('[data-content="facebook-url"]').forEach(el=>el.href=c.facebook_url||'#');document.querySelectorAll('[data-content="instagram-url"]').forEach(el=>el.href=c.instagram_url||'#');}
function applyNews(news){
  if(!news?.length)return;
  const c=document.querySelector('[data-content="news-grid"]');
  if(!c)return;
  const items=news.slice(0,3);
  const main=items[0];
  const side=items.slice(1);
  const mainImgBg='linear-gradient(135deg,var(--blue-pale),white)';
  let html='<div class="news-main">'+
    '<div class="news-main-img" style="background:'+mainImgBg+';height:230px;display:flex;align-items:center;justify-content:center;font-size:4rem;border-radius:var(--radius-lg) var(--radius-lg) 0 0;">'+(main.icon||'📰')+'</div>'+
    '<div class="news-main-body" style="background:white;padding:1.4rem;border:1.5px solid var(--border);border-top:none;border-radius:0 0 var(--radius-lg) var(--radius-lg);">'+
    '<div class="news-date" style="color:var(--blue);font-weight:700;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;">'+esc(main.date)+'</div>'+
    '<h3 style="font-family:\'Poppins\',sans-serif;color:var(--text);margin:.35rem 0;">'+esc(main.title)+'</h3>'+
    '<p style="color:var(--text-light);">'+esc(main.body)+'</p></div></div>';
  html+='<div class="news-side">'+side.map(n=>
    '<div class="news-card-sm" style="display:flex;gap:.9rem;background:white;border:1.5px solid var(--border);border-radius:var(--radius);padding:.9rem;margin-bottom:1rem;">'+
    '<div class="news-card-sm-img" style="flex:0 0 70px;height:70px;border-radius:10px;background:'+mainImgBg+';display:flex;align-items:center;justify-content:center;font-size:1.8rem;">'+(n.icon||'📰')+'</div>'+
    '<div class="news-card-sm-body"><div class="news-date" style="color:var(--blue);font-weight:700;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;">'+esc(n.date)+'</div>'+
    '<h3 style="font-family:\'Poppins\',sans-serif;font-size:.98rem;color:var(--text);margin:.2rem 0;">'+esc(n.title)+'</h3>'+
    '<p style="font-size:.88rem;color:var(--text-light);">'+esc(n.body)+'</p></div></div>'
  ).join('')+'</div>';
  c.innerHTML=html;
}

function applyEvents(events){
  if(!events?.length)return;
  const c=document.querySelector('[data-content="events-grid"]');
  if(!c)return;
  const today=new Date();today.setHours(0,0,0,0);
  const stillShowing=e=>{
    if(!e.date)return true;
    const p=String(e.date).split('-');
    if(p.length!==3)return true;
    const d=new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10));
    if(isNaN(d))return true;
    d.setDate(d.getDate()+14);
    return today<=d;
  };
  const visible=events.filter(stillShowing);
  if(!visible.length){
    c.innerHTML='<p style="grid-column:1/-1;text-align:center;color:var(--text-light);">No events are planned right now. Follow us on Facebook to hear about the next one!</p>';
    return;
  }
  const colours=['','var(--teal)','var(--text)'];
  c.innerHTML=visible.map((e,i)=>{
    const bg=colours[i%3]?' style="background:'+colours[i%3]+';"':'';
    const photo=e.photo?'<img class="ev-photo" src="'+esc(e.photo)+'" alt="'+esc(e.name)+'" loading="lazy">':'';
    return '<div class="ev-card'+(e.photo?' has-photo':'')+'">'+photo+'<div class="ev-date"'+bg+'><div class="ev-day">'+esc(e.date_day)+'</div><div class="ev-mon">'+esc(e.date_month)+'</div></div>'+
      '<div class="ev-body"><h3>'+esc(e.name)+(!e.photo&&e.emoji?' '+e.emoji:'')+'</h3><p>'+esc(e.description)+'</p></div></div>';
  }).join('');
}

function applyTerms(terms){
  if(!terms?.length)return;
  const c=document.querySelector('[data-content="terms-grid"]');
  if(!c)return;
  const emojis={autumn:'🍂',spring:'❄️',summer:'🌞'};
  const monthOf=s=>{const m=String(s||'').match(/[A-Za-z]{3,}/g);return m?m.find(w=>/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(w)):null;};
  const yearOf=s=>{const m=String(s||'').match(/\d{4}/);return m?parseInt(m[0],10):null;};
  const academicYear=t=>{
    if(t.academic_year)return t.academic_year;
    const y=yearOf(t.start);if(!y)return '';
    const first=(t.id||t.season||'').toLowerCase().indexOf('autumn')===0?y:y-1;
    return first+'/'+String(first+1).slice(2);
  };
  const groups=[];
  terms.forEach(t=>{
    const ay=academicYear(t);
    let g=groups.find(x=>x.ay===ay);
    if(!g){g={ay:ay,items:[]};groups.push(g);}
    g.items.push(t);
  });
  c.innerHTML=groups.map(g=>{
    const cards=g.items.map(t=>{
      const season=String(t.season||'').toLowerCase();
      const y=yearOf(t.start);
      const m1=monthOf(t.start),m2=monthOf(t.end);
      const months=(m1&&m2)?esc(m1)+' – '+esc(m2):esc(t.season);
      return '<div class="term-card '+esc(season)+'">'+
        '<div class="term-label">'+esc(t.season)+' Term'+(y?' '+y:'')+'</div>'+
        '<h3>'+(t.emoji||emojis[season]||'')+' '+months+'</h3>'+
        '<p><strong>Start:</strong> '+esc(t.start)+'<br><strong>Half term:</strong> '+esc(t.half_term)+'<br><strong>End:</strong> '+esc(t.end)+'</p>'+
      '</div>';
    }).join('');
    return (g.ay?'<h3 class="term-year">Academic Year '+esc(g.ay)+'</h3>':'')+'<div class="terms-grid">'+cards+'</div>';
  }).join('');
}

function applyGallery(gallery){
  if(!gallery?.length)return;
  const c=document.querySelector('[data-content="gallery-grid"]');
  if(!c)return;
  c.innerHTML=gallery.map((g,i)=>
    '<div class="gi'+(i%5===0?' tall':'')+'" style="border-radius:var(--radius);overflow:hidden;border:1.5px solid var(--border);box-shadow:var(--shadow);">'+
    '<img src="'+esc(g.url)+'" alt="Gallery photo '+(i+1)+'" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy"></div>'
  ).join('');
}

function applyTestimonials(list){
  if(!list?.length)return;
  const c=document.querySelector('[data-content="testimonials-grid"]');
  if(!c)return;
  c.innerHTML=list.map(t=>
    '<div class="test-card">'+
      '<p class="test-quote">“'+esc(t.quote).replace(/\n\n/g,'</p><p class="test-quote">')+'”</p>'+
      '<p class="test-attr">— '+esc(t.attribution)+'</p>'+
    '</div>'
  ).join('');
}

function applyOfsted(o){
  if(!o)return;
  const set=(k,v)=>document.querySelectorAll('[data-content="'+k+'"]').forEach(el=>{if(v)el.textContent=v;});
  set('ofsted-grade',o.overall||'Good');
  set('ofsted-date',o.date);
  set('ofsted-qe',o.quality_of_education);
  set('ofsted-ba',o.behaviour_and_attitudes);
  set('ofsted-pd',o.personal_development);
  set('ofsted-lm',o.leadership_and_management);
  if(o.report_url&&o.report_url!=='#'){
    document.querySelectorAll('.ob-btn').forEach(a=>{a.href=o.report_url;a.target='_blank';a.rel='noopener';});
  }
  const list=document.querySelector('[data-content="ofsted-previous"]');
  if(list&&o.previous_reports?.length){
    list.innerHTML=o.previous_reports.map(r=>'<a href="'+esc(r.url||'#')+'" class="prev-report" target="_blank" rel="noopener">'+esc(r.date)+' <span>View →</span></a>').join('');
  }
}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
