const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  url: 'http://localhost:3000',
  checkInterval: 30000, // 30 seconds
  watchDirs: ['.'],      // Watch from root
  debounceTime: 5000,   // 5 seconds (slightly longer to bundle changes)
  ignored: ['node_modules', '.git', '.vercel', '.gemini', '.opencode', '.antigravitycli', 'package-lock.json', 'data.db']
};

let syncTimeout = null;

/**
 * 1. SERVER MONITORING
 */
function checkServer() {
  http.get(CONFIG.url, (res) => {
    if (res.statusCode !== 200) {
      console.log(`[Watchdog] Server status: ${res.statusCode}. Attempting restart...`);
      restartServer();
    }
  }).on('error', (err) => {
    console.log('[Watchdog] Server is unresponsive. Attempting restart...');
    restartServer();
  });
}

function restartServer() {
  const child = exec('npm start', { detached: true, stdio: 'inherit' });
  child.unref();
  console.log('[Watchdog] npm start executed.');
}

/**
 * 2. FILE WATCHING & AUTO-SYNC
 */
function triggerSync() {
  console.log('[Watchdog] Change detected. Synchronizing manifest and AI updates...');
  exec('npm run sync-manifest', (err, stdout, stderr) => {
    if (err) {
      console.error('[Watchdog] Sync failed:', stderr);
    } else {
      console.log('[Watchdog] Sync complete.');
      if (stdout) console.log(stdout.trim());
    }
  });
}

function watchFiles() {
  console.log(`[Watchdog] Monitoring for changes from root...`);
  
  CONFIG.watchDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) return;

    fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      
      // Ignore internal/temp/blacklisted files and directories
      const isIgnored = CONFIG.ignored.some(i => filename.includes(i)) || 
                       filename.startsWith('.env') ||
                       filename.endsWith('.db');

      if (isIgnored) return;

      // Debounce sync call
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(triggerSync, CONFIG.debounceTime);
    });
  });
}

/**
 * START WATCHDOG
 */
console.log('================================================');
console.log('   SCIENCE VIDEO AGGREGATOR - WATCHDOG ACTIVE   ');
console.log('================================================');

// Initial check
checkServer();
watchFiles();

// Continuous intervals
setInterval(checkServer, CONFIG.checkInterval);

// Keep process alive
process.on('uncaughtException', (err) => {
  console.error('[Watchdog] Critical Error:', err.message);
});
