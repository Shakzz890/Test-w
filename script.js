/* script.js — User's preferred logic restored with critical bug fixes.
    - [FIX #1] "Left Panel Bug": Added `bGroupsOpened = false;` to `hideNav()` to ensure it always resets.
    - [FIX #2] "Stuck Background Bug": `loadChannel` now cancels any old fade-out animations.
    - [KEPT] All of the user's original logic (Blank Panel fix, mid-stream buffer, etc.).
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
    if (e.touches.length === 1) {
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

  /* [FIX #2] Reset ChannelLoader fade-out state before loading */
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

/* [FIX #2] This is the new, robust "blank panel" fix */
function showVideoFormatMenu() {
  if (preventRapidToggle(220)) return;
  if (o.SettingsContainer && o.SettingsVideoFormatMenu) {
    
    const submenuHtml = renderVideoFormatMenu(); // 1. Get the HTML string
 
    // Use a multi-step frame update to prevent a "blank" transition
    requestAnimationFrame(() => {
      
      // 2. Set the HTML
      o.SettingsVideoFormatMenu.innerHTML = submenuHtml; 
      
      // 3. Wait another frame
      requestAnimationFrame(() => {
        // 4. Apply the selection. This FORCES the browser to paint the new HTML
        //    because it has to find the .settings-item elements.
        iVideoSettingsIndex = 0;
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);

        // 5. Wait one MORE frame (using a 0ms timeout) to let the paint
        //    register *before* starting the CSS animation.
        setTimeout(() => {
          // 6. NOW, and only now, start the transition
          o.SettingsContainer.classList.add('submenu-visible'); 
        }, 0); 
      });
    });
  } else { console.error("SettingsContainer or SettingsVideoFormatMenu element not found."); }
}
/* --- END FIX --- */

function hideVideoFormatMenu() {
  if (o.SettingsContainer) {
      o.SettingsContainer.classList.remove('submenu-visible');
      iChannelSettingsIndex = 1;
      if (o.SettingsMainMenu) {
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
      } else { console.error("SettingsMainMenu element not found for focus update."); }
  } else { console.error("SettingsContainer element not found."); }
}

function renderVideoFormatMenu() {
  const currentFormat = getAspectRatio();
  const html = `
    <div class="settings-item" onclick="hideVideoFormatMenu()">&#8592; Back</div>
    <div class="settings-item-header">Video Settings</div>
    <div class="settings-item" onclick="showSettingsModal('format')">
      <span>Video format</span>
      <span style="color: var(--text-medium);">${currentFormat} &gt;</span>
    </div>
    <div class="settings-item" onclick="showSettingsModal('quality')">
      <span>Video track</span>
      <span style="color: var(--text-medium);">&gt;</span>
    </div>
  `;
  return html;
}

function getAspectRatio() {
    if (!o.AvPlayer) return 'Original';
    const style = o.AvPlayer.style;
    if (style.objectFit === 'fill') return 'Stretch';
    if (style.objectFit === 'cover' && style.transform === 'scale(1.15)') return 'Zoom';
    if (style.objectFit === 'cover') return 'Fill';
    const storedFormat = localStorage.getItem('iptvAspectRatio');
    if (storedFormat) return storedFormat;
    return 'Original';
}

function setAspectRatio(format) {
  if (!o.AvPlayer) return;
  o.AvPlayer.style.transform = 'scale(1)';
  let formatName = 'Original';
  switch(format) {
    case 'stretch':
      o.AvPlayer.style.objectFit = 'fill';
      formatName = 'Stretch';
      break;
    case '16:9':
      o.AvPlayer.style.objectFit = 'contain';
      formatName = '16:9';
      break;
    case 'fill':
      o.AvPlayer.style.objectFit = 'cover';
      formatName = 'Fill';
      break;
    case 'zoom':
      o.AvPlayer.style.objectFit = 'cover';
      o.AvPlayer.style.transform = 'scale(1.15)';
      formatName = 'Zoom';
      break;
    default:
      o.AvPlayer.style.objectFit = 'contain';
      formatName = 'Original';
  }
  localStorage.setItem('iptvAspectRatio', formatName);
  
  if (bChannelSettingsOpened && o.SettingsContainer?.classList.contains('submenu-visible')) {
      const submenuHtml = renderVideoFormatMenu(); 
      if (o.SettingsVideoFormatMenu) {
          o.SettingsVideoFormatMenu.innerHTML = submenuHtml; 
          updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
      }
  }
}

