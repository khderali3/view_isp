// this sw not chaching , just simple one :



self.addEventListener("install", (event) => {
  // Activate immediately without waiting
  self.skipWaiting();
});

 

self.addEventListener("activate", (event) => {
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});
 

// send offline message or offline page
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => new Response("You are offline"))
  );
});


// wihtout send offline message
// self.addEventListener("fetch", (event) => {
//   // Just fetch from network, no caching
//   event.respondWith(fetch(event.request));
// });