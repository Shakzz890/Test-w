/* script.js — User's PREFERRED logic restored, with critical bug fixes.
    - [FIX #1] "Stuck Background Bug": `loadChannel` now cancels any old fade-out animations.
    - [FIX #2] "Blank Panel" animation bug fixed in the *restored* `showVideoFormatMenu` (dropdown version).
    - [FIX #3] "Left Panel State" bug fixed. `hideNav()` now resets `bGroupsOpened`.
    - [FIX #4] "Can't control 2nd panel" bug fixed. Keydown handler for Groups now works.
    - [RESTORED] User's original keydown logic for Left Panel (ArrowLeft opens Groups).
    - [RESTORED] User's original loading logic (ChannelLoader).
    - [RESTORED] User's original Video Format <select> dropdown.
    - [RESTORED] User's preference: Default Shaka "circle" spinner will show on mid-stream buffer.
*/

/* -------------------------
    Globals & cached elements
    ------------------------- */
let player = null;
let ui = null;

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const o = {
  PlayerContainer: qs('#playerContainer'),
  AvPlayer: qs('#avplayer'),
  Nav: qs('#nav'),
  GroupList: qs('#GroupList'),
  DynamicGroupsList: qs('#DynamicGroupsList'),
  ListContainer: qs('#list_container'),
  ChannelList: qs('#ChannelList'),
  ChannelLoader: qs('#ChannelLoader'),
  IdleAnimation: qs('#IdleAnimation'),
  PlayButton: qs('#PlayButton'),
  BlurOverlay: qs('#BlurOverlay'),
  ChannelInfo: qs('#ChannelInfo'),
  SettingsMainMenu: qs('#SettingsMainMenu'),
  SettingsVideoFormatMenu: qs('#SettingsVideoFormatMenu'),
  SettingsContainer: qs('#settings_container'),
  ChannelSettings: qs('#ChannelSettings'),
  StreamInfoOverlay: qs('#StreamInfoOverlay'),
  Guide: qs('#Guide'),
  GuideContent: qs('#GuideContent'),
  EpgOverlay: qs('#EpgOverlay'),
  EpgChannels: qs('#EpgChannels'),
  EpgTimeline: qs('#EpgTimeline'),
  SettingsModal: qs('#SettingsModal'),
  SettingsModalContent: qs('#SettingsModalContent'),
  SearchField: qs('#SearchField'),
  ChannelInfoName: qs('#channel_name'),
  ChannelInfoEpg: qs('#channel_epg'),
  ChannelInfoLogo: qs('#ch_logo'),
  TempMessageOverlay: qs('#TempMessageOverlay'),
  ListContainerScrollArea: qs('#list_container_scrollarea')
};

/* -------------------------
    Channel list
    ------------------------- */
