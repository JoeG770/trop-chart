const C='trop-5f088e0e0f';
const F=['./','index.html','marks.js','timings.js','timings.json','hebrew.ttf','rebbi.mp3','kids.mp3','manifest.json','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  e.respondWith((async()=>{
    const c=await caches.open(C);
    const hit=await c.match(r,{ignoreSearch:true,ignoreVary:true});
    const range=r.headers.get('range');
    if(hit&&range){ // Safari audio needs 206 partial responses
      const b=await hit.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(range);
      const s=m[1]?+m[1]:0,en=m[2]?+m[2]:b.byteLength-1;
      return new Response(b.slice(s,en+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'audio/mpeg','Content-Range':'bytes '+s+'-'+en+'/'+b.byteLength,'Content-Length':String(en-s+1),'Accept-Ranges':'bytes'}});
    }
    if(hit)return hit;
    try{const n=await fetch(r);if(n.ok&&n.status===200)c.put(r,n.clone());return n}catch(x){return c.match('index.html')}
  })());
});
