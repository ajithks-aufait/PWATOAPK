// Complete Cache Clearing Script
// Run this in your browser console to force clear all caches

async function nuclearCacheClear() {
  console.log('🚀 Starting nuclear cache clear...');
  
  try {
    // 1. Unregister all service workers
    console.log('1. Unregistering service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      console.log(`   Unregistering: ${registration.scope}`);
      await registration.unregister();
    }
    
    // 2. Clear all caches
    console.log('2. Clearing all caches...');
    const cacheNames = await caches.keys();
    for (let cacheName of cacheNames) {
      console.log(`   Deleting cache: ${cacheName}`);
      await caches.delete(cacheName);
    }
    
    // 3. Clear localStorage
    console.log('3. Clearing localStorage...');
    localStorage.clear();
    
    // 4. Clear sessionStorage
    console.log('4. Clearing sessionStorage...');
    sessionStorage.clear();
    
    // 5. Clear IndexedDB
    console.log('5. Clearing IndexedDB...');
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        for (let db of databases) {
          console.log(`   Deleting database: ${db.name}`);
          indexedDB.deleteDatabase(db.name);
        }
      } catch (error) {
        console.log('   IndexedDB clear failed (browser limitation)');
      }
    }
    
    console.log('✅ Cache clear complete! Reloading page...');
    
    // 6. Force reload
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error during cache clear:', error);
  }
}

// Run the function
nuclearCacheClear();