let channels = {
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
    StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
    SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
    aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg1泍1c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"] },
    sinemanila: { name: "SineManila", type: "hls", manifestUri: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "https://is5-ssl.mzstatic.com/image/thumb/Purple112/v4/64/72/72/64727284-ad63-33a7-59a6-7975c742c038/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg", group: ["movies", "entertainment"] },
    pbarush: { name: "PBA Rush", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3", key: "95b2f2ffd4e14073620506213b62ac82", logo: "httpss://static.wikia.nocookie.net/logopedia/images/0/00/PBA_Rush_Logo_2016.png", group: ["entertainment"] },
    animalplanet: { name: "Animal Planet", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", keyId: "436b69f987924fcbbc06d40a69c2799a", key: "c63d5b0d7e52335b61aeba4f6537d54d", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["documentary"] },
    discoverychannel: { name: "Discovery Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", keyId: "d9ac48f5131641a789328257e778ad3a", key: "b6e67c37239901980c6e37e0607ceee6", logo: "https://placehold.co/100x100/000/fff?text=Discovery", group: ["documentary"] },
    nickelodeon: { name: "Nickelodeon", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd", keyId: "9ce58f37576b416381b6514a809bfd8b", key: "f0fbb758cdeeaddfa3eae538856b4d72", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["cartoons & animations"] },
    nickjr: { name: "Nick Jr", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", keyId: "bab5c11178b646749fbae87962bf5113", key: "0ac679aad3b9d619ac39ad634ec76bc8", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["cartoons & animations"] },
    pbo: { name: "PBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["movies", "entertainment"] },
    angrybirds: { name: "Angry Birds", type: "hls", manifestUri: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=547", logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png", group: ["cartoons & animations"] },
    zoomooasia: { name: "Zoo Moo Asia", type: "hls", manifestUri: "https://zoomoo-samsungau.amagi.tv/playlist.m3u8", logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png", group: ["cartoons & animations", "entertainment"] },
    mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUri: "https://example.com/placeholder/live.m3u8", logo: "https://placehold.co/100x100/000/fff?text=Mr+Bean", group: ["entertainment"] },
};

/* -------------------------
    State variables
    ------------------------- */
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iChannelListIndex = 0;
let iActiveChannelIndex = 0;
let iGroupListIndex = 1; // Default to 'ALL CHANNELS'
let channelNameTimeout = null;
let isSessionActive = false;
let bNavOpened = false;
let bGroupsOpened = false;
let bChannelSettingsOpened = false;
let bSettingsModalOpened = false;
let bGuideOpened = false;
let bEpgOpened = false;
let iChannelSettingsIndex = 0;
let iVideoSettingsIndex = 0;
let iEpgChannelIndex = 0;
let aEpgFilteredChannelKeys = [];
let iSettingsModalIndex = 0;
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0;
let loaderFadeTimeout = null;
let tempMessageTimeout = null;
let bHasPlayedOnce = false;

/* Debounce / throttle helpers */
let lastToggleAt = 0;
function preventRapidToggle(ms = 300) {
  const now = Date.now();
  if (now - lastToggleAt < ms) return true;
  lastToggleAt = now;
  return false;
}

/* -------------------------
    STATE & HISTORY MGMT
   ------------------------- */
const overlayStack = [];

/* [KEPT] User's original preference. No spinner-hiding logic. */
function pushOverlayState(name) {
  overlayStack.push(name);
  try { history.pushState({ overlay: name }, ''); } catch(e) { /* noop for older browsers */ }
}
function popOverlayState() {
  overlayStack.pop();
}
/* --- END --- */

window.addEventListener('popstate', (ev) => {
  if (overlayStack.length > 0) {
    ev.preventDefault?.();
    const top = overlayStack[overlayStack.length - 1]; 
    switch (top) {
      case 'epg': hideEpg(); break;
      case 'guide': hideGuide(); break;
      case 'settingsModal': window.hideSettingsModal(); break;
      case 'channelSettings': hideChannelSettings(); break;
      case 'nav': hideNav(); break;
      default:
        clearUi();
    }
    try {
      if (overlayStack.length === 0) history.replaceState({}, '');
    } catch(e){}
  } else {
    // No overlayStack: let default behaviour happen
  }
});

/* -------------------------
    Utilities
    ------------------------- */
const getEl = id => document.getElementById(id);

function showTempMessage(message) {
    if (!o.TempMessageOverlay) return;
    clearTimeout(tempMessageTimeout);
    o.TempMessageOverlay.textContent = message;
    o.TempMessageOverlay.classList.remove('HIDDEN');
    o.TempMessageOverlay.classList.add('visible');

    tempMessageTimeout = setTimeout(() => {
        o.TempMessageOverlay.classList.remove('visible');
        setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 3000);
    }, 3000);
}

/* -------------------------
    Shaka + Player init
    ------------------------- */
async function initPlayer() {
  Object.keys(channels).forEach((key, i) => {
    channels[key].number = i + 1;
    channels[key].key = key;
  });

  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav(); // Build groups first
  sSelectedGroup = '__all'; // Set default group

  // Find the index for 'ALL CHANNELS' based on *all* li items
  if (o.GroupList) {
      const allGroupLiItems = qsa('li', o.GroupList); // Get all li items
      const initialGroupItem = allGroupLiItems.find(li => li.dataset.group === '__all');
      
      if (initialGroupItem) {
          iGroupListIndex = allGroupLiItems.indexOf(initialGroupItem); 
      } else {
           // Fallback if '__all' isn't found 
          iGroupListIndex = allGroupLiItems.findIndex(li => li.textContent.trim() === 'ALL CHANNELS');
          if (iGroupListIndex === -1) iGroupListIndex = 1; // Absolute fallback
      }
  } else {
      iGroupListIndex = 1; // Fallback
  }

  buildNav();
  updateSelectedGroupInNav(); // Update visual selection

  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) {
    console.error("Browser not supported");
    return;
  }

  player = new shaka.Player();
  ui = new shaka.ui.Overlay(player, o.PlayerContainer || document.body, o.AvPlayer || document.createElement('video'));

  ui.configure({
    controlPanelElements: [],
    addSeekBar: false,
    addBigPlayButton: false,
    showBuffering: true, // [KEPT] User's preference
    clickToPlay: false
  });

  if (o.AvPlayer) {
    player.attach(o.AvPlayer);
  }
  player.configure({
    abr: { defaultBandwidthEstimate: 500000 },
    streaming: { rebufferingGoal: 2, bufferingGoal: 3 }
  });

  // events
  player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    
    // [KEPT] User's original error handling for ChannelLoader
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';

    // Show idle animation (with play button) on error
    showIdleAnimation(true);
  });

  player.addEventListener('trackschanged', renderChannelSettings);

  /* [KEPT] User's original buffering logic */
  player.addEventListener('buffering', (event) => {
    if (event.buffering) {
      // If it's buffering AND we haven't played the first frame yet (initial load)
      if (!bHasPlayedOnce) {
        if (o.ChannelLoader) {
          o.ChannelLoader.classList.remove('HIDDEN');
          o.ChannelLoader.classList.remove('fade-out');
          o.ChannelLoader.style.opacity = '1';
        }
      }
      // If bHasPlayedOnce is true, Shaka's default spinner will show (as requested)
    } else {
      // Always hide our custom loader when buffering stops
      hideLoaderAndShowVideo();
    }
  });
  
  player.addEventListener('playing', handlePlaying);

  // keep stream info updated
  player.addEventListener('adaptation', updateStreamInfo);
  player.addEventListener('streaming', updateStreamInfo);

  setupControls(); // This now includes the search listener
  showIdleAnimation(true); // Show idle screen with Play button on start
  loadInitialChannel();
  
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

/* [KEPT] User's original loader logic */
function handlePlaying() {
  bHasPlayedOnce = true;
  hideLoaderAndShowVideo();
}
function hideLoaderAndShowVideo() {
  clearTimeout(loaderFadeTimeout);
  if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  if (o.ChannelLoader && !o.ChannelLoader.classList.contains('HIDDEN')) {
    o.ChannelLoader.classList.add('fade-out');
    loaderFadeTimeout = setTimeout(() => {
      if (o.ChannelLoader) {
        o.ChannelLoader.classList.add('HIDDEN');
        o.ChannelLoader.style.opacity = '1';
        o.ChannelLoader.classList.remove('fade-out');
      }
    }, 500);
  }
}

/* -------------------------
    Touch / click / remote controls
    ------------------------- */
function setupControls() {
  const playerContainer = o.PlayerContainer || document.body;

  // touch handlers
  playerContainer.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    }
  }, { passive: true });

  playerContainer.addEventListener('touchmove', e => {
    if (e.touches[0]) { // Add check for e.touches[0]
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }, { passive: true });

  playerContainer.addEventListener('touchend', e => {
    if (e.changedTouches.length !== 1) return;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const SWIPE_THRESHOLD = 50;
    const TAP_THRESHOLD = 15;

    const targetElement = document.elementFromPoint(touchStartX, touchStartY);
    const startedInNav = targetElement?.closest('#nav');
    const startedInOtherModal = targetElement && (targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay'));

    // Check for swipe gesture
    if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
        if (startedInNav) {
            const isHorizontal = absDeltaX > absDeltaY;
            if (isHorizontal && deltaX > 0) { 
                handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY);
            }
        } else if (startedInOtherModal) {
            // ignore
        } else {
            handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY);
        }
        lastTapTime = 0; 
        touchStartX = touchStartY = touchEndX = touchEndY = 0;
        return;
    }

    // Tap Detection
    if (startedInNav || startedInOtherModal) {
        touchStartX = touchStartY = touchEndX = touchEndY = 0;
        return;
    }

    if (absDeltaX < TAP_THRESHOLD && absDeltaY < TAP_THRESHOLD) {
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) { // double-tap
        lastTapTime = 0;
        handleDoubleTapAction();
      } else {
        lastTapTime = currentTime;
        setTimeout(() => {
          if (Date.now() - lastTapTime >= 300) {
            handleSingleTapAction();
          }
        }, 320);
      }
    }
    touchStartX = touchStartY = touchEndX = touchEndY = 0;
  }, { passive: false });

  // clicks
  playerContainer.addEventListener('click', (e) => {
    if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay') || e.target.closest('#PlayButton'))) {
      return;
    }
    handleSingleTapAction();
  });

  playerContainer.addEventListener('dblclick', (e) => {
    e.preventDefault();
    handleDoubleTapAction();
  });

  // Play button
  if (o.PlayButton) {
    o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
    o.PlayButton.removeEventListener('touchend', handleFirstPlay);
    o.PlayButton.addEventListener('touchend', (ev) => {
      ev.preventDefault();
      handleFirstPlay();
    });
  }

  // Search field
  if (o.SearchField) {
    o.SearchField.addEventListener('input', () => {
      buildNav(); 
      if (aFilteredChannelKeys.length > 0) {
        iChannelListIndex = 0; 
        updateSelectedChannelInNav(); 
      }
    });
  } else { console.error("SearchField element not found."); }
}

