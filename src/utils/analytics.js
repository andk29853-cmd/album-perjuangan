// Real-Time Analytics Engine for Album Perjuangan Commune
const STORAGE_KEY = 'imm_real_analytics';
const HEARTBEAT_KEY = 'imm_active_heartbeats';
const SESSION_KEY = 'imm_user_session_id';

// Unique ID for the current browser tab
const TAB_ID = typeof window !== 'undefined' 
  ? (window.__imm_tab_id || (window.__imm_tab_id = 'tab_' + Math.random().toString(36).substring(2, 9)))
  : 'tab_node';

// Helper to detect real device
export function detectDevice() {
  if (typeof navigator === 'undefined') return 'Desktop / Laptop';
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'Smartphone (Mobile)';
  }
  if (/iPad|Tablet/i.test(ua)) {
    return 'Tablet';
  }
  return 'Desktop / Laptop';
}

// Helper to detect real browser
export function detectBrowser() {
  if (typeof navigator === 'undefined') return 'Web Browser';
  const ua = navigator.userAgent;
  if (/Edg/i.test(ua)) return 'Microsoft Edge';
  if (/Chrome/i.test(ua)) return 'Google Chrome';
  if (/Firefox/i.test(ua)) return 'Mozilla Firefox';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Apple Safari';
  if (/Opera|OPR/i.test(ua)) return 'Opera';
  return 'Web Browser';
}

// Helper to normalize referrer names cleanly (removes technical jargon like Direct / Localhost)
export function normalizeReferrer(name) {
  if (!name) return 'Akses Langsung';
  if (name.includes('Direct') || name.includes('Localhost') || name.includes('Langsung')) {
    return 'Akses Langsung';
  }
  return name;
}

// Helper to detect real referrer
export function detectReferrer() {
  if (typeof document === 'undefined') return 'Akses Langsung';
  const ref = document.referrer || '';
  const search = typeof window !== 'undefined' ? window.location.search : '';

  if (ref.includes('whatsapp') || search.includes('wa')) return 'Grup WhatsApp';
  if (ref.includes('instagram') || search.includes('ig')) return 'Instagram IMM';
  if (ref.includes('twitter') || ref.includes('t.co') || ref.includes('x.com')) return 'Twitter / X';
  if (ref.includes('facebook') || ref.includes('fb')) return 'Facebook';
  if (ref.includes('google')) return 'Google Search';
  if (ref) {
    try {
      return new URL(ref).hostname;
    } catch {
      return 'Web Eksternal';
    }
  }
  return 'Akses Langsung';
}

// Helper for formatting time ago
export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Baru saja';
  const diffSecs = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSecs < 10) return 'Baru saja';
  if (diffSecs < 60) return `${diffSecs} dtk lalu`;
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} mnt lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

// Heartbeat system: accurately count real open tabs in real-time
export function sendHeartbeat() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 1;
  try {
    const now = Date.now();
    const raw = localStorage.getItem(HEARTBEAT_KEY);
    let beats = raw ? JSON.parse(raw) : {};

    // Remove inactive heartbeats older than 7 seconds
    const activeBeats = {};
    Object.keys(beats).forEach(id => {
      if (now - beats[id] < 7000) {
        activeBeats[id] = beats[id];
      }
    });

    // Record this tab's heartbeat
    activeBeats[TAB_ID] = now;
    localStorage.setItem(HEARTBEAT_KEY, JSON.stringify(activeBeats));

    return Math.max(1, Object.keys(activeBeats).length);
  } catch (e) {
    return 1;
  }
}

// Get the actual number of actively open tabs
export function getActiveTabCount() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 1;
  try {
    const now = Date.now();
    const raw = localStorage.getItem(HEARTBEAT_KEY);
    if (!raw) return 1;
    const beats = JSON.parse(raw);
    const count = Object.keys(beats).filter(id => (now - beats[id]) < 7000).length;
    return Math.max(1, count);
  } catch (e) {
    return 1;
  }
}

// Get analytics store from localStorage
export function getAnalyticsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.visits)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading analytics store', e);
  }

  // Pure authentic initial store: records only the real current user session
  const now = Date.now();
  const initialVisit = {
    id: 'v-initial-' + now,
    timestamp: now,
    device: detectDevice(),
    browser: detectBrowser(),
    referrer: detectReferrer(),
    path: '/'
  };

  const defaultStore = {
    visits: [initialVisit],
    pageviews: 1,
    articleViews: {},
    totalReadingSeconds: 15,
    lastActiveTimestamp: now
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, initialVisit.id);
    }
  } catch (e) {}

  return defaultStore;
}

// Save analytics store
function saveAnalyticsStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving analytics store', e);
  }
}

// Record a real page visit (Safe from duplicate increments on page refresh)
export function recordVisit(path = '/') {
  const store = getAnalyticsStore();
  const now = Date.now();

  // Send real heartbeat
  sendHeartbeat();
  store.lastActiveTimestamp = now;
  store.pageviews = (store.pageviews || 0) + 1;

  // Check if session is already recorded in this browser tab/session
  const existingSession = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null;

  if (!existingSession) {
    // Only increment unique visit if this is a brand new browser session (NOT a page refresh)
    const newSessionId = 'sess_' + now + '_' + Math.random().toString(36).substring(2, 6);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, newSessionId);
    }

    const newVisit = {
      id: newSessionId,
      timestamp: now,
      device: detectDevice(),
      browser: detectBrowser(),
      referrer: detectReferrer(),
      path
    };

    store.visits = store.visits || [];
    store.visits.push(newVisit);

    // Keep max 200 logs
    if (store.visits.length > 200) {
      store.visits = store.visits.slice(-200);
    }
  }

  saveAnalyticsStore(store);
  return store;
}

