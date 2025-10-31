// script.js — Refactored + merged + fixes
// GPT-5 Thinking mini — merged & cleaned version for Shakzz TV player

/* -------------------------
   Globals & state
   ------------------------- */
let player = null;
let ui = null;
const o = {}; // DOM refs will be populated in initPlayer()

let channels = {
  // (keep your existing channels object — shortened example entries)
  KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
  SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
  // ... keep the rest of your channels object unchanged ...
};

let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iChannelListIndex = 0;
let iActiveChannelIndex = 0;
let iGroupListIndex = 1;
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
let channelNameTimeout = null;
let tempMessageTimeout = null;

// History overlay tracking (prevents mobile back from closing app)
let lastPushedOverlay = null;

// Guard map to prevent rapid duplicate UI toggles (double-click bug fix)
const toggleGuards = {};
function guard(key, ms = 350) {
  const now = Date.now();
  if (toggleGuards[key] && (now - toggleGuards[key]) < ms) return false;
  toggleGuards[key] = now;
  return true;
}

/* -------------------------
   Helpers
   ------------------------- */
const getEl = id => document.getElementById(id);

// Safe innerHTML setter — prevents blank panels if value is falsy & keeps rendering atomic
function safeInnerHTML(el, html) {
  if (!el || typeof el.innerHTML === 'undefined') return;
  // avoid setting empty strings which can cause blank panels during rapid toggles
  if (html == null || html === '') return;
  el.innerHTML = html;
}

// Push overlay state — used when opening overlay panels so back button closes them first
function pushOverlayState(overlayName) {
  try {
    if (!overlayName) return;
    // push only if not already pushed
    const state = history.state || {};
    if (state && state.overlay === overlayName) return;
    history.pushState({ overlay: overlayName }, '');
    lastPushedOverlay = overlayName;
  } catch (e) { /* ignore */ }
}

// Pop overlay state if it was the last pushed one
function popOverlayStateIfMatches(overlayName) {
  try {
    const state = history.state || {};
    if (state && state.overlay === overlayName) {
      // go back one step (this triggers popstate)
      history.back();
    } else {
      lastPushedOverlay = null;
    }
  } catch (e) {}
}

// Centralized show/hide for loader and idle animation
function showLoadingOverlay(message = 'Loading Channel...') {
  if (!o.ChannelLoader) return;
  if (o.ChannelLoader.classList.contains('HIDDEN')) {
    o.ChannelLoader.classList.remove('HIDDEN');
    // Ensure it's visible (no immediate fade)
    o.ChannelLoader.classList.remove('fade-out');
  }
  // update loading text if present
  const txt = o.ChannelLoader.querySelector('.loading-text');
  if (txt) txt.textContent = message;
  // make video invisible/transparent to avoid black flash
  if (o.AvPlayer) o.AvPlayer.style.opacity = '0';
  // ensure StreamInfo hides while loading
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.add('HIDDEN');
}

function hideLoadingOverlay() {
  clearTimeout(loaderFadeTimeout);
  if (!o.ChannelLoader) return;
  // fade out then hide for smoothness
  o.ChannelLoader.classList.add('fade-out');
  loaderFadeTimeout = setTimeout(() => {
    if (o.ChannelLoader) {
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.classList.remove('fade-out');
    }
  }, 450);
  if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  // restore StreamInfo
  if (o.StreamInfoOverlay && bChannelSettingsOpened) o.StreamInfoOverlay.classList.remove('HIDDEN');
}

/* -------------------------
   DOM init & event wiring
   ------------------------- */