/* Swipe logic (mobile) */
function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
  const isHorizontal = absDeltaX > absDeltaY;

  if (bGuideOpened) { hideGuide(); return; }
  if (bEpgOpened) { hideEpg(); return; }
  if (bSettingsModalOpened) { window.hideSettingsModal(); return; }

  if (isHorizontal) {
    if (deltaX > 0) { // swipe right
      if (bChannelSettingsOpened) { hideChannelSettings(); }
      else if (bNavOpened && !bGroupsOpened) { showGroups(); }
      else if (!bNavOpened) { showNav(); }
    } else { // swipe left
      if (bGroupsOpened) { hideGroups(); }
      else if (bNavOpened) { hideNav(); }
      else if (!bChannelSettingsOpened) { showChannelSettings(); }
    }
  } else {
    // vertical
    if (!bNavOpened && !bChannelSettingsOpened && !bGuideOpened && !bEpgOpened && !bSettingsModalOpened) {
      if (deltaY > 0) loadChannel(iActiveChannelIndex + 1);
      else loadChannel(iActiveChannelIndex - 1);
    }
  }
}

/* Single / double tap actions */
function handleSingleTapAction() {
  if (!isSessionActive) return;
  if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
    clearUi(); // close all overlays
  } else {
    showChannelName();
  }
}
function handleDoubleTapAction() {
  toggleFullScreen();
}

