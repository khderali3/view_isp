const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 

const withPWA = require("next-pwa")({

	dest: "public",
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true, // Ensures offline page caching


	// added by khder test 1

	runtimeCaching: [
		{
			// Cache HTML pages
			urlPattern: ({ request }) => request.destination === "document",
			handler: "NetworkFirst",
			options: {
			  cacheName: "pages-cache",
			  networkTimeoutSeconds: 10,
			  expiration: {
				maxEntries: 50,
				maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
			  },
			},
		  },
		  {
			// Cache API responses
			urlPattern: /^https:\/\/back\.cloudtech-it\.com\/.*$/,
			handler: "StaleWhileRevalidate",
			options: {
			  cacheName: "api-cache",
			  expiration: {
				maxEntries: 50,
				maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
			  },
			},
		  },
		  {
			// Cache Next.js static files (_next/static)
			urlPattern: /^\/_next\/static\/.*/,
			handler: "CacheFirst",
			options: {
			  cacheName: "next-static-assets",
			  expiration: {
				maxEntries: 100,
				maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
			  },
			},
		  },
		  {
			// Cache frontend assets (JS, CSS, Fonts)
			urlPattern: ({ request }) =>
			  request.destination === "script" ||
			  request.destination === "style" ||
			  request.destination === "font",
			handler: "CacheFirst",
			options: {
			  cacheName: "static-assets",
			  expiration: {
				maxEntries: 100,
				maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
			  },
			},
		  },
		  {
			// Cache images
			urlPattern: /^https:\/\/cloudtech-it\.com\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
			handler: "CacheFirst",
			options: {
			  cacheName: "image-cache",
			  expiration: {
				maxEntries: 100,
				maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
			  },
			},
		  },		
	  ],





 
  });

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,   

};
 
// module.exports = withNextIntl(nextConfig);

module.exports = withNextIntl(withPWA(nextConfig));






 