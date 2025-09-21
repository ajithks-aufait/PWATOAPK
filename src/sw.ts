/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any }

clientsClaim()

// Enhanced precaching with better offline support
precacheAndRoute(self.__WB_MANIFEST)

// Enhanced asset caching for better offline support
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'manifest',
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 100, 
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      })
    ],
  })
)

// Enhanced image caching with better offline support
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 100, 
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      })
    ],
  })
)

// Cache fonts for offline use
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'font-cache',
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 30, 
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        purgeOnQuotaError: true
      })
    ],
  })
)

// Cache other static assets
registerRoute(
  ({ request }) => 
    request.destination === 'document' ||
    request.destination === 'audio' ||
    request.destination === 'video',
  new NetworkFirst({
    cacheName: 'static-assets-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        purgeOnQuotaError: true
      })
    ],
  })
)

const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', { maxRetentionTime: 24 * 60 })

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') && url.searchParams.get('method') !== 'POST' && url.searchParams.get('method') !== 'PATCH',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 5 * 60 })],
  })
)

registerRoute(
  ({ url }) => {
    const method = url.searchParams.get('method')
    return url.pathname.startsWith('/api/') && (method === 'POST' || method === 'PATCH')
  },
  new NetworkFirst({ cacheName: 'api-mutations', plugins: [bgSyncPlugin] })
)

// Enhanced message handling for better offline support
self.addEventListener('message', (event) => {
  if (event.data && typeof event.data === 'object') {
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting()
    }
    if (event.data.type === 'GET_VERSION') {
      event.ports[0].postMessage({ version: '2024.12.17.200000' })
    }
    if (event.data.type === 'CLEAR_CACHE') {
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
    }
  }
})

// Add cache management functions
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  )
}

// Add install event for better offline setup
self.addEventListener('install', (_event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Add activate event for cache cleanup
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      clearOldCaches()
    ])
  )
})

async function clearOldCaches() {
  const cacheNames = await caches.keys()
  const currentCaches = [
    'asset-cache',
    'image-cache', 
    'font-cache',
    'static-assets-cache',
    'api-cache',
    'api-mutations',
    'spa-navigation-cache',
    'main-page-cache'
  ]
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !currentCaches.some(current => cacheName.includes(current)))
      .map(cacheName => {
        console.log(`Deleting old cache: ${cacheName}`)
        return caches.delete(cacheName)
      })
  )
}

// Handle SPA navigation with enhanced offline support
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'spa-navigation-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 24 * 60 * 60,
        purgeOnQuotaError: true
      }),
      // Add a custom plugin to handle navigation failures
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return request.url
        },
        cacheWillUpdate: async ({ response }) => {
          // Only cache successful responses
          return response.status === 200 ? response : null
        },
        cacheDidUpdate: async ({ request }) => {
          console.log(`Updated navigation cache for ${request.url}`)
        }
      }
    ]
  })
)

// Handle the main page and login page specifically
registerRoute(
  ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
  new NetworkFirst({
    cacheName: 'main-page-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 }),
      {
        cacheWillUpdate: async ({ response }) => {
          // Always cache the main page and login page for offline access
          return response.status === 200 ? response : null
        }
      }
    ],
  })
)

// Define SPA routes for the Plant Tour Management System
const spaRoutes = [
  '/', // Login page
  '/home',
  '/plant-tour-section',
  '/qualityplantour',
  '/creampercentage',
  '/sieveandmagnetoldplant',
  '/sieveandmagnetnewplant',
  '/productmonitoringrecord',
  '/netweightmonitoringrecord',
  '/codeverificationrecord',
  '/oprpandccprecord',
  '/bakingprocessrecord',
  '/sealintegritytest',
  '/alc'
]

spaRoutes.forEach((route) => {
  registerRoute(
    ({ url }) => url.pathname === route,
    new NetworkFirst({
      cacheName: `spa-route-${route.replace('/', '')}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 24 * 60 * 60 }),
        {
          cacheWillUpdate: async ({ response }) => {
            // Only cache successful responses
            return response.status === 200 ? response : null
          }
        }
      ]
    })
  )
})

// Add a fallback route for any unmatched navigation requests
registerRoute(
  ({ request }) => {
    // Only handle navigation requests that are not in our SPA routes
    if (request.mode !== 'navigate') return false;
    
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Don't handle the root path or any of our defined SPA routes
    return !spaRoutes.includes(pathname);
  },
  new NetworkFirst({
    cacheName: 'fallback-navigation-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
)