function showSettingsModal(type) {
  if (preventRapidToggle(220)) return;
  if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) {
      console.error("Required modal elements not found.");
      return;
  }
  clearUi('settingsModal');
  o.BlurOverlay.classList.add('visible');
  bSettingsModalOpened = true;
  iSettingsModalIndex = 0;
  try {
      const content = renderModalContent(type);
      requestAnimationFrame(() => {
        o.SettingsModalContent.innerHTML = content;
        o.SettingsModal.classList.remove('HIDDEN');
        updateSettingsModalSelection();
      });
  } catch (error) {
      console.error("Error rendering modal content:", error);
      o.SettingsModalContent.innerHTML = '<p>Error loading content.</p>';
  }
  pushOverlayState('settingsModal');
}

window.hideSettingsModal = () => {
  if (!bSettingsModalOpened) return; 
  bSettingsModalOpened = false;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  popOverlayState();
  
  if (o.PlayerContainer) o.PlayerContainer.focus();
};

function renderModalContent(type) {
  let contentHtml = '';
  try {
      if (!player) return '<p>Player not initialized.</p>';

      if (type === 'quality') {
        const tracks = [...new Map((player.getVariantTracks() || []).filter(t => t.height).map(t => [t.height, t])).values()].sort((a,b)=>b.height-a.height);
        let itemsHtml = `<li class="modal-selectable" data-value="auto" onclick="applyQualityAndClose('auto')">Auto <input type="radio" name="quality" value="auto" ${player.getConfiguration()?.abr?.enabled ? 'checked' : ''}></li>`;
        tracks.forEach(track => {
          const bps = track.bandwidth > 1000000 ? `${(track.bandwidth/1e6).toFixed(2)} Mbps` : `${Math.round(track.bandwidth/1e3)} Kbps`;
          const isChecked = track.active && !player.getConfiguration()?.abr?.enabled;
          itemsHtml += `<li class="modal-selectable" data-value='${track.id}' onclick="applyQualityAndClose('${track.id}')">${track.height}p, ${bps} <input type="radio" name="quality" value='${track.id}' ${isChecked ? 'checked' : ''}></li>`;
        });
        contentHtml = `<h2>Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button></div>`;

      } else if (type === 'format') {
        const currentFormat = getAspectRatio();
        contentHtml = `<h2>Video Format</h2><ul class="popup-content-list">
            <li class="modal-selectable" data-value="original" onclick="applyFormatAndClose('original')">Original <input type="radio" name="format" value="original" ${currentFormat === 'Original' ? 'checked' : ''}></li>
            <li class="modal-selectable" data-value="16:9" onclick="applyFormatAndClose('16:9')">16:9 <input type="radio" name="format" value="16:9" ${currentFormat === '16:9' ? 'checked' : ''}></li>
            <li class="modal-selectable" data-value="fill" onclick="applyFormatAndClose('fill')">Fill <input type="radio" name="format" value="fill" ${currentFormat === 'Fill' ? 'checked' : ''}></li>
            <li class="modal-selectable" data-value="stretch" onclick="applyFormatAndClose('stretch')">Stretch <input type="radio" name="format" value="stretch" ${currentFormat === 'Stretch' ? 'checked' : ''}></li>
            <li class="modal-selectable" data-value="zoom" onclick="applyFormatAndClose('zoom')">Zoom <input type="radio" name="format" value="zoom" ${currentFormat === 'Zoom' ? 'checked' : ''}></li>
          </ul><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button></div>`;

      } else if (type === 'subtitles') {
        const textTracks = player.getTextTracks() || [];
        const audioTracks = player.getAudioLanguagesAndRoles?.() || [];
        let subItemsHtml = `<li class="modal-selectable" onclick="setSubtitlesAndClose(null, false)">Off</li>`;
        textTracks.forEach(track => {
          const safeTrackData = { id: track.id, label: track.label, language: track.language };
          const safeTrack = JSON.stringify(safeTrackData).replace(/</g, '\\u003c');
          subItemsHtml += `<li class="modal-selectable" onclick='setSubtitlesAndClose(${safeTrack}, true)'>${track.label || track.language}</li>`;
        });
        let audioItemsHtml = audioTracks.map(track => `<li class="modal-selectable" onclick="setAudioAndClose('${track.language}')">${track.language} (Audio)</li>`).join('');
        contentHtml = `<h2>Subtitles & Audio</h2><ul class="popup-content-list">${subItemsHtml}${audioItemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CLOSE</button></div>`;

      } else if (type === 'edit') {
        if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return '<p>No channel selected.</p>';
        const currentChannel = channels[aFilteredChannelKeys[iActiveChannelIndex]];
        if (!currentChannel) return '<p>Channel data missing.</p>';
        const safeName = (currentChannel.name || '').replace(/"/g, '&quot;');
        const safeLogo = (currentChannel.logo || '').replace(/"/g, '&quot;');
        contentHtml = `<h2>Edit Channel</h2><div style="padding: 15px 25px;">
          <label>Name</label><br><input type="text" id="edit_ch_name" class="edit-modal-field" value="${safeName}"><br>
          <label>Logo URL</label><br><input type="text" id="edit_ch_logo" class="edit-modal-field" value="${safeLogo}">
        </div><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" onclick="applyChannelEdit()">SAVE</button></div>`;
      }
  } catch (error) {
      console.error("Error generating modal content:", error);
      contentHtml = "<p>Error displaying options.</p>";
  }
  return contentHtml;
}

/* modal helpers */
window.applyChannelEdit = () => {
  const nameInput = getEl('edit_ch_name');
  const logoInput = getEl('edit_ch_logo');
  if (!nameInput || !logoInput) {
      console.error("Edit modal inputs not found.");
      return hideSettingsModal();
  }
  if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return hideSettingsModal();
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  if (!channels[key]) return hideSettingsModal();

  channels[key].name = nameInput.value;
  channels[key].logo = logoInput.value;
  buildNav();
  hideSettingsModal();
};

window.applyQualityAndClose = (selected) => {
    if (!player) return;
    try {
        if (selected === 'auto') {
            player.configure({ abr: { enabled: true } });
        } else {
            player.configure({ abr: { enabled: false } });
            const trackToSelect = (player.getVariantTracks() || []).find(t => t.id == selected);
            if (trackToSelect) {
                player.selectVariantTrack(trackToSelect, true);
            } else {
                player.configure({ abr: { enabled: true } });
            }
        }
    } catch (error) {
        console.error("Error applying quality setting:", error);
        try { player.configure({ abr: { enabled: true } }); } catch { }
    }
    hideSettingsModal();
}

window.applyFormatAndClose = (value) => {
    setAspectRatio(value);
    hideSettingsModal();
}

window.setSubtitlesAndClose = (track, isVisible) => {
    if (!player) return;
    try {
        player.setTextTrackVisibility(isVisible);
        if (isVisible && track && typeof track.id !== 'undefined') {
            const trackToSelect = (player.getTextTracks() || []).find(t => t.id === track.id);
            if (trackToSelect) player.selectTextTrack(trackToSelect);
        }
    } catch (error) {
        console.error("Error setting subtitles:", error);
    }
    hideSettingsModal();
}

window.setAudioAndClose = (lang) => {
    if (!player) return;
    if (typeof lang === 'string' && lang) {
        try {
            player.selectAudioLanguage(lang);
        } catch (error) {
            console.error("Error setting audio language:", error);
        }
    }
    hideSettingsModal();
}

function toggleFavourite() {
  if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  if (!channels[key]) return;

  channels[key].favorite = !channels[key].favorite;
  saveFavoritesToStorage();

  if (bChannelSettingsOpened) {
      renderChannelSettings();
  }

  if (bNavOpened && (sSelectedGroup === '__fav' || sSelectedGroup === '__all')) {
      buildNav();
      const newIndex = aFilteredChannelKeys.indexOf(key);
      if (newIndex !== -1) {
          iChannelListIndex = newIndex;
      } else if (aFilteredChannelKeys.length > 0) {
          iChannelListIndex = 0;
      } else {
          iChannelListIndex = -1;
      }
      updateSelectedChannelInNav();
  }
}

/* -------------------------
    UI State & Helpers
    ------------------------- */
function showIdleAnimation(showPlayButton = false) {
  if (o.IdleAnimation) {
    // ensure the anime background is applied consistently for idle too
    o.IdleAnimation.style.backgroundImage = "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg?w=1600&h=900&fit=crop')";
    o.IdleAnimation.classList.remove('HIDDEN');
  }
  if (o.PlayButton) {
      if (showPlayButton && !isSessionActive) {
          o.PlayButton.classList.remove('HIDDEN');
      } else {
          o.PlayButton.classList.add('HIDDEN');
      }
  }
}
function hideIdleAnimation() {
    if (o.IdleAnimation) o.IdleAnimation.classList.add('HIDDEN');
}

function clearUi(exclude) {
  if (exclude !== 'nav') hideNav();
  if (exclude !== 'channelSettings' && exclude !== 'settingsModal') hideChannelSettings();
  if (exclude !== 'guide') hideGuide();
  if (exclude !== 'channelName') hideChannelName();
  if (exclude !== 'settingsModal') window.hideSettingsModal();
  if (exclude !== 'epg') hideEpg();

  if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) {
      clearTimeout(tempMessageTimeout);
      o.TempMessageOverlay.classList.remove('visible');
      o.TempMessageOverlay.classList.add('HIDDEN');
  }
  
  if (o.PlayerContainer && document.activeElement === document.body) {
    o.PlayerContainer.focus();
  }
}

/* NAV / Groups toggles with overlay state push/pop */
function showNav() {
  if (!o.Nav) return;
  if (preventRapidToggle()) return;
  clearUi('nav'); 
  bNavOpened = true;
  o.Nav.classList.add('visible');
  
  const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
  iChannelListIndex = aFilteredChannelKeys.indexOf(currentKey);
  if (iChannelListIndex === -1) iChannelListIndex = iActiveChannelIndex;
  
  updateSelectedChannelInNav();
  pushOverlayState('nav');
}

function hideNav() {
  if (!bNavOpened) return; 
  if (!o.Nav) return;
  bNavOpened = false;
  bGroupsOpened = false; // [FIX #1] Reset group state when nav closes
  o.Nav.classList.remove('visible');
  if (o.ListContainer?.classList.contains('groups-opened')) {
      hideGroups(); 
  }
  popOverlayState();
  
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

function showGroups() {
  if (bNavOpened && o.ListContainer) {
    bGroupsOpened = true;
    o.ListContainer.classList.add('groups-opened');
    updateSelectedGroupInNav();
  }
}

function hideGroups() {
  bGroupsOpened = false;
  if (o.ListContainer) {
      o.ListContainer.classList.remove('groups-opened');
  }
}

function showChannelSettings() {
  if (!o.ChannelSettings) return;
  if (preventRapidToggle()) return;

  updateStreamInfo();
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.remove('HIDDEN');

  clearUi('channelSettings');
  hideVideoFormatMenu(); 
  iChannelSettingsIndex = 0;
  renderChannelSettings();
  bChannelSettingsOpened = true;
  o.ChannelSettings.classList.add('visible');

  pushOverlayState('channelSettings');
}

function hideChannelSettings() {
  if (!bChannelSettingsOpened) return; 
  if (!o.ChannelSettings) return;
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.add('HIDDEN');
  bChannelSettingsOpened = false;
  o.ChannelSettings.classList.remove('visible');
  popOverlayState();
  
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

/* Guide */
window.showGuide = () => {
  if (!o.Guide || !o.GuideContent || !o.BlurOverlay) return;
  if (preventRapidToggle()) return;
  clearUi('guide');
  o.BlurOverlay.classList.add('visible');
  renderGuideContent();
  bGuideOpened = true;
  o.Guide.classList.remove('HIDDEN');
  pushOverlayState('guide');
};
window.hideGuide = () => {
  if (!bGuideOpened) return; 
  bGuideOpened = false;
  if (o.Guide) o.Guide.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  popOverlayState();
  
  if (o.PlayerContainer) o.PlayerContainer.focus();
};

function renderGuideContent() {
  if (!o.GuideContent) return;
  o.GuideContent.innerHTML = `
    <h2>Controls (TV Remote)</h2>
    <ul style="list-style: none; padding: 0; font-size: clamp(16px, 2.5vw, 22px); line-height: 1.8;">
      <li><kbd>←</kbd> - Open Channel List</li>
      <li><kbd>←</kbd> (in list) - Open Group List</li>
      <li><kbd>→</kbd> - Open Channel Settings</li>
      <li><kbd>OK</kbd>/<kbd>Enter</kbd> - Show Info / Select</li>
      <li><kbd>↑</kbd>/<kbd>↓</kbd> - Change channel</li>
      <li><kbd>ESC</kbd> - Go Back / Close Panel</li>
    </ul>
    <h2>Controls (Mobile)</h2>
     <ul style="list-style: none; padding: 0; font-size: clamp(16px, 2.5vw, 22px); line-height: 1.8;">
      <li><b>Swipe Left-to-Right</b> - Open Nav / Open Groups</li>
      <li><b>Swipe Right-to-Left</b> - Open Settings / Close Nav</li>
      <li><b>Swipe Up/Down</b> - Change channel</li>
      <li><b>Single Tap</b> - Close Panel / Show Info</li>
    </ul>
  `;
}

/* -------------------------
    EPG
    ------------------------- */
function showEpg() {
  if (!o.EpgOverlay || !o.EpgChannels || !o.EpgTimeline) return;
  if (preventRapidToggle()) return;
  clearUi('epg');

  aEpgFilteredChannelKeys = [...aFilteredChannelKeys];
  
  if (aEpgFilteredChannelKeys.length === 0) {
      aEpgFilteredChannelKeys = Object.keys(channels)
          .sort((a, b) => (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));
  }

  const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
  iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
  
  if (iEpgChannelIndex === -1) {
    const currentChannelData = channels[currentKey];
    if (currentChannelData) {
        iEpgChannelIndex = aEpgFilteredChannelKeys.findIndex(key => channels[key]?.number === currentChannelData.number);
    }
    if (iEpgChannelIndex === -1) iEpgChannelIndex = 0;
  }

  renderEpg();
  bEpgOpened = true;
  o.EpgOverlay.classList.remove('HIDDEN');
  pushOverlayState('epg');
}
function hideEpg() {
    if (!bEpgOpened) return; 
    bEpgOpened = false;
    if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN');
    popOverlayState();
    
    if (o.PlayerContainer) o.PlayerContainer.focus();
}

function renderEpg() {
  if (!o.EpgChannels || !o.EpgTimeline) return;

  let channelsHtml = '';
  aEpgFilteredChannelKeys.forEach((key, index) => {
    const ch = channels[key];
    if (!ch) return;
    const selectedClass = index === iEpgChannelIndex ? 'selected' : '';
    const safeName = (ch.name || 'Unknown').replace(/</g, '&lt;');
    channelsHtml += `<div class="epg-ch-item ${selectedClass}">${ch.number || '?'}. ${safeName}</div>`;
  });
  o.EpgChannels.innerHTML = channelsHtml;
  o.EpgTimeline.innerHTML = generateDummyEpg();

  try {
      const selectedItem = o.EpgChannels.querySelector('.selected');
      if (selectedItem && typeof selectedItem.scrollIntoView === 'function') {
          selectedItem.scrollIntoView({ behavior:'smooth', block:'center' });
      }
  } catch (error) { console.error("Error scrolling EPG channel:", error); }
}

function generateDummyEpg() {
  return `
    <div class="epg-pr-item"><div class="epg-pr-time">Now Playing</div><div class="epg-pr-title">Current Program Title (Placeholder)</div></div>
    <div class="epg-pr-item"><div class="epg-pr-time">Up Next</div><div class="epg-pr-title">Next Program Title (Placeholder)</div></div>
    <div class="epg-pr-item"><div class="epg-pr-time">Later</div><div class="epg-pr-title">Future Program Title (Placeholder)</div></div>
  `;
}

/* -------------------------
    Channel name display
    ------------------------- */
function showChannelName() {
  clearTimeout(channelNameTimeout);
  if (!o.ChannelInfo || !o.ChannelInfoName || !o.ChannelInfoEpg || !o.ChannelInfoLogo) return;
  if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const chKey = aFilteredChannelKeys[iActiveChannelIndex];
  const ch = channels[chKey];
  if (!ch) return;

  o.ChannelInfoName.textContent = ch.name || 'Unknown Channel';
  o.ChannelInfoEpg.textContent = 'EPG not available';
  o.ChannelInfoLogo.innerHTML = ch.logo ? `<img src="${ch.logo}" alt="${ch.name || 'logo'}" style="max-height:80px; max-width:80px;" onerror="this.style.display='none'">` : '';

  o.ChannelInfo.classList.add('visible');
  channelNameTimeout = setTimeout(hideChannelName, 5000);
}
function hideChannelName() {
    if (o.ChannelInfo) o.ChannelInfo.classList.remove('visible');
}

/* -------------------------
    Favorites storage
    ------------------------- */
function loadFavoritesFromStorage() {
  try {
    const favs = JSON.parse(localStorage.getItem("iptvFavoriteChannels") || "[]");
    if (Array.isArray(favs)) {
        Object.keys(channels).forEach(key => {
            if (channels[key]) { channels[key].favorite = favs.includes(key); }
        });
    } else { console.warn("Favorites data from localStorage is not an array."); }
  } catch(e) { console.error("Error loading favorites:", e); }
}

function saveFavoritesToStorage() {
  try {
    const favs = Object.entries(channels)
                         .filter(([,ch]) => ch && ch.favorite)
                         .map(([key]) => key);
    localStorage.setItem("iptvFavoriteChannels", JSON.stringify(favs));
    console.log("Saved Favorites:", favs);
  } catch(e) { console.error("Error saving favorites:", e); }
}

/* -------------------------
    First Play handling
    ------------------------- */
function handleFirstPlay() {
  if (isSessionActive) return;
  isSessionActive = true;

  hideIdleAnimation();

  if(aFilteredChannelKeys.length > 0 && iChannelListIndex >= 0 && iChannelListIndex < aFilteredChannelKeys.length){
      /* [FIX #6] Pass isFirstPlay option to prevent black flash */
      iActiveChannelIndex = iChannelListIndex; // Sync active index on first play
      loadChannel(iActiveChannelIndex, { isFirstPlay: true });
  } else {
      console.error("No valid channel selected on first play.");
      showIdleAnimation(true);
      isSessionActive = false;
      return;
  }
}

/* -------------------------
    Settings selection helpers
    ------------------------- */
function updateSettingsSelection(container, index) {
  if (!container || typeof container.querySelector !== 'function') return;
  try {
      const currentSelected = container.querySelector('.selected');
      if (currentSelected) currentSelected.classList.remove('selected');

      const items = qsa('.settings-item', container);
      if (items && index >= 0 && index < items.length) {
        const item = items[index];
        if (item) {
            item.classList.add('selected');
            if (typeof item.scrollIntoView === 'function') {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
      } else { console.warn("Invalid index or no items for settings selection:", index); }
  } catch (error) { console.error("Error updating settings selection:", error); }
}

function updateSettingsModalSelection() {
    if (!o.SettingsModalContent) return;
    try {
        const currentSelected = o.SettingsModalContent.querySelector('.selected');
        if (currentSelected) currentSelected.classList.remove('selected');

        const items = qsa('.modal-selectable', o.SettingsModalContent);
        if (items && iSettingsModalIndex >= 0 && iSettingsModalIndex < items.length) {
            const item = items[iSettingsModalIndex];
            if (item) {
                item.classList.add('selected');
                if (typeof item.scrollIntoView === 'function') {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else {
            console.warn("Invalid index or no items for modal selection:", iSettingsModalIndex);
        }
    } catch (error) {
        console.error("Error updating settings modal selection:", error);
    }
}

/* Fullscreen toggle (keeps original multi-browser support) */
function toggleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.error(`Error enabling full-screen: ${err.message} (${err.name})`));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else {
            console.warn("Fullscreen API not supported.");
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.error(`Error disabling full-screen: ${err.message} (${err.name})`));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/* -------------------------
    Key handling for remotes / keyboard
    ------------------------- */
document.addEventListener('keydown', (e) => {
  // If search field focused — handle special keys
  /* --- FIX: ADDED 'Enter' KEY SUPPORT --- */
  if (document.activeElement === o.SearchField) {
      if (e.key === 'ArrowDown' && bNavOpened && !bGroupsOpened) {
          e.preventDefault();
          iChannelListIndex = 0;
          o.SearchField.blur();
          updateSelectedChannelInNav();
      } else if (e.key === 'Escape') {
          e.preventDefault();
          o.SearchField.blur();
          iChannelListIndex = iActiveChannelIndex; // Revert to active channel
          updateSelectedChannelInNav();
      } else if (e.key === 'Enter') {
          e.preventDefault();
          o.SearchField.blur();
          iChannelListIndex = (aFilteredChannelKeys.length > 0) ? 0 : -1;
          updateSelectedChannelInNav();
      }
      return;
  }
  /* --- END FIX --- */

  if (bGuideOpened) {
      e.preventDefault();
      if (e.key === 'Escape') window.hideGuide();
      return;
  }

  if (bSettingsModalOpened) {
      e.preventDefault();
      const items = o.SettingsModalContent ? qsa('.modal-selectable', o.SettingsModalContent) : [];
      if (!items || items.length === 0) {
          if (e.key === 'Escape') window.hideSettingsModal();
          return;
      }

      if (e.key === 'ArrowUp') {
          iSettingsModalIndex = Math.max(0, iSettingsModalIndex - 1);
          updateSettingsModalSelection();
      } else if (e.key === 'ArrowDown') {
          iSettingsModalIndex = Math.min(items.length - 1, iSettingsModalIndex + 1);
          updateSettingsModalSelection();
      } else if (e.key === 'Enter') {
          const selectedItem = items[iSettingsModalIndex];
          if (selectedItem) {
              if (selectedItem.tagName === 'LI' && selectedItem.hasAttribute('data-value')) {
                  const type = o.SettingsModalContent.querySelector('input[name="quality"]') ? 'quality' : (o.SettingsModalContent.querySelector('input[name="format"]') ? 'format' : 'other');
                  if (type === 'quality') {
                      window.applyQualityAndClose(selectedItem.dataset.value);
                  } else if (type === 'format') {
                      window.applyFormatAndClose(selectedItem.dataset.value);
                  } else {
                      if (typeof selectedItem.click === 'function') selectedItem.click();
                  }
              } else if (typeof selectedItem.click === 'function') {
                  selectedItem.click();
              }
          }
      } else if (e.key === 'Escape') {
          const closeButton = Array.from(items).find(btn => btn.tagName === 'BUTTON' && (btn.textContent.toUpperCase() === 'CANCEL' || btn.textContent.toUpperCase() === 'CLOSE'));
          if (closeButton) closeButton.click();
          else window.hideSettingsModal();
      }
      return;
  }

  if (bEpgOpened) {
    e.preventDefault();
    const EPG_KEYS = ['Escape', 'ArrowUp', 'ArrowDown', 'Enter'];
    if (!EPG_KEYS.includes(e.key)) return;
    if (e.key === 'Escape') hideEpg();
    else if (e.key === 'ArrowUp') { iEpgChannelIndex = Math.max(0, iEpgChannelIndex - 1); renderEpg(); }
    else if (e.key === 'ArrowDown') { iEpgChannelIndex = Math.min(aEpgFilteredChannelKeys.length - 1, iEpgChannelIndex + 1); renderEpg(); }
    else if (e.key === 'Enter') { /* no-op */ }
    return;
  }

  /* [KEPT] User's original keyboard logic */
  if (bNavOpened) {
    e.preventDefault();
    if (bGroupsOpened) { // Group List
      const groupItems = o.GroupList ? qsa('li', o.GroupList) : []; // Use original query
      const GROUP_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape'];
      if (!GROUP_LIST_KEYS.includes(e.key)) return;
      if (e.key === 'ArrowUp') iGroupListIndex = Math.max(0, iGroupListIndex - 1);
      else if (e.key === 'ArrowDown') iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
      else if (e.key === 'Enter') groupItems[iGroupListIndex]?.click(); 
      else if (e.key === 'ArrowRight' || e.key === 'Escape') hideGroups(); 
      updateSelectedGroupInNav();
    } else { // Channel List
      const CHANNEL_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
       if (!CHANNEL_LIST_KEYS.includes(e.key)) return;
      if (e.key === 'ArrowUp') {
          if (iChannelListIndex === 0 && o.SearchField) {
              o.SearchField.focus();
              const currentSelected = o.ChannelList.querySelector('.selected');
              if (currentSelected) currentSelected.classList.remove('selected');
              iChannelListIndex = -1;
          } else if (iChannelListIndex > 0) {
              iChannelListIndex = (iChannelListIndex - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
              updateSelectedChannelInNav();
          }
      } else if (e.key === 'ArrowDown') {
          if (iChannelListIndex === -1 && aFilteredChannelKeys.length > 0) {
              iChannelListIndex = 0;
              updateSelectedChannelInNav();
              o.SearchField.blur();
          } else if (aFilteredChannelKeys.length > 0 && iChannelListIndex !== -1) {
              iChannelListIndex = (iChannelListIndex + 1) % aFilteredChannelKeys.length;
              updateSelectedChannelInNav();
          }
      }
      else if (e.key === 'Enter') { 
          if (iChannelListIndex !== -1 && aFilteredChannelKeys.length > 0) {
              loadChannel(iChannelListIndex); 
              hideNav(); 
          }
      }
      else if (e.key === 'ArrowRight' || e.key === 'Escape') {
          hideNav(); 
          if (iChannelListIndex === -1 && o.SearchField) o.SearchField.blur();
      }
      else if (e.key === 'ArrowLeft') { // User's preferred logic
          if (iChannelListIndex !== -1) showGroups(); 
      }
      // Only update nav selection if we didn't just focus the search bar
      if (iChannelListIndex !== -1) {
          updateSelectedChannelInNav();
      }
    }
    return; 
  }
  /* --- END --- */

  if (bChannelSettingsOpened) {
    e.preventDefault();
    const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
    const SETTINGS_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
    if (!SETTINGS_KEYS.includes(e.key)) return;
    if (isSubmenu) {
        const submenuItems = qsa('.settings-item', o.SettingsVideoFormatMenu) ?? [];
        if (e.key === 'ArrowUp') iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
        else if (e.key === 'Enter') submenuItems[iVideoSettingsIndex]?.click();
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
            if (iVideoSettingsIndex === 0 && (e.key === 'ArrowLeft' || e.key === 'Escape')) submenuItems[0]?.click(); // Back button
            else hideVideoFormatMenu();
        }
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else {
        const mainItems = qsa('.settings-item', o.SettingsMainMenu) ?? [];
        if (e.key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
        else if (e.key === 'Enter') mainItems[iChannelSettingsIndex]?.click();
        else if (e.key === 'ArrowRight') {
            const selectedItem = mainItems[iChannelSettingsIndex];
            if (selectedItem && iChannelSettingsIndex === 1) selectedItem.click(); // Open submenu on right
        } else if (e.key === 'ArrowLeft' || e.key === 'Escape') hideChannelSettings();
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return;
  }

  // default player keys
  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
  if (!PLAYER_KEYS.includes(e.key)) return;

  e.preventDefault();
  switch (e.key) {
    case 'ArrowLeft': showNav(); break;
    case 'ArrowRight': showChannelSettings(); break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iActiveChannelIndex - 1); break;
    case 'ArrowDown': loadChannel(iActiveChannelIndex + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': clearUi(); break;
  }
});

/* -------------------------
    Stream info overlay
    ------------------------- */
function updateStreamInfo() {
  const infoOverlay = o.StreamInfoOverlay;
  if (!infoOverlay) return;
  if (!player) return;

  try {
    const variant = (player.getVariantTracks() || []).find(t => t.active);
    if (!variant) {
      infoOverlay.innerHTML = 'Stream Info: N/A';
      return;
    }
    const codecs = variant.codecs || 'N/A';
    const resolution = `${variant.width}x${variant.height}`;
    const bandwidth = (variant.bandwidth / 1000000).toFixed(2);
    infoOverlay.innerHTML = `Codecs:     ${codecs}\nResolution: ${resolution}\nBandwidth:  ${bandwidth} Mbit/s`;
  } catch (error) {
    console.warn("Could not get stream info:", error);
    infoOverlay.innerHTML = 'Stream Info: Error';
  }
}

/* -------------------------
    Init on DOMContentLoaded
    ------------------------- */
document.addEventListener('DOMContentLoaded', initPlayer);