/* -------------------------
    Channel loading & nav
    ------------------------- */
function loadInitialChannel() {
  const storedLast = localStorage.getItem('iptvLastWatched');
  let initialChannelKey = 'SonictheHedgehog'; 
  if (!channels[initialChannelKey]) {
    initialChannelKey = Object.keys(channels)[0];
    if (!initialChannelKey) {
      console.error("No channels defined.");
      return;
    }
  }

  if (aFilteredChannelKeys.length === 0) {
    sSelectedGroup = '__all';
    buildNav();
    if (aFilteredChannelKeys.length === 0) {
        console.error("No channels available even in the '__all' group.");
        return;
    }
  }

  if (storedLast && channels[storedLast] && aFilteredChannelKeys.includes(storedLast)) {
      initialChannelKey = storedLast;
  } else if (!aFilteredChannelKeys.includes(initialChannelKey)) {
      initialChannelKey = aFilteredChannelKeys[0];
  }

  if (!initialChannelKey || !aFilteredChannelKeys.includes(initialChannelKey)) {
      console.error("Could not determine a valid initial channel from filtered list.");
      return;
  }

  const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
  iChannelListIndex = (initialIndex >= 0 ? initialIndex : 0);
  iActiveChannelIndex = iChannelListIndex;
  updateSelectedChannelInNav();
}

