let player = null;
let ui = null;
const o = {
  PlayerContainer: document.getElementById('playerContainer'),
  AvPlayer: document.getElementById('avplayer'),
  Nav: document.getElementById('nav'),
  GroupList: document.getElementById('GroupList'),
  DynamicGroupsList: document.getElementById('DynamicGroupsList'),
  ListContainer: document.getElementById('list_container'),
  ChannelList: document.getElementById('ChannelList'),
  ChannelLoader: document.getElementById('ChannelLoader'),
  IdleAnimation: document.getElementById('IdleAnimation'),
  PlayButton: document.getElementById('PlayButton'),
  BlurOverlay: document.getElementById('BlurOverlay'),
  ChannelInfo: document.getElementById('ChannelInfo'),
  SettingsMainMenu: document.getElementById('SettingsMainMenu'),
  SettingsVideoFormatMenu: document.getElementById('SettingsVideoFormatMenu'),
  SettingsContainer: document.getElementById('settings_container'),
  ChannelSettings: document.getElementById('ChannelSettings'),
  CodecInfo: document.getElementById('CodecInfo'),
  Guide: document.getElementById('Guide'),
  GuideContent: document.getElementById('GuideContent'),
  EpgOverlay: document.getElementById('EpgOverlay'),
  EpgChannels: document.getElementById('EpgChannels'),
  EpgTimeline: document.getElementById('EpgTimeline'),
  SettingsModal: document.getElementById('SettingsModal'),
  SettingsModalContent: document.getElementById('SettingsModalContent'),
  SearchField: document.getElementById('SearchField'),
  ChannelInfoName: document.getElementById('channel_name'),
  ChannelInfoEpg: document.getElementById('channel_epg'),
  ChannelInfoLogo: document.getElementById('ch_logo')
};

