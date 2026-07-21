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
  } catch(e) { console.log('Content loader: using static content'); }
})();
function applyContact(c){if(!c)return;document.querySelectorAll('[data-content="phone-link"]').forEach(el=>{el.href='tel:'+( c.phone||'').replace(/\s/g,'');el.textContent=c.phone||'';});document.querySelectorAll('[data-content="email"]').forEach(el=>{el.href='mailto:'+c.email;el.textContent=c.email||'';});document.querySelectorAll('[data-content="facebook-url"]').forEach(el=>el.href=c.facebook_url||'#');document.querySelectorAll('[data-content="instagram-url"]').forEach(el=>el.href=c.instagram_url||'#');}
function applyNews(news){if(!news?.length)return;const c=document.querySelector('[data-content="news-grid"]');if(!c)return;c.innerHTML=news.slice(0,3).map(n=>`<div class="news-card"><div class="news-card-img" style="background:linear-gradient(135deg,#fff3eb,#fff9f0);height:190px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">${n.icon||'📰'}</div><div class="news-card-body"><div class="news-date">${esc(n.date)}</div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p></div></div>`).join('');}
function applyEvents(events){if(!events?.length)return;const c=document.querySelector('[data-content="events-grid"]');if(!c)return;c.innerHTML=events.map(e=>`<div class="ecard"><div class="edate" style="background:#ff6b35;"><div class="day">${esc(e.date_day)}</div><div class="mon">${esc(e.date_month)}</div></div><div><h3>${e.emoji||''} ${esc(e.name)}</h3><p>${esc(e.description)}</p></div></div>`).join('');}
function applyTerms(terms){if(!terms?.length)return;const c=document.querySelector('[data-content="terms-grid"]');if(!c)return;const cols={autumn:'linear-gradient(135deg,#ff6b35,#e55a28)',spring:'linear-gradient(135deg,#34a8d2,#1f7a9e)',summer:'linear-gradient(135deg,#f5c800,#d4a800)'};c.innerHTML=terms.map(t=>`<div class="tblock" style="background:${cols[t.id]||cols.autumn};border-radius:20px;padding:2rem;color:white;position:relative;overflow:hidden;"><h3 style="font-family:'Fredoka One',cursive;font-size:1.5rem;margin-bottom:.75rem;">${t.emoji||''} ${esc(t.season)} Term</h3><p style="font-size:.88rem;opacity:.9;line-height:1.8;font-weight:600;">Start: ${esc(t.start)}<br>Half term: ${esc(t.half_term)}<br>End: ${esc(t.end)}</p></div>`).join('');}
function applyGallery(gallery){if(!gallery?.length)return;const c=document.querySelector('[data-content="gallery-grid"]');if(!c)return;c.innerHTML=gallery.map((g,i)=>`<div class="gi gi${i%8}" style="border-radius:16px;overflow:hidden;border:3px solid white;box-shadow:2px 4px 12px rgba(0,0,0,.15);"><img src="${g.url}" alt="Gallery photo ${i+1}" style="width:100%;aspect-ratio:1;object-fit:cover;"></div>`).join('');}
function applyOfsted(o){if(!o)return;document.querySelectorAll('[data-content="ofsted-grade"]').forEach(el=>el.textContent=o.overall||'Good');document.querySelectorAll('[data-content="ofsted-date"]').forEach(el=>el.textContent=o.date||'');}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
