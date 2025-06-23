  

self.addEventListener("install", (event) => {
	event.waitUntil(
	  caches.open("pwa-cache").then((cache) => {
		return cache.addAll([
		  "/", // Home page
		  "/offline", // Offline fallback page
		  "/js/bootstrap.bundle.min.js", // External Bootstrap JS (if placed in public)
		  "/Images/CLOUD TECH sky White horizontal.png", // Example image
		]);
	  })
	);
  });
  
  self.addEventListener("activate", (event) => {
	const cacheWhitelist = ["pwa-cache"]; // List of cache versions you want to keep
  
	event.waitUntil(
	  caches.keys().then((cacheNames) => {
		return Promise.all(
		  cacheNames.map((cacheName) => {
			if (!cacheWhitelist.includes(cacheName)) {
			  return caches.delete(cacheName); // Remove old caches
			}
		  })
		);
	  })
	);
  });
  
  // Clone the response so it can be used by both the browser and cache
  // Open the cache and update it with the new response
  // Return the response to the browser
  // Fallback to cache if offline

  self.addEventListener("fetch", (event) => {
	if (event.request.url.startsWith("chrome-extension://")) {
	  return; 
	}
	event.respondWith(
	  fetch(event.request)
		.then((response) => {
		  
		  if (!response || response.status !== 200 || response.type !== 'basic') {
			return response;
		  }
  
		  const responseClone = response.clone();
  
		  caches.open("pwa-cache").then((cache) => {
			cache.put(event.request, responseClone);  
		  });
  
		  return response; 
		})
		.catch(() => caches.match(event.request))  
	);
  });

  


 
 


 

 