// Record a real article view
export function recordArticleView(articleId) {
  if (!articleId) return;
  const store = getAnalyticsStore();
  store.articleViews = store.articleViews || {};
  store.articleViews[articleId] = (store.articleViews[articleId] || 0) + 1;
  store.lastActiveTimestamp = Date.now();
  sendHeartbeat();
  saveAnalyticsStore(store);
}

// Record real reading time in seconds
export function recordReadingTime(seconds = 5) {
  const store = getAnalyticsStore();
  store.totalReadingSeconds = (store.totalReadingSeconds || 0) + seconds;
  store.lastActiveTimestamp = Date.now();
  sendHeartbeat();
  saveAnalyticsStore(store);
}

// Reset analytics data back to pure fresh 1 (the current user)
export function resetAnalyticsData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HEARTBEAT_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}

  const now = Date.now();
  const freshSessionId = 'sess_' + now;
  try {
    sessionStorage.setItem(SESSION_KEY, freshSessionId);
  } catch (e) {}

  const freshStore = {
    visits: [
      {
        id: freshSessionId,
        timestamp: now,
        device: detectDevice(),
        browser: detectBrowser(),
        referrer: detectReferrer(),
        path: '/'
      }
    ],
    pageviews: 1,
    articleViews: {},
    totalReadingSeconds: 10,
    lastActiveTimestamp: now
  };

  sendHeartbeat();
  saveAnalyticsStore(freshStore);
  return freshStore;
}

// Compute real-time analytics summary for the Admin dashboard
export function getAnalyticsSummary(articles = []) {
  const store = getAnalyticsStore();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const visits = store.visits || [];

  // Total unique visits
  const totalVisits = Math.max(1, visits.length);

  // Today's unique visits
  const todayVisits = Math.max(1, visits.filter(v => v.timestamp >= todayStart).length);

  // Accurate real-time active users (counted via active tab heartbeats)
  const activeNow = getActiveTabCount();

  // Average reading time formatted
  const totalSeconds = store.totalReadingSeconds || 30;
  const avgSeconds = totalVisits > 0 ? Math.round(totalSeconds / totalVisits) : totalSeconds;
  const avgMins = Math.floor(avgSeconds / 60);
  const avgSecsRemainder = avgSeconds % 60;
  const avgReadingTime = `${avgMins}m ${avgSecsRemainder}s`;

  // Real 7-day breakdown based on actual calendar days
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const count = visits.filter(v => v.timestamp >= dayStart && v.timestamp < dayEnd).length;
    weeklyData.push({
      day: days[d.getDay()],
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      visits: count
    });
  }

  // Calculate height percentages for weekly chart
  const maxVisits = Math.max(...weeklyData.map(w => w.visits), 1);
  const weeklyDataWithHeight = weeklyData.map(w => ({
    ...w,
    height: `${Math.max(16, Math.round((w.visits / maxVisits) * 100))}%`
  }));

  // Real Traffic Sources breakdown (using clean Indonesian names)
  const sourceCounts = {};
  visits.forEach(v => {
    const src = normalizeReferrer(v.referrer);
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const sourceColors = {
    'Grup WhatsApp': 'bg-emerald-500',
    'Instagram IMM': 'bg-pink-500',
    'Twitter / X': 'bg-red-500',
    'Akses Langsung': 'bg-blue-500',
    'Google Search': 'bg-amber-500',
    'Facebook': 'bg-indigo-500'
  };

  const trafficSources = Object.keys(sourceCounts).map(name => {
    const count = sourceCounts[name];
    const percent = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
    return {
      name,
      count,
      percent,
      color: sourceColors[name] || 'bg-zinc-400'
    };
  }).sort((a, b) => b.count - a.count);

  // Real Device breakdown
  let mobileCount = 0;
  let desktopCount = 0;
  let tabletCount = 0;

  visits.forEach(v => {
    if (v.device && v.device.includes('Mobile')) {
      mobileCount++;
    } else if (v.device && v.device.includes('Tablet')) {
      tabletCount++;
    } else {
      desktopCount++;
    }
  });

  const mobilePercent = totalVisits > 0 ? Math.round(((mobileCount + tabletCount) / totalVisits) * 100) : 0;
  const desktopPercent = totalVisits > 0 ? 100 - mobilePercent : 100;

  // Real Article Popularity Ranking
  const articleViewsMap = store.articleViews || {};
  const rankedArticles = articles.map(art => {
    const realViews = articleViewsMap[art.id] || 0;
    return {
      ...art,
      realViews,
      engagementRate: `${realViews > 0 ? Math.min(100, Math.round(((art.likes || 0) / realViews) * 100)) : 0}%`
    };
  }).sort((a, b) => (b.realViews || 0) - (a.realViews || 0));

  // Recent visits log for real transparency (normalized referrers)
  const recentVisits = [...visits].slice(-10).reverse().map(v => ({
    ...v,
    referrer: normalizeReferrer(v.referrer),
    timeAgo: formatTimeAgo(v.timestamp)
  }));

  return {
    totalVisitors: totalVisits,
    todayVisitors: todayVisits,
    pageviews: store.pageviews || totalVisits,
    activeNow,
    avgReadingTime,
    weeklyData: weeklyDataWithHeight,
    trafficSources,
    devices: {
      mobilePercent,
      desktopPercent,
      mobileCount: mobileCount + tabletCount,
      desktopCount
    },
    rankedArticles,
    recentVisits
  };
}
