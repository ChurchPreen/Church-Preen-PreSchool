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
  } catch(e) { console.log('Content loader: using static content'); }
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
    '<div class="news-main-img" style="background:'+mainImgBg+';height:230px;display:flex;align-items:center;justify-content:center;font-size:4rem;border-radius:var(--radius-lg) var(--radius-lg) 0 0;">'+(main.icon||'\u{1F4F0}')+'</div>'+
    '<div class="news-main-body" style="background:white;padding:1.4rem;border:1.5px solid var(--border);border-top:none;border-radius:0 0 var(--radius-lg) var(--radius-lg);">'+
    '<div class="news-date" style="color:var(--blue);font-weight:700;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;">'+esc(main.date)+'</div>'+
    '<h3 style="font-family:\'Poppins\',sans-serif;color:var(--text);margin:.35rem 0;">'+esc(main.title)+'</h3>'+
    '<p style="color:var(--text-light);">'+esc(main.body)+'</p></div></div>';
  html+='<div class="news-side">'+side.map(n=>
    '<div class="news-card-sm" style="display:flex;gap:.9rem;background:white;border:1.5px solid var(--border);border-radius:var(--radius);padding:.9rem;margin-bottom:1rem;">'+
    '<div class="news-card-sm-img" style="flex:0 0 70px;height:70px;border-radius:10px;background:'+mainImgBg+';display:flex;align-items:center;justify-content:center;font-size:1.8rem;">'+(n.icon||'\u{1F4F0}')+'</div>'+
    '<div class="news-card-sm-body"><div class="news-date" style="color:var(--blue);font-weight:700;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;">'+esc(n.date)+'</div>'+
    '<h3 style="font-family:\'Poppins\',sans-serif;font-size:.98rem;color:var(--text);margin:.2rem 0;">'+esc(n.title)+'</h3>'+
    '<p style="font-size:.88rem;color:var(--text-light);">'+esc(n.body)+'</p></div></div>'
  ).join('')+'</div>';
  c.innerHTML=html;
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
    list.innerHTML=o.previous_reports.map(r=>'<a href="'+esc(r.url||'#')+'" class="prev-report" target="_blank" rel="noopener">'+esc(r.date)+' <span>View \u2192</span></a>').join('');
  }
}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