let channels = {
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
    StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
    SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
    aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"] },
    sinemanila: { name: "SineManila", type: "hls", manifestUri: "https.live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "https://is5-ssl.mzstatic.com/image/thumb/Purple112/v4/64/72/72/64727284-ad63-33a7-59a6-7975c742c038/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg", group: ["movies", "entertainment"] },
    pbarush: { name: "PBA Rush", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3", key: "95b2f2ffd4e14073620506213b62ac82", logo: "https://static.wikia.nocookie.net/logopedia/images/0/00/PBA_Rush_Logo_2016.png", group: ["entertainment"] },
    animalplanet: { name: "Animal Planet", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", keyId: "436b69f987924fcbbc06d40a69c2799a", key: "c63d5b0d7e52335b61aeba4f6537d54d", logo: "https://i.imgur.com/SkpFpW4.png", group: ["documentary"] },
    discoverychannel: { name: "Discovery Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", keyId: "d9ac48f5131641a789328257e778ad3a", key: "b6e67c37239901980c6e37e0607ceee6", logo: "https://placehold.co/100x100/000/fff?text=Discovery", group: ["documentary"] },
    nickelodeon: { name: "Nickelodeon", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd", keyId: "9ce58f37576b416381b6514a809bfd8b", key: "f0fbb758cdeeaddfa3eae538856b4d72", logo: "https://i.imgur.com/4o5dNZA.png", group: ["cartoons & animations"] },
    nickjr: { name: "Nick Jr", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", keyId: "bab5c11178b646749fbae87962bf5113", key: "0ac679aad3b9d619ac39ad634ec76bc8", logo: "httpscontent://iimgur.com/iIVYdZP.png", group: ["cartoons & animations"] },
    pbo: { name: "PBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f7f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "httpscontent://iimgur.com/550RYpJ.png", group: ["movies", "entertainment"] },
    angrybirds: { name: "Angry Birds", type: "hls", manifestUri: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=547", logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png", group: ["cartoons & animations"] },
    zoomooasia: { name: "Zoo Moo Asia", type: "hls", manifestUri: "https://zoomoo-samsungau.amagi.tv/playlist.m3u8", logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png", group: ["cartoons & animations", "entertainment"] },
    mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUri: "https://example.com/placeholder.m3u8", logo: "https://placehold.co/100x100/000/fff?text=Mr+Bean", group: ["entertainment"] },
    iQIYI: { name: "iQIYI", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/1006/default_ott.mpd", keyId: "placeholder", key: "placeholder", logo: "https://placehold.co/100x100/000/fff?text=iQIYI", group: ["entertainment"] },
    tv5: { name: "TV 5 HD", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", keyId: "2615129ef2c846a9bbd43a641c7303ef", key: "07c7f996b1734ea288641a68e1cfdc4d", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/TV5_logo.svg/1200px-TV5_logo.svg.png", group: ["news", "entertainment"] },
    kapamilya: { name: "Kapamilya Channel HD", type: "clearkey", manifestUri: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd", keyId: "bd17afb5dc9648a39be79ee3634dd4b8", key: "3ecf305d54a7729299b93a3d69c02ea5", logo: "https://placehold.co/100x100/000/fff?text=Kapamilya", group: ["entertainment"] },
};


let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iCurrentChannel = 0; 
let iGroupListIndex = 1; 
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
let iSettingsModalIndex = 0; // Index for modal navigation
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0;
let loaderFadeTimeout = null; 
let tempMessageTimeout = null; 

/* -------------------------
    Utilities
    ------------------------- */
function getEl(id) { return document.getElementById(id); }
function scrollToListItem(oListItem) {
    const oParentBox = oListItem.closest('.custom-scrollbar');
    if (oParentBox) {
        oParentBox.scrollTop = oListItem.offsetTop - oParentBox.offsetHeight * 0.4;
    }
}

/* -------------------------
    Core Player Functions
    ------------------------- */
async function initPlayer() {
  Object.keys(channels).forEach((key, i) => {
    channels[key].number = i + 1;
    channels[key].key = key;
  });

  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav();
  sSelectedGroup = '__all';

  if (o.GroupList) {
      const allGroupLiItems = o.GroupList.querySelectorAll('li');
      const allLi = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
      if (allLi) {
          iGroupListIndex = Array.from(allGroupLiItems).indexOf(allLi);
      } else {
          iGroupListIndex = Array.from(allGroupLiItems).findIndex(li => li.textContent.trim() === 'ALL CHANNELS');
          if (iGroupListIndex === -1) iGroupListIndex = 1; 
      }
  } else {
      iGroupListIndex = 1;
  }

  buildNav();
  updateSelectedGroupInNav();

  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) {
    console.error("Browser not supported");
    return;
  }

  player = new shaka.Player();
  // SHAKA UI CUSTOMIZATION (PIP ONLY)
  ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);
 
  ui.configure({
    controlPanelElements: ['pip'], // ONLY PIP is kept
    overflowMenuButtons: [], // Hide all overflow buttons
    addSeekBar: false,
    addBigPlayButton: false,
    showBuffering: true,
    clickToPlay: false
  });
 
  player.attach(o.AvPlayer);

  player.configure({
    abr: { defaultBandwidthEstimate: 500000 },
    streaming: { rebufferingGoal: 2, bufferingGoal: 3 }
  });

 player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    const isNetworkOrMediaError =
      e.detail.category === shaka.util.Error.Category.NETWORK ||
      e.detail.category === shaka.util.Error.Category.MEDIA ||
      e.detail.category === shaka.util.Error.Category.STREAMING;

    if (!isNetworkOrMediaError) {
      showIdleAnimation(true);
    }
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  });

  player.addEventListener('trackschanged', renderChannelSettings);
  player.addEventListener('buffering', handleBuffering);
  player.addEventListener('playing', handlePlaying);

  player.addEventListener('adaptation', updateStreamInfo);
  player.addEventListener('streaming', updateStreamInfo);

  setupControls();

  // --- PATCH START: Show loader on init ---
  if (o.ChannelLoader) {
    o.ChannelLoader.classList.remove('HIDDEN');
    o.ChannelLoader.classList.remove('fade-out');
    o.ChannelLoader.style.opacity = '1';
  }
  // --- PATCH END ---

  showIdleAnimation(true);
  loadInitialChannel();
}

function handleBuffering(event) {
  clearTimeout(loaderFadeTimeout);
  if (!event.buffering) {
    hideLoaderAndShowVideo();
  }
}

function handlePlaying() {
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
    }, 500); // Match fade-out duration
  }
}

function setupControls() {
  const playerContainer = o.PlayerContainer;

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

    const targetElement = document.elementFromPoint(touchStartX, touchStartY);
    if (targetElement && (targetElement.closest('#nav') || targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay'))) {
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }
   
    if (targetElement && targetElement.closest('#PlayButton')) {
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const SWIPE_THRESHOLD = 50;
    const TAP_THRESHOLD = 15;

    // 1. Check for SWIPE
    if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
      handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY);
      lastTapTime = 0;
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }

    // 2. Check for TAP (Double-Tap Fullscreen Fix)
    if (absDeltaX < TAP_THRESHOLD && absDeltaY < TAP_THRESHOLD) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300) { // Double-tap
        e.preventDefault();
        handleDoubleTapAction();
        lastTapTime = 0;
      } else {
        lastTapTime = currentTime;
      }
    }
   
    touchStartX = touchStartY = touchEndX = touchEndY = 0;
  }, { passive: false });

  playerContainer.addEventListener('click', e => {
    if (e.target && e.target.closest('#PlayButton')) return;
   
    if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay'))) {
      return;
    }

    const currentTime = new Date().getTime();
    const isFromTap = (currentTime - lastTapTime) < 350;

    if (isFromTap) {
      handleSingleTapAction();
    } else {
      if (currentTime - lastTapTime < 300) {
        // Handled by dblclick
      } else {
        handleSingleTapAction();
        lastTapTime = currentTime;
      }
    }
  });

  playerContainer.addEventListener('dblclick', e => {
    e.preventDefault();
    handleDoubleTapAction(); // DOUBLE-TAP/CLICK Fullscreen
  });
}