async function initPlayer() {
  // populate DOM refs (safe — script is included at end of body)
  Object.assign(o, {
    PlayerContainer: getEl('playerContainer'),
    AvPlayer: getEl('avplayer'),
    Nav: getEl('nav'),
    GroupList: getEl('GroupList'),
    DynamicGroupsList: getEl('DynamicGroupsList'),
    ListContainer: getEl('list_container'),
    ChannelList: getEl('ChannelList'),
    ChannelLoader: getEl('ChannelLoader'),
    IdleAnimation: getEl('IdleAnimation'),
    PlayButton: getEl('PlayButton'),
    BlurOverlay: getEl('BlurOverlay'),
    ChannelInfo: getEl('ChannelInfo'),
    SettingsMainMenu: getEl('SettingsMainMenu'),
    SettingsVideoFormatMenu: getEl('SettingsVideoFormatMenu'),
    SettingsContainer: getEl('settings_container'),
    ChannelSettings: getEl('ChannelSettings'),
    StreamInfoOverlay: getEl('StreamInfoOverlay'),
    Guide: getEl('Guide'),
    GuideContent: getEl('GuideContent'),
    EpgOverlay: getEl('EpgOverlay'),
    EpgChannels: getEl('EpgChannels'),
    EpgTimeline: getEl('EpgTimeline'),
    SettingsModal: getEl('SettingsModal'),
    SettingsModalContent: getEl('SettingsModalContent'),
    SearchField: getEl('SearchField'),
    ChannelInfoName: getEl('channel_name'),
    ChannelInfoEpg: getEl('channel_epg'),
    ChannelInfoLogo: getEl('ch_logo'),
    TempMessageOverlay: getEl('TempMessageOverlay')
  });

  // initialize channel numeric fields
  Object.keys(channels).forEach((key, i) => {
    channels[key].number = i + 1;
    channels[key].key = key;
  });

  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav();
  sSelectedGroup = '__all';

  // set initial group index more robustly
  if (o.GroupList) {
    const allGroupLiItems = o.GroupList.querySelectorAll('li');
    const initialGroupItem = Array.from(allGroupLiItems).find(li => li.dataset && li.dataset.group === '__all');
    if (initialGroupItem) {
      iGroupListIndex = Array.from(allGroupLiItems).indexOf(initialGroupItem);
    } else {
      iGroupListIndex = Math.max(1, Math.min(Array.from(allGroupLiItems).length - 1, iGroupListIndex));
    }
  }

  buildNav();
  updateSelectedGroupInNav();

  // Shaka initialization
  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) {
    console.error("Shaka Player not supported on this browser.");
    return;
  }

  player = new shaka.Player();
  ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);

  ui.configure({
    controlPanelElements: [],
    addSeekBar: false,
    addBigPlayButton: false,
    showBuffering: false, // we'll show our custom loader
    clickToPlay: false
  });

  player.attach(o.AvPlayer);

  player.configure({
    abr: { defaultBandwidthEstimate: 500000 },
    streaming: { rebufferingGoal: 2, bufferingGoal: 3 }
  });

  // Shaka events
  player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    const isNetworkOrMediaError =
      e.detail.category === shaka.util.Error.Category.NETWORK ||
      e.detail.category === shaka.util.Error.Category.MEDIA ||
      e.detail.category === shaka.util.Error.Category.STREAMING;

    // On other errors show idle animation
    if (!isNetworkOrMediaError) {
      showIdleAnimation(true);
    }
    hideLoadingOverlay();
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  });

  // track changes -> re-render channel settings
  player.addEventListener('trackschanged', renderChannelSettings);
  player.addEventListener('buffering', handleBuffering);
  player.addEventListener('playing', handlePlaying);

  // updates for stream info occasionally
  player.addEventListener('adaptation', updateStreamInfo);
  player.addEventListener('streaming', updateStreamInfo);

  // Event wiring (moved here so DOM refs exist)
  setupControls();
  setupEventListeners();

  // show idle UI until play
  showIdleAnimation(true);
  loadInitialChannel();
}

/* -------------------------
   Buffering & playing handlers
   ------------------------- */
function handleBuffering(evt) {
  // evt.buffering: true when buffering start, false when end
  if (evt && evt.buffering) {
    // Show the custom loader with anime background
    showLoadingOverlay('Buffering...');
    // also show the IdleAnimation background behind loader to maintain visuals
    if (o.IdleAnimation) o.IdleAnimation.classList.add('visible'); 
  } else {
    // Buffering ended
    hideLoadingOverlay();
    if (o.IdleAnimation && !isSessionActive) {
      // keep IdleAnimation visible if session not active (idle)
      o.IdleAnimation.classList.remove('visible');
    } else {
      if (o.IdleAnimation) o.IdleAnimation.classList.remove('visible');
    }
  }
}

function handlePlaying() {
  hideLoadingOverlay();
  // Hide idle animation when playback starts
  if (o.IdleAnimation) o.IdleAnimation.classList.remove('visible');
}

/* -------------------------
   Controls setup (touch / clicks / remote)
   ------------------------- */
function setupControls() {
  const playerContainer = o.PlayerContainer;
  if (!playerContainer) return;

  // Touch gestures: swipe, tap, double-tap
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

    // Ignore gestures when interacting with overlays
    const targetElement = document.elementFromPoint(touchStartX, touchStartY);
    if (targetElement && (targetElement.closest('#nav') || targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay'))) {
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const SWIPE_THRESHOLD = 50;
    const TAP_THRESHOLD = 15;

    // Swipe
    if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
      handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY);
      lastTapTime = 0;
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }

    // Tap / double-tap
    if (absDeltaX < TAP_THRESHOLD && absDeltaY < TAP_THRESHOLD) {
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) { // double tap
        handleDoubleTapAction();
        lastTapTime = 0;
      } else {
        // single tap — handled by click handler below after a tiny delay
        lastTapTime = currentTime;
      }
    }

    touchStartX = touchStartY = touchEndX = touchEndY = 0;
  }, { passive: false });

  // click handler (handles single tap)
  playerContainer.addEventListener('click', e => {
    // ignore clicks on UI elements which should handle their own events
    if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay'))) return;

    const currentTime = Date.now();
    const isDouble = (currentTime - lastTapTime) < 350;

    if (isDouble) {
      handleDoubleTapAction();
      lastTapTime = 0;
    } else {
      handleSingleTapAction();
      lastTapTime = currentTime;
    }
  });

  // disable native dblclick default behavior that may cause unexpected UI changes
  playerContainer.addEventListener('dblclick', e => {
    e.preventDefault();
    handleDoubleTapAction();
  });
}

