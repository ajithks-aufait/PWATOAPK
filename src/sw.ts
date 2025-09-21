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
      event.ports[0].postMessage({ version: '2024.12.17.300000' })
    }
    if (event.data.type === 'CLEAR_CACHE') {
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
    }
    if (event.data.type === 'TRIGGER_SYNC') {
      // Manually trigger background sync
      const syncType = event.data.syncType
      switch (syncType) {
        case 'plant-tour-data':
          syncPlantTourData()
          break
        case 'quality-data':
          syncQualityData()
          break
        case 'user-preferences':
          syncUserPreferences()
          break
        case 'app-metadata':
          syncAppMetadata()
          break
        default:
          console.log('Unknown sync type:', syncType)
      }
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
      clearOldCaches(),
      registerPeriodicSync()
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
    'main-page-cache',
    'plant-tour-data-cache',
    'quality-data-cache',
    'user-preferences-cache',
    'app-metadata-cache'
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

// ===========================================
// PERIODIC BACKGROUND SYNC IMPLEMENTATION
// ===========================================

// Register periodic background sync
async function registerPeriodicSync() {
  try {
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready
      
      // Type assertion for periodic sync
      const periodicSync = (registration as any).periodicSync
      
      // Register periodic sync for different data types
      if (periodicSync) {
        await Promise.all([
          periodicSync.register('plant-tour-data', {
            minInterval: 5 * 60 * 1000 // 5 minutes
          }),
          periodicSync.register('quality-data', {
            minInterval: 10 * 60 * 1000 // 10 minutes
          }),
          periodicSync.register('user-preferences', {
            minInterval: 30 * 60 * 1000 // 30 minutes
          }),
          periodicSync.register('app-metadata', {
            minInterval: 60 * 60 * 1000 // 1 hour
          })
        ])
        
        console.log('Periodic background sync registered successfully')
      }
    } else {
      console.log('Periodic background sync not supported - using fallback strategy')
      // Fallback: Set up interval-based sync
      setupFallbackSync()
    }
  } catch (error) {
    console.error('Failed to register periodic background sync:', error)
    // Fallback: Set up interval-based sync
    setupFallbackSync()
  }
}

// Handle periodic background sync events
self.addEventListener('periodicsync', (event: any) => {
  console.log('Periodic background sync triggered:', event.tag)
  
  switch (event.tag) {
    case 'plant-tour-data':
      event.waitUntil(syncPlantTourData())
      break
    case 'quality-data':
      event.waitUntil(syncQualityData())
      break
    case 'user-preferences':
      event.waitUntil(syncUserPreferences())
      break
    case 'app-metadata':
      event.waitUntil(syncAppMetadata())
      break
    default:
      console.log('Unknown periodic sync tag:', event.tag)
  }
})

// Fallback sync strategy for browsers without periodic background sync
function setupFallbackSync() {
  console.log('Setting up fallback sync strategy')
  
  // Set up intervals for different data types
  setInterval(() => {
    syncPlantTourData()
  }, 5 * 60 * 1000) // 5 minutes
  
  setInterval(() => {
    syncQualityData()
  }, 10 * 60 * 1000) // 10 minutes
  
  setInterval(() => {
    syncUserPreferences()
  }, 30 * 60 * 1000) // 30 minutes
  
  setInterval(() => {
    syncAppMetadata()
  }, 60 * 60 * 1000) // 1 hour
  
  console.log('Fallback sync intervals set up')
}

// Sync plant tour data in background
async function syncPlantTourData() {
  try {
    console.log('Syncing plant tour data...')
    
    // Define API endpoints to sync
    const endpoints = [
      '/api/plant-tours/active',
      '/api/plant-tours/recent',
      '/api/plant-tours/statistics',
      '/api/tour-templates',
      '/api/equipment-status'
    ]
    
    const cache = await caches.open('plant-tour-data-cache')
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`Cached plant tour data: ${endpoint}`)
          
          // Notify clients of data update
          notifyClients('plant-tour-data-updated', {
            endpoint,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error(`Failed to sync plant tour data for ${endpoint}:`, error)
      }
    }
    
    console.log('Plant tour data sync completed')
  } catch (error) {
    console.error('Plant tour data sync failed:', error)
  }
}

// Sync quality data in background
async function syncQualityData() {
  try {
    console.log('Syncing quality data...')
    
    const endpoints = [
      '/api/quality-checks/recent',
      '/api/quality-standards',
      '/api/quality-metrics',
      '/api/inspection-results',
      '/api/quality-alerts'
    ]
    
    const cache = await caches.open('quality-data-cache')
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`Cached quality data: ${endpoint}`)
          
          // Notify clients of data update
          notifyClients('quality-data-updated', {
            endpoint,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error(`Failed to sync quality data for ${endpoint}:`, error)
      }
    }
    
    console.log('Quality data sync completed')
  } catch (error) {
    console.error('Quality data sync failed:', error)
  }
}

// Sync user preferences in background
async function syncUserPreferences() {
  try {
    console.log('Syncing user preferences...')
    
    const endpoints = [
      '/api/user/preferences',
      '/api/user/settings',
      '/api/user/notifications',
      '/api/app/config'
    ]
    
    const cache = await caches.open('user-preferences-cache')
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`Cached user preferences: ${endpoint}`)
          
          // Notify clients of data update
          notifyClients('user-preferences-updated', {
            endpoint,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error(`Failed to sync user preferences for ${endpoint}:`, error)
      }
    }
    
    console.log('User preferences sync completed')
  } catch (error) {
    console.error('User preferences sync failed:', error)
  }
}

// Sync app metadata in background
async function syncAppMetadata() {
  try {
    console.log('Syncing app metadata...')
    
    const endpoints = [
      '/api/app/version',
      '/api/app/features',
      '/api/app/announcements',
      '/api/help/documentation',
      '/api/system/status'
    ]
    
    const cache = await caches.open('app-metadata-cache')
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          await cache.put(endpoint, response.clone())
          console.log(`Cached app metadata: ${endpoint}`)
          
          // Notify clients of data update
          notifyClients('app-metadata-updated', {
            endpoint,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error(`Failed to sync app metadata for ${endpoint}:`, error)
      }
    }
    
    console.log('App metadata sync completed')
  } catch (error) {
    console.error('App metadata sync failed:', error)
  }
}

// Notify all clients about data updates
async function notifyClients(type: string, data: any) {
  try {
    const clients = await self.clients.matchAll()
    
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_UPDATE',
        syncType: type,
        data: data
      })
    })
    
    console.log(`Notified ${clients.length} clients about ${type}`)
  } catch (error) {
    console.error('Failed to notify clients:', error)
  }
}

// Enhanced API caching with periodic background sync
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/plant-tours/'),
  new NetworkFirst({
    cacheName: 'plant-tour-data-cache',
    networkTimeoutSeconds: 2,
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 5 * 60, // 5 minutes
        purgeOnQuotaError: true
      })
    ],
  })
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/quality-'),
  new NetworkFirst({
    cacheName: 'quality-data-cache',
    networkTimeoutSeconds: 2,
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 10 * 60, // 10 minutes
        purgeOnQuotaError: true
      })
    ],
  })
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/user/') || url.pathname.startsWith('/api/app/'),
  new NetworkFirst({
    cacheName: 'user-preferences-cache',
    networkTimeoutSeconds: 2,
    plugins: [
      new ExpirationPlugin({ 
        maxEntries: 30, 
        maxAgeSeconds: 30 * 60, // 30 minutes
        purgeOnQuotaError: true
      })
    ],
  })
)