// --- START: NEW SWIPE LOGIC (Replaces old handleSwipeGesture) ---
function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
  const isHorizontal = absDeltaX > absDeltaY;
 
  if (bGuideOpened || bEpgOpened || bSettingsModalOpened) return;

  if (isHorizontal) {
    if (deltaX > 0) { // Swipe Left-to-Right (Go Back / Drill Out)
      if (bChannelSettingsOpened) {
        hideChannelSettings(); // Close right panel
      } else if (bNavOpened && bGroupsOpened) {
        hideGroups(); // 3. GroupList -> ChannelList
      } else if (bNavOpened && !bGroupsOpened) {
        hideNav(); // 2. ChannelList -> Closed
      } else {
        // 1. Already closed, do nothing on L-R
      }
    } else if (deltaX < 0) { // Swipe Right-to-Left (Drill Down / Open)
      if (bNavOpened && !bGroupsOpened) {
        showGroups(); // 2. ChannelList -> GroupList
      } else if (!bNavOpened && !bChannelSettingsOpened) {
        // 1. Start from closed state
        // Per your request, R-L opens the *Right* panel first
        showChannelSettings();
      } else if (bNavOpened && bGroupsOpened) {
        // 3. Already at deepest level (GroupList), do nothing
      }
    }
  } else { // Vertical Swipe
    // Channel switching (unchanged)
    if (!bNavOpened && !bChannelSettingsOpened) {
      if (deltaY > 0) {
        loadChannel(iCurrentChannel + 1);
      } else {
        loadChannel(iCurrentChannel - 1);
      }
    }
  }
}
// --- END: NEW SWIPE LOGIC ---

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


function loadInitialChannel() {
  const storedLast = localStorage.getItem('iptvLastWatched');
  let initialChannelKey = 'aniplus';
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
  }
  else if (!aFilteredChannelKeys.includes(initialChannelKey)) {
      initialChannelKey = aFilteredChannelKeys[0];
  }

  if (!initialChannelKey || !aFilteredChannelKeys.includes(initialChannelKey)) {
      console.error("Could not determine a valid initial channel from filtered list.");
      return;
  }

  const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
  iCurrentChannel = (initialIndex >= 0 ? initialIndex : 0); 
 
  loadChannel(iCurrentChannel, { isInitialLoad: true });
}


async function loadChannel(index, options = {}) {
  clearTimeout(loaderFadeTimeout);

  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    console.warn("loadChannel called with no filtered channels available.");
    try { await player?.unload(); } catch {}
    showIdleAnimation(true);
    return;
  }

  iCurrentChannel = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length; 
 

  const newChannelKey = aFilteredChannelKeys[iCurrentChannel]; 
  const newChannel = channels[newChannelKey];
  if (!newChannel) {
      console.error(`Invalid channel key or data for index ${iCurrentChannel}: ${newChannelKey}`); 
      showIdleAnimation(true);
      return;
  }

  // --- NEW: Load-on-Click Logic ---
  // If this is the initial load, AND the user hasn't clicked "Play" yet,
  // just set the UI and show the play button, but DO NOT load the stream.
  if (options.isInitialLoad && !isSessionActive) {
      console.log("Initial load: Setting channel but not loading stream.");
      localStorage.setItem('iptvLastWatched', newChannelKey);
      
      if (o.AvPlayer) o.AvPlayer.style.opacity = '0';
      
      if (o.ChannelLoader) { // Ensure loader is hidden
          clearTimeout(loaderFadeTimeout);
          o.ChannelLoader.classList.add('HIDDEN');
          o.ChannelLoader.style.opacity = '1';
          o.ChannelLoader.classList.remove('fade-out');
      }
      
      hideChannelName();
      updateSelectedChannelInNav(); // Update nav selection
      showIdleAnimation(true); // Show play button
      return; // Exit before loading
  }
  // --- End: Load-on-Click Logic ---


  if (!player) {
      console.error("Player not initialized before loading channel.");
      return;
  }

  localStorage.setItem('iptvLastWatched', newChannelKey);

  showTempChannelSwitchMessage(newChannel.logo, newChannel.name, newChannel.number);

  if (o.AvPlayer) o.AvPlayer.style.opacity = '0';

  if (o.ChannelLoader) {
    o.ChannelLoader.classList.remove('fade-out');
    o.ChannelLoader.style.opacity = '1';
    o.ChannelLoader.classList.remove('HIDDEN');
  }

  hideChannelName();
  updateSelectedChannelInNav();

  try {
    player.configure('drm.clearKeys', {});
    if (newChannel.type === 'clearkey' && newChannel.keyId && newChannel.key) {
      player.configure({ drm: { clearKeys: { [newChannel.keyId]: newChannel.key } } });
    }

    player.getNetworkingEngine()?.clearAllRequestFilters();
    if (newChannel.userAgent) {
      player.getNetworkingEngine()?.registerRequestFilter((type, request) => {
        request.headers['User-Agent'] = newChannel.userAgent;
      });
    }

    await player.load(newChannel.manifestUri);

    if (isSessionActive) {
      if (o.AvPlayer) {
          o.AvPlayer.muted = false;
          o.AvPlayer.play().catch(e => console.warn("Autoplay after load prevented.", e));
      }
      showChannelName();
    }
    // Removed 'else if (options.isInitialLoad)' block as it's now handled by the early return
  } catch (error) {
    console.error(`Error loading channel "${newChannel?.name}":`, error);
    showIdleAnimation(true);
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1'; 
  }
}

/* -------------------------
    UI and Navigation
    ------------------------- */