function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
  const isHorizontal = absDeltaX > absDeltaY;

  // Close modals first on any swipe (fix: EPG/Guide closing directly)
  if (bGuideOpened) { hideGuide(); return; }
  if (bEpgOpened) { hideEpg(); return; }
  if (bSettingsModalOpened) { window.hideSettingsModal(); return; }

  if (isHorizontal) {
    if (deltaX > 0) { // swipe right = left-to-right
      if (bChannelSettingsOpened) {
        hideChannelSettings();
      } else if (bNavOpened && !bGroupsOpened) {
        showGroups();
      } else if (!bNavOpened) {
        showNav();
      }
    } else { // swipe left
      if (bGroupsOpened) {
        hideGroups();
      } else if (bNavOpened) {
        hideNav();
      } else if (!bChannelSettingsOpened) {
        showChannelSettings();
      }
    }
  } else {
    // vertical swipe changes channel when no panel open
    if (!bNavOpened && !bChannelSettingsOpened && !bGuideOpened && !bEpgOpened && !bSettingsModalOpened) {
      if (deltaY > 0) loadChannel(iActiveChannelIndex + 1);
      else loadChannel(iActiveChannelIndex - 1);
    }
  }
}

function handleSingleTapAction() {
  if (!isSessionActive) return;
  if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
    clearUi();
  } else {
    showChannelName();
  }
}

function handleDoubleTapAction() {
  toggleFullScreen();
}

/* -------------------------
   Event listeners (keyboard/remote/back button)
   ------------------------- */
function setupEventListeners() {
  // Play button
  if (o.PlayButton) {
    o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
  }

  // Search field
  if (o.SearchField) {
    o.SearchField.removeEventListener('input', onSearchInput);
    o.SearchField.addEventListener('input', onSearchInput);
  }

  // group click wiring is done in buildDynamicGroupNav()

  // One keydown listener for TV remotes / keyboards
  document.removeEventListener('keydown', globalKeyHandler);
  document.addEventListener('keydown', globalKeyHandler);

  // popstate -> intercept back button to close overlays first
  window.removeEventListener('popstate', onPopState);
  window.addEventListener('popstate', onPopState);

  // ensure we have only one resize handler if needed (not used heavily here)
}

// Search input handler extracted
function onSearchInput() {
  buildNav();
  if (aFilteredChannelKeys.length > 0) {
    iChannelListIndex = 0;
    if (isSessionActive) { loadChannel(0); }
    updateSelectedChannelInNav();
  } else {
    try { player?.unload(); } catch (e) {}
    showIdleAnimation(true);
  }
}

// Popstate handling: close overlays instead of leaving page
function onPopState(e) {
  const state = e.state || {};
  if (!state || !state.overlay) {
    // No overlay state — let default behaviour happen (may be initial load)
    // If user pressed back and there is no overlay currently, we should keep default (exit)
    // But only exit if no overlay is open
    if (bEpgOpened || bGuideOpened || bSettingsModalOpened || bChannelSettingsOpened || bNavOpened) {
      // If overlays open but state doesn't indicate overlay, close overlays gracefully
      clearUi();
      lastPushedOverlay = null;
      // prevent navigating away by pushing a new state to maintain consistent back behavior
      try { history.replaceState(null, ''); } catch (e) {}
    }
    return;
  }

  // If overlay state exists, close that overlay
  if (state.overlay === 'epg' && bEpgOpened) hideEpg();
  else if (state.overlay === 'guide' && bGuideOpened) hideGuide();
  else if (state.overlay === 'settingsModal' && bSettingsModalOpened) window.hideSettingsModal();
  else if (state.overlay === 'channelSettings' && bChannelSettingsOpened) hideChannelSettings();
  else if (state.overlay === 'nav' && bNavOpened) hideNav();

  lastPushedOverlay = null;
}

/* -------------------------
   Navigation UI builders
   ------------------------- */
function setupMainMenuControls() {
  const guideBtn = getEl('guide_button');
  const epgBtn = getEl('epg_button');
  if (guideBtn) guideBtn.onclick = () => { showGuide(); pushOverlayState('guide'); };
  else console.warn("guide_button not found.");
  if (epgBtn) epgBtn.onclick = () => { showEpg(); pushOverlayState('epg'); };
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

  // build nodes dynamically (avoid innerHTML resets on GroupList root)
  o.DynamicGroupsList.innerHTML = '';

  const makeLi = (text, dataset) => {
    const li = document.createElement('li');
    if (dataset) Object.keys(dataset).forEach(k => li.dataset[k] = dataset[k]);
    li.textContent = text;
    return li;
  };

  const favLi = makeLi('FAVORITES', { group: '__fav' });
  const allLi = makeLi('ALL CHANNELS', { group: '__all' });

  o.DynamicGroupsList.appendChild(favLi);
  o.DynamicGroupsList.appendChild(allLi);

  sortedGroups.forEach(name => {
    const safeName = (name || 'Unnamed Group');
    const dynamicLi = makeLi(safeName.toUpperCase(), { group: safeName });
    o.DynamicGroupsList.appendChild(dynamicLi);
  });

  // wire onclick for all group list items (within GroupList area)
  const fullGroupListItems = o.GroupList.querySelectorAll('li');
  fullGroupListItems.forEach((li, index) => {
    li.onclick = () => {
      // Find index inside group list
      const list = Array.from(o.GroupList.querySelectorAll('li'));
      const idx = list.indexOf(li);
      selectGroup(idx);
    };
  });
}