async function loadChannel(index, options = {}) {
  clearTimeout(loaderFadeTimeout);

  /* [FIX #1] Reset ChannelLoader fade-out state before loading */
  if (o.ChannelLoader) {
      o.ChannelLoader.classList.remove('fade-out');
      o.ChannelLoader.style.opacity = '1';
  }
  /* --- END FIX --- */

  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    console.warn("loadChannel called with no filtered channels available.");
    try { await player?.unload(); } catch {}
    showIdleAnimation(!isSessionActive);
    return;
  }

  iChannelListIndex = (index < 0) ? (aFilteredChannelKeys.length - 1) : (index % aFilteredChannelKeys.length);
  iActiveChannelIndex = iChannelListIndex;

  const channelKey = aFilteredChannelKeys[iChannelListIndex];
  if (!channelKey || !channels[channelKey]) {
    console.error(`Invalid channel key or data for index ${iChannelListIndex}: ${channelKey}`);
    showIdleAnimation(!isSessionActive);
    return;
  }
  const channel = channels[channelKey];

  if (!player) {
    console.error("Player not initialized before loading channel.");
    return;
  }

  localStorage.setItem('iptvLastWatched', channelKey);

  if (!options.isFirstPlay && o.AvPlayer) {
    o.AvPlayer.style.opacity = '0';
  }

  /* [KEPT] User's original ChannelLoader logic */
  if (o.ChannelLoader) {
    o.ChannelLoader.classList.remove('HIDDEN');
  }

  hideChannelName();
  updateSelectedChannelInNav();

  try {
    player.configure('drm.clearKeys', {});
    if (channel.type === 'clearkey' && channel.keyId && channel.key) {
      player.configure({ drm: { clearKeys: { [channel.keyId]: channel.key } } });
    }

    player.getNetworkingEngine()?.clearAllRequestFilters();
    if (channel.userAgent) {
      player.getNetworkingEngine()?.registerRequestFilter((type, request) => {
        request.headers['User-Agent'] = channel.userAgent;
      });
    }

    if (isSessionActive && o.AvPlayer) {
        o.AvPlayer.muted = false;
    }

    // apply anime background
    if (o.ChannelLoader) {
      o.ChannelLoader.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg')";
    }
    
    bHasPlayedOnce = false;
    await player.load(channel.manifestUri);
    
    if (o.PlayerContainer) o.PlayerContainer.focus();

    if (isSessionActive) {
      if (o.AvPlayer) {
        o.AvPlayer.play().catch(e => console.warn("Autoplay after load prevented.", e));
      }
      showChannelName();
    }
  } catch (error) {
    console.error(`Error loading channel "${channel?.name}":`, error);
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
    
    showIdleAnimation(!isSessionActive); // Show idle screen with play button
  }
}

/* -------------------------
    Navigation & UI
    ------------------------- */
function setupMainMenuControls() {
  const guideBtn = getEl('guide_button');
  const epgBtn = getEl('epg_button');
  if (guideBtn) guideBtn.onclick = () => { showGuide(); };
  else console.warn("guide_button not found.");
  if (epgBtn) epgBtn.onclick = () => { showEpg(); };
  else console.warn("epg_button not found.");

  if (o.PlayButton) {
      o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
      o.PlayButton.addEventListener('mousedown', handleFirstPlay);
  } else {
      console.error("PlayButton element not found.");
  }
}

function buildDynamicGroupNav() {
  if (!o.DynamicGroupsList || !o.GroupList) {
      console.error("Required group list elements not found.");
      return;
  }

  let sortedGroups = [];
  try {
      const allGroups = new Set(Object.values(channels).flatMap(ch => ch?.group || []));
      sortedGroups = [...allGroups].sort();
  } catch (error) { console.error("Error processing channel groups:", error); }

  o.DynamicGroupsList.innerHTML = '';

  const allListItems = [];

  const favLi = document.createElement('li');
  favLi.dataset.group = '__fav';
  favLi.textContent = 'FAVORITES';
  allListItems.push(favLi);

  const allLi = document.createElement('li');
  allLi.dataset.group = '__all';
  allLi.textContent = 'ALL CHANNELS';
  allListItems.push(allLi);

  sortedGroups.forEach(name => {
    const safeName = (name || 'Unnamed Group').replace(/</g, '&lt;');
    const dynamicLi = document.createElement('li');
    dynamicLi.dataset.group = safeName;
    dynamicLi.textContent = safeName.toUpperCase();
    allListItems.push(dynamicLi);
  });

  allListItems.forEach(li => o.DynamicGroupsList.appendChild(li));

  // [KEPT] User's original logic: bind clicks to *all* li elements in GroupList
  const fullGroupListItems = qsa('li', o.GroupList);
  fullGroupListItems.forEach((li, index) => {
      li.onclick = null;
      if (li.hasAttribute('data-group')) {
          // Find the index *relative to the full list*
          li.onclick = () => selectGroup(index); 
      }
      else if (li.id === 'guide_button') {
          li.onclick = showGuide;
      } else if (li.id === 'epg_button') {
          li.onclick = showEpg;
      }
  });
}