function setupMainMenuControls() {
  const guideBtn = getEl('guide_button');
  const epgBtn = getEl('epg_button');
  const listHeadline = document.querySelector('.list_headline'); 

  if (guideBtn) guideBtn.onclick = window.showGuide;
  else console.warn("guide_button not found.");
  if (epgBtn) epgBtn.onclick = showEpg;
  else console.warn("epg_button not found.");
 
  if (listHeadline) {
      listHeadline.onclick = showGroups; 
  }

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

  const fullGroupListItems = o.GroupList.querySelectorAll('li');

  fullGroupListItems.forEach((li, index) => {
      li.onclick = null;
      if (li.hasAttribute('data-group')) {
          li.onclick = () => selectGroup(index);
      }
      else if (li.id === 'guide_button') {
          li.onclick = window.showGuide;
      } else if (li.id === 'epg_button') {
          li.onclick = showEpg;
      }
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
  if (!item || !item.hasAttribute('data-group')) {
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

  // Define the function to run after transition
  const afterTransition = () => {
    o.ListContainer.removeEventListener('transitionend', afterTransition);
    buildNav(); // Rebuild the channel list based on the new group

    if (aFilteredChannelKeys.length > 0) {
      iCurrentChannel = 0; 
      updateSelectedChannelInNav();
      if (isSessionActive) { hideIdleAnimation(); }
    } else {
      try { player?.unload(); } catch {}
      showIdleAnimation(true);
    }
  };

  o.ListContainer.addEventListener('transitionend', afterTransition, { once: true });
  hideGroups(); // Slide back to channel list
}

function buildNav() {
  if (!o.ChannelList || !o.SearchField) {
      console.error("ChannelList or SearchField element not found.");
      return;
  }

  const searchTerm = o.SearchField.value.toLowerCase();

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

  o.ChannelList.innerHTML = '';
  o.ChannelList.scrollTop = 0;

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
    item.setAttribute('tabindex', '0');
    item.onclick = () => {
      if (isSessionActive) {
        loadChannel(index);
      } else {
        iCurrentChannel = index; 
        updateSelectedChannelInNav();
      }
      setTimeout(hideNav, 50);
    };

    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
   
    // Logo Fix
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


function updateSelectedChannelInNav() {
  if (!o.ChannelList) return;
  try {
      const currentSelected = o.ChannelList.querySelector('.selected');
      if (currentSelected) currentSelected.classList.remove('selected');

      const channelItems = o.ChannelList.querySelectorAll('li.channel-item');

      if (iCurrentChannel >= 0 && iCurrentChannel < channelItems.length) { 
          const newItem = channelItems[iCurrentChannel]; 
          if (newItem) {
            newItem.classList.add('selected');
            if (bNavOpened && typeof newItem.scrollIntoView === 'function') {
                newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
      } else if (aFilteredChannelKeys.length > 0 && channelItems.length > 0) {
          iCurrentChannel = 0; 
          const firstItem = channelItems[0];
          if (firstItem) firstItem.classList.add('selected');
      } else {
        iCurrentChannel = 0; 
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
    Settings & Modals
    ------------------------- */
function renderChannelSettings() {
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return; 
  const currentChannelKey = aFilteredChannelKeys[iCurrentChannel]; 
  const currentChannel = channels[currentChannelKey];
  if (!currentChannel) return;

  if (o.SettingsMainMenu) {
      // --- PATCH START: Updated Settings Menu ---
      o.SettingsMainMenu.innerHTML = `
        <div class="settings-item" onclick="showSettingsModal('subtitles')">🎞 Video Track</div>
        <div class="settings-item" onclick="showSettingsModal('quality')">⚙️ Video Quality</div>
        <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
        <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
        <div class="settings-item" onclick="showSettingsModal('edit')">Edit Channel Info</div>
      `;
      // --- PATCH END ---
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
      if (o.SettingsMainMenu) {
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
      } else { console.error("SettingsMainMenu element not found for focus update."); }
  } else { console.error("SettingsContainer element not found."); }
}

function renderVideoFormatMenu() {
  if (o.SettingsVideoFormatMenu) {
      o.SettingsVideoFormatMenu.innerHTML = `
        <div class="settings-item" onclick="hideVideoFormatMenu()">&#8592; Back</div>
        <div class="settings-item-header">Video Format</div>
        <div class="settings-item">
          <span>Video format</span>
          <select onchange="setAspectRatio(this.value)">
            <option value="original">Original</option>
            <option value="16:9">16:9</option>
            <option value="stretch">Stretch</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
              `;
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
 
  // Force focus and select the first item for keyboard control
  setTimeout(() => updateSettingsModalSelection(), 50); 
}

window.hideSettingsModal = () => {
  bSettingsModalOpened = false;
  iSettingsModalIndex = 0;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
};

function renderModalContent(type) {
  let contentHtml = '';
  try {
      if (!player) return '<p>Player not initialized.</p>';

      if (type === 'quality') {
        const tracks = [...new Map((player.getVariantTracks() || []).filter(t => t.height).map(t => [t.height, t])).values()].sort((a,b)=>b.height-a.height);
        // Added class 'modal-selectable' to LI for keyboard control
        let itemsHtml = `<li class="modal-selectable" data-action="radio" data-key="quality" data-value="auto">Auto <input type="radio" name="quality" value="auto" ${player.getConfiguration()?.abr?.enabled ? 'checked' : ''}></li>`;
        tracks.forEach(track => {
          const bps = track.bandwidth > 1000000 ? `${(track.bandwidth/1e6).toFixed(2)} Mbps` : `${Math.round(track.bandwidth/1e3)} Kbps`;
          const isChecked = track.active && !player.getConfiguration()?.abr?.enabled;
          itemsHtml += `<li class="modal-selectable" data-action="radio" data-key="quality" data-value='${track.id}'>${track.height}p, ${bps} <input type="radio" name="quality" value='${track.id}' ${isChecked ? 'checked' : ''}></li>`;
        });
        // Added class 'modal-selectable' to Button for keyboard control
        // --- PATCH: Updated H2 title ---
        contentHtml = `<h2>Video Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="cancel" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" data-action="ok" onclick="applyQualitySetting()">OK</button></div>`;

      } else if (type === 'subtitles') {
        const textTracks = player.getTextTracks() || [];
        const audioTracks = player.getAudioLanguagesAndRoles() || [];
        let subItemsHtml = `<li class="modal-selectable" data-action="subtitle_off">Off</li>`;
        textTracks.forEach(track => {
          const safeTrackData = { id: track.id, label: track.label, language: track.language };
          const safeTrack = JSON.stringify(safeTrackData).replace(/</g, '\\u003c');
          subItemsHtml += `<li class="modal-selectable" data-action="subtitle_on" data-track='${safeTrack}'>${track.label || track.language}</li>`;
        });
        let audioItemsHtml = audioTracks.map(track => `<li class="modal-selectable" data-action="audio" data-lang="${track.language}">${track.language} (Audio)</li>`).join('');
        // --- PATCH: Updated H2 title ---
        contentHtml = `<h2>Video Track</h2><ul class="popup-content-list">${subItemsHtml}${audioItemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

      } else if (type === 'edit') {
        if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return '<p>No channel selected.</p>'; 
        const currentChannel = channels[aFilteredChannelKeys[iCurrentChannel]]; 
        if (!currentChannel) return '<p>Channel data missing.</p>';
        const safeName = (currentChannel.name || '').replace(/"/g, '&quot;');
        const safeLogo = (currentChannel.logo || '').replace(/"/g, '&quot;');
        contentHtml = `<h2>Edit Channel</h2><div style="padding: 15px 25px;">
          <label>Name</label><br><input type="text" id="edit_ch_name" class="edit-modal-field" value="${safeName}"><br>
          <label>Logo URL</label><br><input type="text" id="edit_ch_logo" class="edit-modal-field" value="${safeLogo}">
        </div><div class="popup-buttons"><button class="modal-selectable" data-action="cancel" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" data-action="save" onclick="applyChannelEdit()">SAVE</button></div>`;
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
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return hideSettingsModal(); 
  const key = aFilteredChannelKeys[iCurrentChannel]; 
  if (!channels[key]) return hideSettingsModal();

  channels[key].name = nameInput.value;
  channels[key].logo = logoInput.value;
  buildNav();
  hideSettingsModal();
};

window.applyQualitySetting = () => {
  if (!player) return hideSettingsModal();
  const selectedRadio = document.querySelector('input[name="quality"]:checked');
  if (!selectedRadio) return hideSettingsModal();
  const selected = selectedRadio.value;
  try {
    if (selected === 'auto') {
      player.configure({ abr: { enabled: true } });
    } else {
      player.configure({ abr: { enabled: false } });
      const trackToSelect = (player.getVariantTracks() || []).find(t => t.id == selected);
      if (trackToSelect) { player.selectVariantTrack(trackToSelect, true); }
      else { console.warn("Selected quality track not found:", selected); player.configure({ abr: { enabled: true } }); }
    }
  } catch(error) { console.error("Error applying quality setting:", error); try { player.configure({ abr: { enabled: true } }); } catch {} }
  hideSettingsModal();
};

window.setSubtitles = (track, isVisible) => {
    if (!player) return hideSettingsModal();
    try {
        player.setTextTrackVisibility(isVisible);
        if (isVisible && track && typeof track.id !== 'undefined') {
            const trackToSelect = (player.getTextTracks() || []).find(t => t.id === track.id);
            if (trackToSelect) { player.selectTextTrack(trackToSelect); }
            else { console.warn("Subtitle track not found:", track.id); }
        }
    } catch(error) { console.error("Error setting subtitles:", error); }
    hideSettingsModal();
};

window.setAudio = lang => {
    if (!player) return hideSettingsModal();
    if (typeof lang === 'string' && lang) {
        try { player.selectAudioLanguage(lang); }
        catch(error) { console.error("Error setting audio language:", error); }
    } else { console.warn("Invalid audio language provided:", lang); }
    hideSettingsModal();
};

function toggleFavourite() {
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return; 
  const key = aFilteredChannelKeys[iCurrentChannel]; 
  if (!channels[key]) return;

  channels[key].favorite = !channels[key].favorite;
  saveFavoritesToStorage();

  if (bChannelSettingsOpened) {
      renderChannelSettings();
  }

  if (bNavOpened || sSelectedGroup === '__fav') {
      buildNav();
      updateSelectedChannelInNav();
  }
}


/* -------------------------
    UI State & Helpers
    ------------------------- */
function showTempChannelSwitchMessage(logoUrl, name, number) {
    if (!o.TempMessageOverlay) return;
    clearTimeout(tempMessageTimeout);

    const safeLogoUrl = (logoUrl || 'https://via.placeholder.com/80x80?text=No+Logo').replace(/"/g, '&quot;');
    const safeName = (name || 'Unknown Channel').replace(/</g, '&lt;');
    const safeNumber = number || '?';
   
    o.TempMessageOverlay.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 80px; height: 80px; flex-shrink: 0;">
                <img src="${safeLogoUrl}" alt="${safeName} logo" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 1.5em; font-weight: bold;">${safeName} <span style="font-weight: normal; font-size: 0.8em; color: var(--text-secondary);">${safeNumber}</span></span>
                <span style="font-size: 1em; opacity: 0.8; color: var(--text-secondary);">Loading...</span>
            </div>
        </div>
    `;
   
    o.TempMessageOverlay.classList.remove('HIDDEN');
    o.TempMessageOverlay.classList.add('visible');

    tempMessageTimeout = setTimeout(() => {
        o.TempMessageOverlay.classList.remove('visible');
        setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 300);
    }, 3000);
}


function showTempMessage(message) {
    if (!o.TempMessageOverlay) return;
    clearTimeout(tempMessageTimeout);
    o.TempMessageOverlay.innerHTML = `<p>${message}</p>`; 
    o.TempMessageOverlay.classList.remove('HIDDEN');
    o.TempMessageOverlay.classList.add('visible');

    tempMessageTimeout = setTimeout(() => {
        o.TempMessageOverlay.classList.remove('visible');
        setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 300);
    }, 3000);
}

function showIdleAnimation(showPlayButton = false) {
  if (o.IdleAnimation) o.IdleAnimation.classList.remove('HIDDEN');
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
  if (exclude !== 'nav' && exclude !== 'epg' && exclude !== 'guide') hideNav();
  if (exclude !== 'channelSettings' && exclude !== 'settingsModal') hideChannelSettings();
  if (exclude !== 'guide') window.hideGuide();
  if (exclude !== 'channelName') hideChannelName();
  if (exclude !== 'settingsModal') window.hideSettingsModal();
  if (exclude !== 'epg') hideEpg();
 
  if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) {
      clearTimeout(tempMessageTimeout);
      o.TempMessageOverlay.classList.remove('visible');
      o.TempMessageOverlay.classList.add('HIDDEN');
  }
}

// Left Panel - Main Channel List
function showNav() {
  if (!o.Nav) return;
  bNavOpened = true;
  o.Nav.classList.add('visible');
 
  // Assuming HTML order: [ChannelList] [GroupList]
  if (o.ListContainer) {
      o.ListContainer.classList.remove('groups-opened');
      bGroupsOpened = false;
  }
  updateSelectedChannelInNav();
}

function hideNav() {
  if (!o.Nav) return;
  bNavOpened = false;
  bGroupsOpened = false;
  o.Nav.classList.remove('visible');
}

// Left Panel - Drill Down to Groups
function showGroups() {
  if (bNavOpened && o.ListContainer) {
    bGroupsOpened = true;
    // Assuming HTML order: [ChannelList] [GroupList]
    // To show GroupList (Element 2), we shift the container LEFT by 50%
    o.ListContainer.classList.add('groups-opened'); 
    updateSelectedGroupInNav();
  }
}

function hideGroups() {
  bGroupsOpened = false;
  if (o.ListContainer) {
      // Assuming HTML order: [ChannelList] [GroupList]
      // To show ChannelList (Element 1), we shift the container RIGHT back to 0%
      o.ListContainer.classList.remove('groups-opened'); 
  }
}


function showChannelSettings() {
  if (!o.ChannelSettings) return;

  clearUi('channelSettings');
  hideVideoFormatMenu();
  iChannelSettingsIndex = 0;
  renderChannelSettings();
  bChannelSettingsOpened = true;
  o.ChannelSettings.classList.add('visible');
}

function hideChannelSettings() {
  if (!o.ChannelSettings) return;

  bChannelSettingsOpened = false;
  o.ChannelSettings.classList.remove('visible');
}

window.showGuide = () => {
  if (!o.Guide || !o.GuideContent || !o.BlurOverlay) return;
  clearUi('guide');
  o.BlurOverlay.classList.add('visible');
  renderGuideContent();
  bGuideOpened = true;
  o.Guide.classList.remove('HIDDEN');
};
window.hideGuide = () => {
  bGuideOpened = false;
  if (o.Guide) o.Guide.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
};

function renderGuideContent() {
  if (!o.GuideContent) return;
  o.GuideContent.innerHTML = `
    <h2>Controls</h2>
    <ul style="list-style: none; padding: 0; font-size: clamp(16px, 2.5vw, 22px); line-height: 1.8;">
      <li><kbd>M</kbd> - Settings</li>
      <li><kbd>E</kbd> - EPG</li>
      <li><kbd>H</kbd> - User Manual (Guide)</li>
      <li><kbd>↑</kbd>/<kbd>↓</kbd> - Change channel</li>
      <li><kbd>←</kbd> - Drill Down (Open Panel/Groups)</li>
      <li><kbd>→</kbd> - Go Back / Close Panel</li>
      <li><kbd>OK</kbd>/<kbd>Enter</kbd> - Show Channel Info / Select Item</li>
      <li><kbd>ESC</kbd> - Close All</li>
      <li><kbd>Double Tap/Click</kbd> - Toggle Fullscreen</li>
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

  const currentKey = aEpgFilteredChannelKeys[iCurrentChannel]; 
  iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
  if (iEpgChannelIndex === -1) {
      const currentChannelData = channels[aEpgFilteredChannelKeys[iCurrentChannel]]; 
      if (currentChannelData) {
          iEpgChannelIndex = aEpgFilteredChannelKeys.findIndex(key => channels[key]?.number === currentChannelData.number);
      }
      if (iEpgChannelIndex === -1) iEpgChannelIndex = 0;
  }

  renderEpg();
  bEpgOpened = true;
  o.EpgOverlay.classList.remove('HIDDEN');
}
function hideEpg() {
    bEpgOpened = false;
    if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN');
}

function renderEpg() {
  if (!o.EpgChannels || !o.EpgTimeline) return;

  let channelsHtml = '';
  aEpgFilteredChannelKeys.forEach((key, index) => {
    const ch = channels[key];
    if (!ch) return;
    const selectedClass = index === iEpgChannelIndex ? 'selected' : '';
meta.data.user.memory.user_summary.interests_and_preferences[4]  const safeName = (ch.name || 'Unknown').replace(/</g, '&lt;');
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
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return; 
  const chKey = aFilteredChannelKeys[iCurrentChannel]; 
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
  } catch(e) { console.error("Error saving favorites:", e); }
}


/* -------------------------
    First Play handling
    ------------------------- */
function handleFirstPlay() {
  if (isSessionActive) return;
  isSessionActive = true;

  hideIdleAnimation();

  if(aFilteredChannelKeys.length > 0 && iCurrentChannel >= 0 && iCurrentChannel < aFilteredChannelKeys.length){ 
      loadChannel(iCurrentChannel); 
  } else {
      console.error("No valid channel selected on first play.");
      showIdleAnimation(true);
      isSessionActive = false;
      return;
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

        // Use a broader selector to include both <li> and <button> in the modal
        const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
        const itemsCount = items.length;
       
        if (items && iSettingsModalIndex >= 0 && iSettingsModalIndex < itemsCount) {
            const item = items[iSettingsModalIndex];
            if (item) {
                item.classList.add('selected');
                // Auto-check the radio button when selecting the list item
                const radio = item.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                if (typeof item.scrollIntoView === 'function') {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else {
             // Handle wrapping around 
             if (iSettingsModalIndex < 0) iSettingsModalIndex = 0;
             else if (iSettingsModalIndex >= itemsCount) iSettingsModalIndex = itemsCount - 1;
             
             // Re-call selection if index was corrected
             if (itemsCount > 0) updateSettingsModalSelection();
             else console.warn("Invalid index or no items for modal selection:", iSettingsModalIndex);
S    } } catch (error) {
        console.error("Error updating settings modal selection:", error);
    }
}

function toggleFullScreen() {
    const elem = document.documentElement;

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
t      } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else {
            console.warn("Fullscreen API is not supported by this browser.");
s      }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
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
    Event Listeners
    ------------------------- */
if (o.PlayButton) {
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
} else { console.error("PlayButton element not found."); }

if (o.SearchField) {
    o.SearchField.addEventListener('input', () => {
      buildNav();
      if (aFilteredChannelKeys.length > 0) {
        iCurrentChannel = 0; 
        if (isSessionActive) { loadChannel(0); }
        updateSelectedChannelInNav();
      } else {
        try { player?.unload(); } catch {}
        showIdleAnimation(true);
      }
    });
} else { console.error("SearchField element not found."); }

// --- START: TV REMOTE KEYDOWN LOGIC (FINAL STABLE VERSION WITH CORRECTED NAV/GROUP ARROW LOGIC) ---
document.addEventListener('keydown', (e) => {

  // Ignore all input if the SearchField is focused
  if (document.activeElement === o.SearchField) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') { // Exit search field
          e.preventDefault();
          if(o.SearchField) o.SearchField.blur();
          iCurrentChannel = 0; 
          updateSelectedChannelInNav();
      } else if (e.key === 'Escape') {
          e.preventDefault();
          if(o.SearchField) o.SearchField.blur();
      }
      return;
  }

  // Check for Modals/Overlays FIRST
  if (bGuideOpened || bEpgOpened) {
      e.preventDefault();
      if (e.key === 'Escape') clearUi();
      return;
  }

  // --- MODAL NAVIGATION FIX ---
  if (bSettingsModalOpened) {
      e.preventDefault();
      const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
      const itemsCount = items.length;

      if (itemsCount === 0) {
          if (e.key === 'Escape') window.hideSettingsModal();
          return;
      }

      if (e.key === 'ArrowUp') {
          iSettingsModalIndex = Math.max(0, iSettingsModalIndex - 1);
          updateSettingsModalSelection();
      } else if (e.key === 'ArrowDown') {
          iSettingsModalIndex = Math.min(itemsCount - 1, iSettingsModalIndex + 1);
          updateSettingsModalSelection();
      } else if (e.key === 'Enter') { // --- MODIFICATION: Removed ArrowRight ---
          const selectedItem = items[iSettingsModalIndex];
          if (!selectedItem) return;
         
          if (selectedItem.tagName === 'LI') {
              const action = selectedItem.dataset.action;
              // For list items with radio buttons (Quality), Enter/Right confirms the selection and applies it
              if (action === 'radio') {
                  window.applyQualitySetting();
              } 
              // For subtitle/audio list items, Enter/Right clicks the item to set it
              else if (action === 'subtitle_off') {
                  window.setSubtitles(null, false);
              } else if (action === 'subtitle_on') {
                  const track = JSON.parse(selectedItem.dataset.track.replace(/\\u003c/g, '<'));
SI                window.setSubtitles(track, true);
              } else if (action === 'audio') {
                  window.setAudio(selectedItem.dataset.lang);
              }
             
          } else if (selectedItem.tagName === 'BUTTON') {
              selectedItem.click(); // Trigger button action
        _ }
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
          window.hideSettingsModal();
      }
      return;
  }
  // --- END MODAL NAVIGATION FIX ---
 
A  // Logic inside NAV PANEL (Left)
  if (bNavOpened) {
    e.preventDefault();
    if (bGroupsOpened) {
      // GROUP LIST (Currently visible)
      const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
      const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];

      if (!ARROW_KEYS.includes(e.key)) return;

      if (e.key === 'ArrowUp') {
          iGroupListIndex = Math.max(0, iGroupListIndex - 1);
      } else if (e.key === 'ArrowDown') {
          iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
      } else if (e.key === 'Enter') { 
          groupItems[iGroupListIndex]?.click();
      } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // <-- GO BACK
          hideGroups(); // Groups -> Channels (slide left)
      } else if (e.key === 'ArrowLeft') { // <-- DRILL DOWN/SELECT
           groupItems[iGroupListIndex]?.click(); 
      }
      updateSelectedGroupInNav();

    } else { 
      // CHANNEL LIST (Currently visible)
      const channelItems = o.ChannelList.querySelectorAll('li.channel-item');
SESSION_ID: -7359193231454170094      const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
      if (!ARROW_KEYS.includes(e.key)) return;
     
      if (e.key === 'ArrowUp') {
          if (iCurrentChannel === 0 && o.SearchField) { 
              o.SearchField.focus();
              channelItems[iCurrentChannel].classList.remove('selected');
          } else if (iCurrentChannel > 0) { 
              iCurrentChannel = (iCurrentChannel - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length; 
          }
      } else if (e.key === 'ArrowDown') {
          if (document.activeElement === o.SearchField) {
              o.SearchField.blur();
              iCurrentChannel = 0;
          } else if (aFilteredChannelKeys.length > 0) { 
              iCurrentChannel = (iCurrentChannel + 1) % aFilteredChannelKeys.length; 
          }
      } else if (e.key === 'Enter') {
          if (iCurrentChannel !== -1 && aFilteredChannelKeys.length > 0) { 
              loadChannel(iCurrentChannel); 
              hideNav();
          }
      } else if (e.key === 'ArrowLeft') { // <-- DRILL DOWN (Open Groups)
          if (iCurrentChannel !== -1) { 
              showGroups(); // Channel List slides right to reveal Groups
  }
      } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // <-- GO BACK
s        hideNav(); // Close the entire panel
      }
      updateSelectedChannelInNav();
    }
    return;
  }
 
  // Logic inside CHANNEL SETTINGS PANEL (Right)
  if (bChannelSettingsOpened) {
    e.preventDefault();
    const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
    const ARROW_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
   
    if (!ARROW_KEYS.includes(e.key)) return;

    if (isSubmenu) {
        // Submenu List
        const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
        else if (e.key === 'Enter') { // <-- MODIFICATION: Removed ArrowRight
            submenuItems[iVideoSettingsIndex]?.click();
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // <-- GO BACK
            hideVideoFormatMenu(); // Slide back to Main Settings Menu
        }
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else { 
        // Main Settings Menu
        const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
        else if (e.key === 'Enter') {
            mainItems[iChannelSettingsIndex]?.click();
        }
        else if (e.key === 'ArrowRight') { // <-- DRILL DOWN
            if (iChannelSettingsIndex === 1) { // Item 1 is 'Video / Format'
                mainItems[iChannelSettingsIndex]?.click();
            } else {
                 mainItems[iChannelSettingsIndex]?.click();
ci        }
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // <-- GO BACK
             hideChannelSettings(); // Close the entire Settings panel
        }
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return;
  }


  // DEFAULT PLAYER KEYS (Panels are closed)
  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
SESSION_ID: -7359193231454170094  if (!PLAYER_KEYS.includes(e.key)) return;

  e.preventDefault();
  switch (e.key) {
    case 'ArrowLeft':
        showNav(); // Open Channel List (Drill Down to Panel)
Ah    break;
    case 'ArrowRight': 
        showChannelSettings(); // Open Settings (Drill Down to Panel)
        break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iCurrentChannel - 1); break;
S    case 'ArrowDown': loadChannel(iCurrentChannel + 1); break;
    case 'h': window.showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': clearUi(); break;
  }
});
// --- END: TV REMOTE KEYDOWN LOGIC (FINAL STABLE VERSION WITH CORRECTED NAV/GROUP ARROW LOGIC) ---


/**
* Gets stats from Shaka Player and updates the Stream Info overlay.
*/
function updateStreamInfo() {
  const infoOverlay = o.CodecInfo; 
  if (!infoOverlay) return; 
 
  if (!player) {
    infoOverlay.textContent = 'Player Info: N/A';
    return;
  }

  try {
    const variant = player.getVariantTracks().find(t => t.active);
    const stats = player.getStats();

    if (!variant || !stats) {
      infoOverlay.textContent = 'Player Info: N/A';
      return;
    }

    const codecs = variant.codecs || 'N/A';
    const resolution = `${variant.width}x${variant.height}`;
    const bandwidth = (stats.estimatedBandwidth / 1000000).toFixed(2); 

    infoOverlay.textContent = `Video: ${resolution} (${codecs}) | Bandwidth: ${bandwidth} Mbit/s`;
 
  } catch (error) {
    console.warn("Could not get stream info:", error);
    infoOverlay.textContent = 'Player Info: Error';
  }
}

document.addEventListener('DOMContentLoaded', initPlayer);