function selectGroup(index) {
  if (!o.GroupList || !o.ListContainer) {
    console.error("GroupList or ListContainer not found.");
    return;
  }

  const groupItems = o.GroupList.querySelectorAll('li');
  if (index < 0 || index >= groupItems.length) {
    console.warn("Invalid index passed to selectGroup:", index);
    return;
  }
  const item = groupItems[index];
  if (!item || !item.dataset || !item.dataset.group) {
    return;
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
  iGroupListIndex = index;
  updateSelectedGroupInNav();

  buildNav();

  if (aFilteredChannelKeys.length > 0) {
    iChannelListIndex = 0;
    updateSelectedChannelInNav();
  }

  // close groups after selection & push/pop state for back handling
  requestAnimationFrame(() => hideGroups());
}

/* -------------------------
   Build channel nav list
   ------------------------- */
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

  // remove children safely
  o.ChannelList.innerHTML = '';
  o.ChannelList.scrollTop = 0;

  if (aFilteredChannelKeys.length === 0) {
    const msg = sSelectedGroup === '__fav'
      ? 'No favorite channels found. Add channels using the settings menu (→).'
      : 'No channels found in this category.';
    safeInnerHTML(o.ChannelList, `<li style="justify-content:center; color:#888; padding:12px; height: auto; line-height: normal; white-space: normal; text-align: center;">${msg}</li>`);
    return;
  }

  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, index) => {
    const ch = channels[key];
    if (!ch) return;

    const item = document.createElement('li');
    item.className = 'channel-item';
    item.dataset.index = index;
    item.onclick = () => {
      // prevent rapid toggles when double-clicking
      if (!guard('channelClick')) return;
      if (isSessionActive) {
        loadChannel(index);
      } else {
        iChannelListIndex = index;
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
  updateSelectedChannelInNav();
}

/* -------------------------
   Selected item update helpers
   ------------------------- */
function updateSelectedChannelInNav() {
  if (!o.ChannelList) return;
  try {
    // remove previous selected & playing classes
    const currentSelected = o.ChannelList.querySelector('.selected');
    if (currentSelected) currentSelected.classList.remove('selected');

    const playing = o.ChannelList.querySelector('.playing');
    if (playing) playing.classList.remove('playing');

    const channelItems = Array.from(o.ChannelList.querySelectorAll('li.channel-item'));

    if (iChannelListIndex >= 0 && iChannelListIndex < channelItems.length) {
      const newItem = channelItems[iChannelListIndex];
      if (newItem) {
        newItem.classList.add('selected');
        // mark the actively playing item (for better highlighting)
        if (iActiveChannelIndex === iChannelListIndex) newItem.classList.add('playing');
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
      iChannelListIndex = 0;
    }
  } catch (error) { console.error("Error updating selected channel in nav:", error); }
}

function updateSelectedGroupInNav() {
  if (!o.GroupList) return;
  try {
    const currentSelected = o.GroupList.querySelector('.selected');
    if (currentSelected) currentSelected.classList.remove('selected');

    const allLis = o.GroupList.querySelectorAll('li');
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
   Settings & Modals (unchanged logic, cleaned)
   ------------------------- */
function renderChannelSettings() {
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0 || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const currentChannelKey = aFilteredChannelKeys[iActiveChannelIndex];
  const currentChannel = channels[currentChannelKey];
  if (!currentChannel) return;

  if (o.SettingsMainMenu) {
    const currentFormat = getAspectRatio();
    safeInnerHTML(o.SettingsMainMenu, `
      <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
      <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
      <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
    `);
    updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
  } else { console.error("SettingsMainMenu element not found"); }
}

function showVideoFormatMenu() {
  if (o.SettingsContainer) {
    o.SettingsContainer.classList.add('submenu-visible');
    iVideoSettingsIndex = 0;
    renderVideoFormatMenu();
  } else { console.error("SettingsContainer element not found."); }
}

function hideVideoFormatMenu() {
  if (o.SettingsContainer) {
    o.SettingsContainer.classList.remove('submenu-visible');
    iChannelSettingsIndex = 1;
    if (o.SettingsMainMenu) updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    else console.error("SettingsMainMenu element not found for focus update.");
  } else { console.error("SettingsContainer element not found."); }
}

function renderVideoFormatMenu() {
  if (o.SettingsVideoFormatMenu) {
    const currentFormat = getAspectRatio();
    safeInnerHTML(o.SettingsVideoFormatMenu, `
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
    `);
    updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
  } else { console.error("SettingsVideoFormatMenu element not found."); }
}

function getAspectRatio() {
  if (!o.AvPlayer) return 'Original';
  const style = o.AvPlayer.style;
  if (style.objectFit === 'fill') return 'Stretch';
  if (style.objectFit === 'cover' && style.transform === 'scale(1.15)') return 'Zoom';
  if (style.objectFit === 'cover') return 'Fill';
  return localStorage.getItem('iptvAspectRatio') || 'Original';
}

function setAspectRatio(format) {
  if (!o.AvPlayer) return;
  o.AvPlayer.style.transform = 'scale(1)';
  let formatName = 'Original';
  switch (format) {
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
  renderVideoFormatMenu();
}

function togglePlaybackControls() {
  hideChannelSettings();
}

function showSettingsModal(type) {
  if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) {
    console.error("Required modal elements not found.");
    return;
  }
  clearUi('settingsModal');
  o.BlurOverlay.classList.add('visible');
  bSettingsModalOpened = true;
  iSettingsModalIndex = 0;
  try {
    o.SettingsModalContent.innerHTML = renderModalContent(type);
  } catch (error) {
    console.error("Error rendering modal content:", error);
    o.SettingsModalContent.innerHTML = '<p>Error loading content.</p>';
  }
  o.SettingsModal.classList.remove('HIDDEN');
  updateSettingsModalSelection();
  pushOverlayState('settingsModal');
}

window.hideSettingsModal = () => {
  bSettingsModalOpened = false;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  // close overlay history
  // If the last pushed overlay is settingsModal, step back
  if (lastPushedOverlay === 'settingsModal') popOverlayStateIfMatches('settingsModal');
};

/* renderModalContent, applyChannelEdit, applyQualityAndClose, applyFormatAndClose,
   setSubtitlesAndClose, setAudioAndClose, toggleFavourite
   — keep the same logic as provided, with safeInnerHTML usage where relevant.
   (I preserved your original implementations but placed them below)
*/

function renderModalContent(type) {
  let contentHtml = '';
  try {
    if (!player) return '<p>Player not initialized.</p>';

    if (type === 'quality') {
      const tracks = [...new Map((player.getVariantTracks() || []).filter(t => t.height).map(t => [t.height, t])).values()].sort((a, b) => b.height - a.height);
      let itemsHtml = `<li class="modal-selectable" data-value="auto" onclick="applyQualityAndClose('auto')">Auto <input type="radio" name="quality" value="auto" ${player.getConfiguration()?.abr?.enabled ? 'checked' : ''}></li>`;
      tracks.forEach(track => {
        const bps = track.bandwidth > 1000000 ? `${(track.bandwidth / 1e6).toFixed(2)} Mbps` : `${Math.round(track.bandwidth / 1e3)} Kbps`;
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
      const audioTracks = player.getAudioLanguagesAndRoles() || [];
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
  console.log("Applying Quality:", selected);
  try {
    if (selected === 'auto') {
      player.configure({ abr: { enabled: true } });
    } else {
      player.configure({ abr: { enabled: false } });
      const trackToSelect = (player.getVariantTracks() || []).find(t => t.id == selected);
      if (trackToSelect) {
        player.selectVariantTrack(trackToSelect, true);
      } else {
        console.warn("Selected quality track not found:", selected);
        player.configure({ abr: { enabled: true } }); // Fallback to auto
      }
    }
  } catch (error) {
    console.error("Error applying quality setting:", error);
    try { player.configure({ abr: { enabled: true } }); } catch { }
  }
  hideSettingsModal();
}

window.applyFormatAndClose = (value) => {
  console.log("Applying Format:", value);
  setAspectRatio(value);
  hideSettingsModal();
}

window.setSubtitlesAndClose = (track, isVisible) => {
  if (!player) return;
  console.log("Applying Subtitles:", track, isVisible);
  try {
    player.setTextTrackVisibility(isVisible);
    if (isVisible && track && typeof track.id !== 'undefined') {
      const trackToSelect = (player.getTextTracks() || []).find(t => t.id === track.id);
      if (trackToSelect) {
        player.selectTextTrack(trackToSelect);
      } else {
        console.warn("Subtitle track not found:", track.id);
      }
    }
  } catch (error) {
    console.error("Error setting subtitles:", error);
  }
  hideSettingsModal();
}

window.setAudioAndClose = (lang) => {
  if (!player) return;
  console.log("Applying Audio:", lang);
  if (typeof lang === 'string' && lang) {
    try {
      player.selectAudioLanguage(lang);
    } catch (error) {
      console.error("Error setting audio language:", error);
    }
  } else {
    console.warn("Invalid audio language provided:", lang);
  }
  hideSettingsModal();
}

function toggleFavourite() {
  if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  if (!channels[key]) return;

  channels[key].favorite = !channels[key].favorite;
  saveFavoritesToStorage();

  if (bChannelSettingsOpened) renderChannelSettings();

  if (bNavOpened && (sSelectedGroup === '__fav' || sSelectedGroup === '__all')) {
    buildNav();
    const newIndex = aFilteredChannelKeys.indexOf(key);
    if (newIndex !== -1) iChannelListIndex = newIndex;
    else if (aFilteredChannelKeys.length > 0) iChannelListIndex = 0;
    else iChannelListIndex = 0;
    updateSelectedChannelInNav();
  }
}

/* -------------------------
   UI helpers (channel name, idle, temp messages)
   ------------------------- */
function showTempMessage(message) {
  if (!o.TempMessageOverlay) return;
  clearTimeout(tempMessageTimeout);
  o.TempMessageOverlay.textContent = message;
  o.TempMessageOverlay.classList.remove('HIDDEN');
  o.TempMessageOverlay.classList.add('visible');

  tempMessageTimeout = setTimeout(() => {
    o.TempMessageOverlay.classList.remove('visible');
    setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 300);
  }, 3000);
}

function showIdleAnimation(showPlayButton = false, useAnimeBackground = true) {
  if (!o.IdleAnimation) return;
  // allow immediate visual change
  o.IdleAnimation.classList.add('visible');
  if (o.PlayButton) {
    if (showPlayButton && !isSessionActive) o.PlayButton.classList.remove('HIDDEN');
    else o.PlayButton.classList.add('HIDDEN');
  }
  // make ChannelLoader background align with IdleAnimation if desired
  if (useAnimeBackground && o.ChannelLoader) {
    // keep same background (user's CSS uses the same image), no change necessary
  }
}

function hideIdleAnimation() {
  if (o.IdleAnimation) o.IdleAnimation.classList.remove('visible');
}

/* clear UI except optional exclude panel */
function clearUi(exclude) {
  if (exclude !== 'nav' && exclude !== 'epg' && exclude !== 'guide') hideNav();
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
}

/* -------------------------
   Panels: Nav / Groups / Settings / ChannelSettings
   ------------------------- */
function showNav() {
  if (!o.Nav) return;
  if (!guard('navToggle')) return; // guard from double toggles
  bNavOpened = true;
  o.Nav.classList.add('visible');
  updateSelectedChannelInNav();
  pushOverlayState('nav');
}

function hideNav() {
  if (!o.Nav) return;
  bNavOpened = false;
  bGroupsOpened = false;
  o.Nav.classList.remove('visible');
  if (o.ListContainer?.classList.contains('groups-opened')) hideGroups();
  if (lastPushedOverlay === 'nav') popOverlayStateIfMatches('nav');
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
  if (o.ListContainer) o.ListContainer.classList.remove('groups-opened');
}

function showChannelSettings() {
  if (!o.ChannelSettings) return;
  if (!guard('chanSettings')) return;
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
  if (!o.ChannelSettings) return;
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.add('HIDDEN');
  bChannelSettingsOpened = false;
  o.ChannelSettings.classList.remove('visible');
  if (lastPushedOverlay === 'channelSettings') popOverlayStateIfMatches('channelSettings');
}

window.showGuide = () => {
  if (!o.Guide || !o.GuideContent || !o.BlurOverlay) return;
  clearUi('guide');
  o.BlurOverlay.classList.add('visible');
  renderGuideContent();
  bGuideOpened = true;
  o.Guide.classList.remove('HIDDEN');
  pushOverlayState('guide');
};

window.hideGuide = () => {
  bGuideOpened = false;
  if (o.Guide) o.Guide.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  if (lastPushedOverlay === 'guide') popOverlayStateIfMatches('guide');
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
  clearUi('epg');

  aEpgFilteredChannelKeys = Object.keys(channels)
    .sort((a, b) => (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));

  const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
  iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
  if (iEpgChannelIndex === -1) {
    const currentChannelData = channels[aEpgFilteredChannelKeys[iActiveChannelIndex]];
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
  bEpgOpened = false;
  if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN');
  if (lastPushedOverlay === 'epg') popOverlayStateIfMatches('epg');
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
        if (channels[key]) channels[key].favorite = favs.includes(key);
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

  if (aFilteredChannelKeys.length > 0 && iChannelListIndex >= 0 && iChannelListIndex < aFilteredChannelKeys.length) {
    loadChannel(iChannelListIndex);
  } else {
    console.error("No valid channel selected on first play.");
    showIdleAnimation(true);
    isSessionActive = false;
    return;
  }
}

/* -------------------------
   Load channel
   ------------------------- */
async function loadInitialChannel() {
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

  if (storedLast && channels[storedLast] && aFilteredChannelKeys.includes(storedLast)) initialChannelKey = storedLast;
  else if (!aFilteredChannelKeys.includes(initialChannelKey)) initialChannelKey = aFilteredChannelKeys[0];

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

  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    console.warn("loadChannel called with no filtered channels available.");
    try { await player?.unload(); } catch {}
    showIdleAnimation(!isSessionActive);
    return;
  }

  // normalize index
  iChannelListIndex = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length;
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

  // Hide video element before loading to avoid black flash
  if (o.AvPlayer) o.AvPlayer.style.opacity = '0';

  // Show loader (with anime background per your CSS)
  showLoadingOverlay('Loading Channel...');
  // Show IdleAnimation background behind loader to unify visuals
  if (o.IdleAnimation) o.IdleAnimation.classList.add('visible');

  hideChannelName();
  updateSelectedChannelInNav();

  try {
    player.configure('drm.clearKeys', {});
    if (channel.type === 'clearkey' && channel.keyId && channel.key) {
      player.configure({ drm: { clearKeys: { [channel.keyId]: channel.key } } });
    }

    // clear networking filters to avoid stale request filters
    player.getNetworkingEngine()?.clearAllRequestFilters();
    if (channel.userAgent) {
      player.getNetworkingEngine()?.registerRequestFilter((type, request) => {
        request.headers['User-Agent'] = channel.userAgent;
      });
    }

    // Autoplay fix — ensure unmuted if session active (some browsers require)
    if (isSessionActive && o.AvPlayer) o.AvPlayer.muted = false;

    await player.load(channel.manifestUri);

    // Mark playing item
    updateSelectedChannelInNav();

    if (isSessionActive) {
      if (o.AvPlayer) o.AvPlayer.play().catch(e => console.warn("Autoplay after load prevented.", e));
      showChannelName();
    }
  } catch (error) {
    console.error(`Error loading channel "${channel?.name}":`, error);
    showIdleAnimation(!isSessionActive);
    hideLoadingOverlay();
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  }
}

/* -------------------------
   Settings selection helper
   ------------------------- */
function updateSettingsSelection(container, index) {
  if (!container || typeof container.querySelector !== 'function') return;
  try {
    const currentSelected = container.querySelector('.selected');
    if (currentSelected) currentSelected.classList.remove('selected');

    const items = container.querySelectorAll('.settings-item');
    if (items && index >= 0 && index < items.length) {
      const item = items[index];
      if (item) {
        item.classList.add('selected');
        if (typeof item.scrollIntoView === 'function') item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else { console.warn("Invalid index or no items for settings selection:", index); }
  } catch (error) { console.error("Error updating settings selection:", error); }
}

function updateSettingsModalSelection() {
  if (!o.SettingsModalContent) return;
  try {
    const currentSelected = o.SettingsModalContent.querySelector('.selected');
    if (currentSelected) currentSelected.classList.remove('selected');

    const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
    if (items && iSettingsModalIndex >= 0 && iSettingsModalIndex < items.length) {
      const item = items[iSettingsModalIndex];
      if (item) {
        item.classList.add('selected');
        if (typeof item.scrollIntoView === 'function') item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      console.warn("Invalid index or no items for modal selection:", iSettingsModalIndex);
    }
  } catch (error) {
    console.error("Error updating settings modal selection:", error);
  }
}

function toggleFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); }
    else if (elem.mozRequestFullScreen) { elem.mozRequestFullScreen(); }
    else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
    else console.warn("Fullscreen API not supported.");
  } else {
    if (document.exitFullscreen) document.exitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
}

/* -------------------------
   Global key handler (remote/keyboard)
   ------------------------- */
function globalKeyHandler(e) {
  // normalize key aliases for TV remotes (some remotes map to Enter, others to 'OK' etc.)
  const key = (e && (e.key || e.code)) ? (e.key || e.code) : null;

  // If input focus is SearchField, handle a few keys locally
  if (document.activeElement === o.SearchField) {
    if (key === 'ArrowDown' && bNavOpened && !bGroupsOpened) {
      e.preventDefault();
      iChannelListIndex = 0;
      if (o.SearchField) o.SearchField.blur();
      updateSelectedChannelInNav();
    } else if (key === 'Escape') {
      e.preventDefault();
      if (o.SearchField) o.SearchField.blur();
      iChannelListIndex = 0;
      updateSelectedChannelInNav();
    }
    return;
  }

  // If Guide is opened
  if (bGuideOpened) {
    e.preventDefault();
    if (key === 'Escape') hideGuide();
    return;
  }

  // Settings modal nav
  if (bSettingsModalOpened) {
    e.preventDefault();
    const items = o.SettingsModalContent.querySelectorAll?.('.modal-selectable') ?? [];
    if (!items || items.length === 0) {
      if (key === 'Escape') window.hideSettingsModal();
      return;
    }
    if (key === 'ArrowUp') { iSettingsModalIndex = Math.max(0, iSettingsModalIndex - 1); updateSettingsModalSelection(); }
    else if (key === 'ArrowDown') { iSettingsModalIndex = Math.min(items.length - 1, iSettingsModalIndex + 1); updateSettingsModalSelection(); }
    else if (key === 'Enter') {
      const selectedItem = items[iSettingsModalIndex];
      if (selectedItem) {
        if (selectedItem.tagName === 'LI' && selectedItem.hasAttribute('data-value')) {
          const type = o.SettingsModalContent.querySelector('input[name="quality"]') ? 'quality' : 'format';
          if (type === 'quality') window.applyQualityAndClose(selectedItem.dataset.value);
          else if (type === 'format') window.applyFormatAndClose(selectedItem.dataset.value);
          else if (typeof selectedItem.click === 'function') selectedItem.click();
        } else if (typeof selectedItem.click === 'function') selectedItem.click();
      }
    } else if (key === 'Escape') {
      const closeButton = Array.from(items).find(btn => btn.tagName === 'BUTTON' && (btn.textContent === 'CANCEL' || btn.textContent === 'CLOSE'));
      if (closeButton) closeButton.click(); else window.hideSettingsModal();
    }
    return;
  }

  // EPG open: navigate channels
  if (bEpgOpened) {
    e.preventDefault();
    const EPG_KEYS = ['Escape', 'ArrowUp', 'ArrowDown', 'Enter'];
    if (!EPG_KEYS.includes(key)) return;
    if (key === 'Escape') hideEpg();
    else if (key === 'ArrowUp') { iEpgChannelIndex = Math.max(0, iEpgChannelIndex - 1); renderEpg(); }
    else if (key === 'ArrowDown') { iEpgChannelIndex = Math.min(aEpgFilteredChannelKeys.length - 1, iEpgChannelIndex + 1); renderEpg(); }
    else if (key === 'Enter') { /* do nothing */ }
    return;
  }

  // Nav open handling
  if (bNavOpened) {
    e.preventDefault();
    if (bGroupsOpened) {
      const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
      const GROUP_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
      if (!GROUP_LIST_KEYS.includes(key)) return;

      if (key === 'ArrowUp') iGroupListIndex = Math.max(0, iGroupListIndex - 1);
      else if (key === 'ArrowDown') iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
      else if (key === 'Enter') groupItems[iGroupListIndex]?.click();
      else if (key === 'ArrowRight') hideGroups();
      else if (key === 'Escape') hideGroups();
      // ArrowLeft intentionally does nothing (last panel)
      updateSelectedGroupInNav();
    } else {
      const CHANNEL_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
      if (!CHANNEL_LIST_KEYS.includes(key)) return;

      if (key === 'ArrowUp') {
        if (iChannelListIndex === 0 && o.SearchField) {
          o.SearchField.focus();
          const currentSelected = o.ChannelList.querySelector('.selected');
          if (currentSelected) currentSelected.classList.remove('selected');
          iChannelListIndex = -1;
        } else if (iChannelListIndex > 0) {
          iChannelListIndex = (iChannelListIndex - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
          updateSelectedChannelInNav();
        }
      } else if (key === 'ArrowDown') {
        if (iChannelListIndex === -1 && aFilteredChannelKeys.length > 0) {
          iChannelListIndex = 0;
          updateSelectedChannelInNav();
          o.SearchField.blur();
        } else if (aFilteredChannelKeys.length > 0 && iChannelListIndex !== -1) {
          iChannelListIndex = (iChannelListIndex + 1) % aFilteredChannelKeys.length;
          updateSelectedChannelInNav();
        }
      } else if (key === 'Enter') {
        if (iChannelListIndex !== -1 && aFilteredChannelKeys.length > 0) {
          loadChannel(iChannelListIndex);
          hideNav();
        }
      } else if (key === 'ArrowRight' || key === 'Escape') {
        hideNav();
        if (iChannelListIndex === -1 && o.SearchField) o.SearchField.blur();
      } else if (key === 'ArrowLeft') {
        if (iChannelListIndex !== -1) showGroups();
      }
    }
    return;
  }

  // Channel settings open
  if (bChannelSettingsOpened) {
    e.preventDefault();
    const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
    const SETTINGS_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
    if (!SETTINGS_KEYS.includes(key)) return;
    if (isSubmenu) {
      const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') ?? [];
      if (key === 'ArrowUp') iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
      else if (key === 'ArrowDown') iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
      else if (key === 'Enter') submenuItems[iVideoSettingsIndex]?.click();
      else if (key === 'ArrowLeft' || key === 'Escape') {
        if (iVideoSettingsIndex === 0 && key === 'ArrowLeft') submenuItems[0]?.click();
        else hideVideoFormatMenu();
      }
      updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else {
      const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
      if (key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
      else if (key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
      else if (key === 'Enter') mainItems[iChannelSettingsIndex]?.click();
      else if (key === 'ArrowRight') {
        const selectedItem = mainItems[iChannelSettingsIndex];
        if (selectedItem && iChannelSettingsIndex === 1) selectedItem.click();
      } else if (key === 'ArrowLeft' || key === 'Escape') hideChannelSettings();
      updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return;
  }

  // Default player key handling (player controls when no overlay open)
  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
  if (!PLAYER_KEYS.includes(key)) return;
  e.preventDefault();
  switch (key) {
    case 'ArrowLeft': showNav(); break;
    case 'ArrowRight': showChannelSettings(); break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iActiveChannelIndex - 1); break;
    case 'ArrowDown': loadChannel(iActiveChannelIndex + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': clearUi(); break;
    default: break;
  }
}

/* -------------------------
   Stream info overlay
   ------------------------- */
function updateStreamInfo() {
  const infoOverlay = o.StreamInfoOverlay;
  if (!infoOverlay) return;
  if (!player) return;

  try {
    const variant = player.getVariantTracks().find(t => t.active);
    if (!variant) {
      infoOverlay.innerHTML = 'Stream Info: N/A';
      return;
    }
    const codecs = variant.codecs || 'N/A';
    const resolution = `${variant.width}x${variant.height}`;
    const bandwidth = (variant.bandwidth / 1000000).toFixed(2);
    infoOverlay.innerHTML = `Codecs:     ${codecs}
Resolution: ${resolution}
Bandwidth:  ${bandwidth} Mbit/s`;
  } catch (error) {
    console.warn("Could not get stream info:", error);
    infoOverlay.innerHTML = 'Stream Info: Error';
  }
}

/* -------------------------
   Start
   ------------------------- */
document.addEventListener('DOMContentLoaded', initPlayer);