/* [KEPT] User's original function */
function selectGroup(index) { 
  if (!o.GroupList || !o.ListContainer) {
      console.error("GroupList or ListContainer not found.");
      return;
  }
  
  const groupItems = qsa('li', o.GroupList);
  if (index < 0 || index >= groupItems.length) {
      console.warn("Invalid index passed to selectGroup:", index);
      return;
  }
  const item = groupItems[index];
  if (!item || !item.hasAttribute('data-group')) {
      return; // Ignore clicks on non-group items like headers
  }

  if (item.dataset.group === '__fav') {
      const hasFavorites = Object.values(channels).some(ch => ch.favorite === true);
      if (!hasFavorites) {
          showTempMessage("No favorite channels added yet.");
          hideNav();
          return;
      }
  }

  sSelectedGroup = item.dataset.group;
  iGroupListIndex = index; // This is now the correct index (relative to all li's)
  updateSelectedGroupInNav();

  buildNav();

  if (aFilteredChannelKeys.length > 0) {
    iChannelListIndex = 0;
    updateSelectedChannelInNav();
  }

  requestAnimationFrame(() => {
      hideGroups();
  });
}

function buildNav() {
  if (!o.ChannelList || !o.SearchField) {
      console.error("ChannelList or SearchField element not found.");
      return;
  }

  const searchTerm = (o.SearchField.value || '').toLowerCase();

  try {
      aFilteredChannelKeys = Object.keys(channels)
        .filter(key => {
          const ch = channels[key];
          if (!ch || typeof ch.name !== 'string') return false;
          const inGroup = sSelectedGroup === '__all' ||
                            (sSelectedGroup === '__fav' && ch.favorite === true) ||
                            (Array.isArray(ch.group) && ch.group.includes(sSelectedGroup));
          const inSearch = !searchTerm || ch.name.toLowerCase().includes(searchTerm);
          return inGroup && inSearch;
        })
        .sort((a, b) => (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));
  } catch (error) {
      console.error("Error filtering/sorting channels:", error);
      aFilteredChannelKeys = [];
  }

  console.log(`Building Nav for group: "${sSelectedGroup}", Found channels: ${aFilteredChannelKeys.length}`);

  if (o.ChannelList) {
    o.ChannelList.innerHTML = '';
    o.ChannelList.scrollTop = 0;
  }

  if (aFilteredChannelKeys.length === 0) {
    const msg = sSelectedGroup === '__fav'
        ? 'No favorite channels found. Add channels using the settings menu (→).'
        : 'No channels found in this category.';
    o.ChannelList.innerHTML = `<li style="justify-content:center; color:#888; padding:12px; height: auto; line-height: normal; white-space: normal; text-align: center;">${msg}</li>`;
    return;
  }

  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, index) => {
    const ch = channels[key];
    if (!ch) return;

    const item = document.createElement('li');
    item.className = 'channel-item';
    item.onclick = () => {
      if (preventRapidToggle(220)) return;
      if (isSessionActive) {
        loadChannel(index);
      } else {
        iChannelListIndex = index;
        iActiveChannelIndex = index; // Sync active index
        updateSelectedChannelInNav();
      }
      setTimeout(hideNav, 50);
    };

    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
    const logoHtml = ch.logo
        ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'; this.onerror=null;"></div>`
        : '<div class="nav_logo" style="width: 50px;"></div>';

    const safeName = (ch.name || 'Unknown Channel').replace(/</g, '&lt;');

    item.innerHTML = `${fav}<span class="list-ch">${ch.number || '?'}</span><span class="list-title">${safeName}</span>${logoHtml}`;
    frag.appendChild(item);
  });

  o.ChannelList.appendChild(frag);
  
  const activeKey = aFilteredChannelKeys[iActiveChannelIndex];
  iChannelListIndex = aFilteredChannelKeys.indexOf(activeKey);
  if(iChannelListIndex === -1) iChannelListIndex = 0;
  
  updateSelectedChannelInNav();
}

