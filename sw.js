const CACHE = "subs-v1";

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE).then(cache=>{
      return cache.addAll(["./"]);
    })
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request))
  );
});