function updateSelectedChannelInNav() {
  if (!o.ChannelList) return;
  try {
      const currentSelected = o.ChannelList.querySelector('.selected');
      if (currentSelected) currentSelected.classList.remove('selected');
      qsa('li.playing', o.ChannelList).forEach(li => li.classList.remove('playing'));

      const channelItems = qsa('li.channel-item', o.ChannelList);
      
      if(iActiveChannelIndex >= 0 && iActiveChannelIndex < channelItems.length) {
          const activeItem = channelItems[iActiveChannelIndex];
          if(activeItem) activeItem.classList.add('playing');
      }

      if (iChannelListIndex >= 0 && iChannelListIndex < channelItems.length) {
          const newItem = channelItems[iChannelListIndex];
          if (newItem) {
            newItem.classList.add('selected');
            if (bNavOpened && typeof newItem.scrollIntoView === 'function') {
                newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
      } else if (aFilteredChannelKeys.length > 0 && channelItems.length > 0) {
          iChannelListIndex = 0;
          const firstItem = channelItems[0];
          if (firstItem) firstItem.classList.add('selected');
          console.warn("iChannelListIndex was out of bounds, selecting first channel.");
      } else {
        iChannelListIndex = -1;
      }

  } catch (error) { console.error("Error updating selected channel in nav:", error); }
}

/* [KEPT] User's original function */
function updateSelectedGroupInNav() {
    if (!o.GroupList) return; // Target the top-level container
    try {
        const currentSelected = o.GroupList.querySelector('.selected');
        if (currentSelected) currentSelected.classList.remove('selected');

        const allLis = qsa('li', o.GroupList); // Query for ALL li elements
        if (iGroupListIndex >= 0 && iGroupListIndex < allLis.length) {
            const newItem = allLis[iGroupListIndex];
            if (newItem) {
                newItem.classList.add('selected');
                if (bGroupsOpened && typeof newItem.scrollIntoView === 'function') {
                    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else {
            console.warn("Cannot update selected group, invalid iGroupListIndex:", iGroupListIndex);
        }
    } catch (error) { console.error("Error updating selected group in nav:", error); }
}

/* -------------------------
    Settings & Modals
    ------------------------- */
function renderChannelSettings() {
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0 || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const currentChannelKey = aFilteredChannelKeys[iActiveChannelIndex];
  const currentChannel = channels[currentChannelKey];
  if (!currentChannel) return;

  if (o.SettingsMainMenu) {
      const currentFormat = getAspectRatio();
      const html = `
        <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
        <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
        <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
      `;
      requestAnimationFrame(() => {
        if (o.SettingsMainMenu) { 
            o.SettingsMainMenu.innerHTML = html;
            updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
        }
      });
  } else { console.error("SettingsMainMenu element not found"); }
}

/* [RESTORED] User's original showVideoFormatMenu function */
function showVideoFormatMenu() {
  if (o.SettingsContainer) { 
    o.SettingsContainer.classList.add('submenu-visible');
    iVideoSettingsIndex = 0;
    renderVideoFormatMenu(); // This will now render the dropdown
  } else { console.error("SettingsContainer element not found."); }
}
/* --- END RESTORE --- */

function hideVideoFormatMenu() {
  if (o.SettingsContainer) {
      o.SettingsContainer.classList.remove('submenu-visible');
      iChannelSettingsIndex = 1;
      if (o.SettingsMainMenu) {
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
      } else { console.error("SettingsMainMenu element not found for focus update."); }
  } else { console.error("SettingsContainer element not found."); }
}

/* [RESTORED] User's original renderVideoFormatMenu with <select> */
function renderVideoFormatMenu() {
  if (o.SettingsVideoFormatMenu) { 
      o.SettingsVideoFormatMenu.innerHTML = `
        <div class="settings-item" onclick="hideVideoFormatMenu()">&#8592; Back</div>
        <div class="settings-item-header">Video Settings</div>
        <div class="settings-item">
          <span>Video format</span>
          <select onchange="setAspectRatio(this.value)">
            <option value="original">Original</option>
            <option value="16:9">16:9</option>
            <option value.

