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
  SettingsVideoInfo: document.getElementById('SettingsVideoInfo'),
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
  ChannelInfoLogo: document.getElementById('ch_logo'),
  TempMessageOverlay: document.getElementById('TempMessageOverlay')
};

let channels = {
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
    StrawberryShortcake: { name: "Strawberry Shortcake (Test)", type: "hls", manifestUri: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
    SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
    aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"] },
    sinemanila: { name: "SineManila", type: "hls", manifestUri: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "https://is5-ssl.mzstatic.com/image/thumb/Purple112/v4/64/72/72/64727284-ad63-33a7-59a6-7975c742c038/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg", group: ["movies", "entertainment"] },
    pbarush: { name: "PBA Rush", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3", key: "95b2f2ffd4e14073620506213b62ac82", logo: "https://static.wikia.nocookie.net/logopedia/images/0/00/PBA_Rush_Logo_2016.png", group: ["entertainment"] },
    animalplanet: { name: "Animal Planet", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", keyId: "436b69f987924fcbbc06d40a69c2799a", key: "c63d5b0d7e52335b61aeba4f6537d54d", logo: "https://i.imgur.com/SkpFpW4.png", group: ["documentary"] },
    discoverychannel: { name: "Discovery Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", keyId: "d9ac48f5131641a789328257e778ad3a", key: "b6e67c37239901980c6e37e0607ceee6", logo: "https://placehold.co/100x100/000/fff?text=Discovery", group: ["documentary"] },
    nickelodeon: { name: "Nickelodeon", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd", keyId: "9ce58f37576b416381b6514a809bfd8b", key: "f0fbb758cdeeaddfa3eae538856b4d72", logo: "https://i.imgur.com/4o5dNZA.png", group: ["cartoons & animations"] },
    nickjr: { name: "Nick Jr", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", keyId: "bab5c11178b646749fbae87962bf5113", key: "0ac679aad3b9d619ac39ad634ec76bc8", logo: "https://i.imgur.com/iIVYdZP.png", group: ["cartoons & animations"] },
    pbo: { name: "PBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "https://i.imgur.com/550RYpJ.png", group: ["movies", "entertainment"] },
    angrybirds: { name: "Angry Birds", type: "hls", manifestUri: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=547", logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png", group: ["cartoons & animations"] },
    zoomooasia: { name: "Zoo Moo Asia", type: "hls", manifestUri: "https://zoomoo-samsungau.amagi.tv/playlist.m3u8", logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png", group: ["cartoons & animations", "entertainment"] },
    mrbeanlive: { name: "MR Bean (Test)", type: "hls", manifestUri: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", logo: "https://placehold.co/100x100/000/fff?text=Mr+Bean", group: ["entertainment"] },
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
let aEpgFilteredChannelKeys = [];
let iSettingsModalIndex = 0; 
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0;
let loaderFadeTimeout = null; 
let tempMessageTimeout = null; 

/* -------------------------
    Utilities
    ------------------------- */
function getEl(id) { return document.getElementById(id); }

/* -------------------------
    Core Player Functions
    ------------------------- */
async function initPlayer() {
  Object.keys(channels).forEach((key, i) => {
    channels[key].number = i + 1;
    channels[key].key = key;
  });

  // --- START: FIX - Clear search field on load ---
  if (o.SearchField) o.SearchField.value = '';
  // --- END: FIX ---

  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav();
  sSelectedGroup = '__all';

  if (o.GroupList) {
      const allGroupLiItems = o.GroupList.querySelectorAll('li');
      const initialGroupItem = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
      if (initialGroupItem) {
          iGroupListIndex = Array.from(allGroupLiItems).indexOf(initialGroupItem);
      } else {
          iGroupListIndex = Array.from(allGroupLiItems).findIndex(li => li.textContent.trim() === 'ALL CHANNELS');
          if (iGroupListIndex === -1) iGroupListIndex = 1;
          console.warn("'__all' group item not found, using fallback index:", iGroupListIndex);
      }
  } else {
      iGroupListIndex = 1;
      console.warn("GroupList not found during init index calculation.");
  }

  buildNav();
  updateSelectedGroupInNav();

  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) {
    console.error("Browser not supported");
    return;
  }

  player = new shaka.Player();
  ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);

  // --- START: FIX for PiP ---
  ui.configure({
    // Add the built-in Shaka PiP button
    controlPanelElements: ['picture_in_picture'], 
    addSeekBar: false,
    addBigPlayButton: false,
    showBuffering: true, 
    clickToPlay: false
  });
  // --- END: FIX for PiP ---

  player.attach(o.AvPlayer);

  player.configure({
    abr: { defaultBandwidthEstimate: 500000 },
    streaming: { rebufferingGoal: 3, bufferingGoal: 10 }
  });

  player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    showIdleAnimation(true); 
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

  setupControls();
  showIdleAnimation(true);
  loadInitialChannel(); 
}

function handleBuffering(event) {
    clearTimeout(loaderFadeTimeout); 

    if (event.buffering) {
        if(o.AvPlayer) o.AvPlayer.style.opacity = '0';
    } else {
        hideLoaderAndShowVideo();
    }
}

function handlePlaying() {
    hideLoaderAndShowVideo();
}

function hideLoaderAndShowVideo() {
    clearTimeout(loaderFadeTimeout); 

    if(o.AvPlayer) o.AvPlayer.style.opacity = '1';

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
        if (e.changedTouches.length !== 1) {
            return; 
        }

        const targetElement = document.elementFromPoint(touchStartX, touchStartY);
        if (targetElement && (targetElement.closest('#nav') || targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay') )) {
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

        if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
            handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY);
            lastTapTime = 0;
            touchStartX = touchStartY = touchEndX = touchEndY = 0;
            return; 
        }

        if (absDeltaX < TAP_THRESHOLD && absDeltaY < TAP_THRESHOLD) {
            const currentTime = new Date().getTime();
            if (currentTime - lastTapTime < 300) { 
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
        if (e.target && e.target.closest('#PlayButton')) {
            return;
        }
        
        if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay') )) {
            return;
        }

        const currentTime = new Date().getTime();
        const isFromTap = (currentTime - lastTapTime) < 350;

        if (isFromTap) {
            handleSingleTapAction();
        } else {
            if (currentTime - lastTapTime < 300) {
                handleDoubleTapAction();
                lastTapTime = 0;
            } else {
                handleSingleTapAction();
                lastTapTime = currentTime;
            }
        }
    });

    playerContainer.addEventListener('dblclick', e => {
        e.preventDefault();
        handleDoubleTapAction(); 
    });
}

function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
    const isHorizontal = absDeltaX > absDeltaY;
    if (isHorizontal) {
        if (deltaX > 0) { // Swipe Right ->
            if (bChannelSettingsOpened) hideChannelSettings();
            else if (bGroupsOpened) hideGroups(); 
            else if (bNavOpened && !bGroupsOpened) hideNav(); 
            else if (!bNavOpened && !bChannelSettingsOpened) showNav(); 
        } else { // Swipe Left <-
            if (bNavOpened && !bGroupsOpened) showGroups(); 
            else if (!bChannelSettingsOpened && !bNavOpened) showChannelSettings(); 
            else if (bNavOpened && bGroupsOpened) { /* Do nothing */ } 
        }
    } else { // Vertical Swipe
        if (!bNavOpened && !bChannelSettingsOpened && !bGuideOpened && !bEpgOpened && !bSettingsModalOpened) {
            if (deltaY > 0) {
                loadChannel(iCurrentChannel + 1); // Swipe Down
            } else {
                loadChannel(iCurrentChannel - 1); // Swipe Up
            }
        }
    }
}

function handleSingleTapAction() {
    if (!isSessionActive) {
        return;
    }

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
  let initialChannelKey = 'pbarush'; 
  
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

  iCurrentChannel = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length;

  const channelKey = aFilteredChannelKeys[iCurrentChannel];
  if (!channelKey || !channels[channelKey]) {
       console.error(`Invalid channel key or data for index ${iCurrentChannel}: ${channelKey}`);
       showIdleAnimation(!isSessionActive); 
       return;
  }
  const channel = channels[channelKey];

  if (!player) {
       console.error("Player not initialized before loading channel.");
       return;
  }

  localStorage.setItem('iptvLastWatched', channelKey);

  if (o.ChannelLoader) {
      o.ChannelLoader.classList.remove('fade-out');
      o.ChannelLoader.style.opacity = '1';
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

    await player.load(channel.manifestUri);

    if (isSessionActive) {
      if (o.AvPlayer) {
          o.AvPlayer.muted = false;
          o.AvPlayer.play().catch(e => console.warn("Autoplay after load prevented.", e));
      }
      showChannelName();
    }

  } catch (error) {
    console.error(`Error loading channel "${channel?.name}":`, error);
    showIdleAnimation(!isSessionActive); 
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
  if (guideBtn) guideBtn.onclick = showGuide;
  else console.warn("guide_button not found.");
  if (epgBtn) epgBtn.onclick = showEpg;
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

  const fullGroupListItems = o.GroupList.querySelectorAll('li');

  fullGroupListItems.forEach((li, index) => {
      li.onclick = null;
      if (li.hasAttribute('data-group')) {
         li.onclick = () => selectGroup(index);
      }
      else if (li.id === 'guide_button') {
          li.onclick = showGuide;
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

  buildNav(); 

  if (aFilteredChannelKeys.length > 0) {
    iCurrentChannel = 0; 
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

  console.log(`Building Nav for group: "${sSelectedGroup}", Found channels: ${aFilteredChannelKeys.length}`);

  o.ChannelList.innerHTML = '';
  o.ChannelList.scrollTop = 0;

  if (aFilteredChannelKeys.length === 0) {
    const msg = sSelectedGroup === '__fav'
        ? 'No favorite channels found. Add channels using the settings menu (→).'
        : (searchTerm ? 'No channels match your search.' : 'No channels found in this category.');
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
      if (isSessionActive) {
        loadChannel(index);
      } else {
          iCurrentChannel = index;
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
            if (bNavOpened && !bGroupsOpened && typeof newItem.scrollIntoView === 'function') { // Only scroll if ChannelList is visible
                newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
      } else if (aFilteredChannelKeys.length > 0 && channelItems.length > 0) {
           iCurrentChannel = 0; 
           const firstItem = channelItems[0];
           if (firstItem) firstItem.classList.add('selected');
           console.warn("iCurrentChannel was out of bounds, selecting first channel.");
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
             if (bNavOpened && bGroupsOpened && typeof newItem.scrollIntoView === 'function') { // Only scroll if GroupList is visible
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
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0 || iCurrentChannel >= aFilteredChannelKeys.length) return;
  const currentChannelKey = aFilteredChannelKeys[iCurrentChannel];
  const currentChannel = channels[currentChannelKey];
  if (!currentChannel) return;

  let vCodec = 'N/A', aCodec = 'N/A', vRes = '';
  try {
    if (player && typeof player.getActiveTracks === 'function') {
        const activeTracks = player.getActiveTracks();
        if (activeTracks) {
          if (activeTracks.video) {
              if(activeTracks.video.codec) vCodec = activeTracks.video.codec.split('.')[0].toUpperCase();
              if(activeTracks.video.height) vRes = `${activeTracks.video.height}p`;
          }
          if (activeTracks.audio && activeTracks.audio.codec) aCodec = activeTracks.audio.codec.split('.')[0].toUpperCase();
        }
    }
  } catch (e) { console.warn("Could not get active tracks:", e); }

  if (o.SettingsVideoInfo) {
      o.SettingsVideoInfo.textContent = `Video: ${vRes} (${vCodec}) | Audio: ${aCodec}`;
  }

  // --- START: FIX for PiP ---
  if (o.SettingsMainMenu) {
      o.SettingsMainMenu.innerHTML = `
        <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
        <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
        <!-- REMOVED custom PiP button -->
        <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
      `;
      updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
  } else { console.error("SettingsMainMenu element not found"); }
  // --- END: FIX for PiP ---
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
      const currentFormat = getAspectRatio();
      o.SettingsVideoFormatMenu.innerHTML = `
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
  // --- START: FIX for Modal Scrollbar ---
  document.body.classList.add('modal-open');
  // --- END: FIX ---
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
}

window.hideSettingsModal = () => {
  // --- START: FIX for Modal Scrollbar ---
  document.body.classList.remove('modal-open');
  // --- END: FIX ---
  bSettingsModalOpened = false;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
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
        if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return '<p>No channel selected.</p>';
        const currentChannel = channels[aFilteredChannelKeys[iCurrentChannel]];
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
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return hideSettingsModal();
  const key = aFilteredChannelKeys[iCurrentChannel];
  if (!channels[key]) return hideSettingsModal();

  channels[key].name = nameInput.value;
  channels[key].logo = logoInput.value;
  buildNav();
  hideSettingsModal();
};

function applyQualityAndClose(selected) {
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
                player.configure({ abr: { enabled: true } }); 
            }
        }
    } catch (error) {
        console.error("Error applying quality setting:", error);
        try { player.configure({ abr: { enabled: true } }); } catch { } 
    }
    hideSettingsModal();
}

function applyFormatAndClose(value) {
    console.log("Applying Format:", value);
    setAspectRatio(value);
    hideSettingsModal();
}

function setSubtitlesAndClose(track, isVisible) {
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

function setAudioAndClose(lang) {
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
  if (!aFilteredChannelKeys || iCurrentChannel >= aFilteredChannelKeys.length) return;
  const key = aFilteredChannelKeys[iCurrentChannel];
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
         iCurrentChannel = newIndex;
     } else if (aFilteredChannelKeys.length > 0) {
         iCurrentChannel = 0; 
     } else {
         iCurrentChannel = 0; 
     }
     updateSelectedChannelInNav();
  }
}

// REMOVED togglePip() function

/* -------------------------
    UI State & Helpers
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


function showNav() {
  if (!o.Nav) return;
  bNavOpened = true;
  o.Nav.classList.add('visible');
  updateSelectedChannelInNav(); 
  updateSelectedGroupInNav();
}

function hideNav() {
  if (!o.Nav) return;
  bNavOpened = false;
  bGroupsOpened = false;
  o.Nav.classList.remove('visible');
  if (o.ListContainer?.classList.contains('groups-opened')) {
      hideGroups();
  }
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
      updateSelectedChannelInNav();
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
  document.body.classList.add('modal-open'); // <-- FIX for scrollbar
  renderGuideContent();
  bGuideOpened = true;
  o.Guide.classList.remove('HIDDEN');
};
window.hideGuide = () => {
  document.body.classList.remove('modal-open'); // <-- FIX for scrollbar
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
      <li><kbd>←</kbd> - Open Channel List</li>
      <li><kbd>←</kbd><kbd>←</kbd> (when list open) - Open Group List</li>
      <li><kbd>→</kbd> - Open Channel Settings</li>
      <li><kbd>OK</kbd>/<kbd>Enter</kbd> - Show Channel Info / Select Item</li>
      <li><kbd>ESC</kbd> - Go Back / Close Panel</li>
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
  document.body.classList.add('modal-open'); // <-- FIX for scrollbar

  aEpgFilteredChannelKeys = Object.keys(channels)
      .sort((a, b) => (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));

  const currentKey = aFilteredChannelKeys[iCurrentChannel];
  iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
  if (iEpgChannelIndex === -1) {
      const currentChannelData = channels[aFilteredChannelKeys[iCurrentChannel]];
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
    document.body.classList.remove('modal-open'); // <-- FIX for scrollbar
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

        const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
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

function toggleFullScreen() {
    console.log("Toggle Fullscreen triggered");
    const elem = document.documentElement;

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else {
             console.warn("Fullscreen API is not supported by this browser.");
        }
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
    Event Listeners (keyboard / touch)
    ------------------------- */

if (o.PlayButton) {
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
} else { console.error("PlayButton element not found."); }

if (o.SearchField) {
    o.SearchField.addEventListener('input', () => {
      buildNav();
      if (aFilteredChannelKeys.length > 0) {
        iCurrentChannel = 0;
        updateSelectedChannelInNav();
      }
    });
} else { console.error("SearchField element not found."); }

document.addEventListener('keydown', (e) => {

  if (document.activeElement === o.SearchField) {
      if (e.key === 'ArrowDown' && bNavOpened && !bGroupsOpened) { 
          e.preventDefault(); 
          iCurrentChannel = 0; 
          if(o.SearchField) o.SearchField.blur();
          updateSelectedChannelInNav();
      } else if (e.key === 'Escape') {
           e.preventDefault();
           if(o.SearchField) o.SearchField.blur();
           iCurrentChannel = 0;
           updateSelectedChannelInNav();
      }
      return; 
  }


  if (bGuideOpened) {
     e.preventDefault();
     if (e.key === 'Escape') window.hideGuide();
     return;
  }

  if (bSettingsModalOpened) {
      e.preventDefault();
      const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
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
                   const type = o.SettingsModalContent.querySelector('input[name="quality"]') ? 'quality' : 'format'; 
                   if (type === 'quality') {
                       applyQualityAndClose(selectedItem.dataset.value);
                   } else if (type === 'format') {
                       applyFormatAndClose(selectedItem.dataset.value);
                   } else {
                         if (typeof selectedItem.click === 'function') selectedItem.click();
                   }
               } else if (typeof selectedItem.click === 'function') {
                 selectedItem.click();
               }
          }
      } else if (e.key === 'Escape') {
          const closeButton = Array.from(items).find(btn => btn.tagName === 'BUTTON' && (btn.textContent === 'CANCEL' || btn.textContent === 'CLOSE'));
          if (closeButton) {
              closeButton.click();
          } else {
              window.hideSettingsModal();
          }
      }
      return;
  }

  if (bEpgOpened) {
    e.preventDefault();
    const EPG_KEYS = ['Escape', 'ArrowUp', 'ArrowDown', 'Enter'];
    if (!EPG_KEYS.includes(e.key)) return;
    if (e.key === 'Escape') hideEpg();
    else if (e.key === 'ArrowUp') iEpgChannelIndex = Math.max(0, iEpgChannelIndex - 1);
    else if (e.key === 'ArrowDown') {
         iEpgChannelIndex = Math.min(aEpgFilteredChannelKeys.length - 1, iEpgChannelIndex + 1);
    }
    else if (e.key === 'Enter') {
        const selectedKey = aEpgFilteredChannelKeys[iEpgChannelIndex];
        const mainIndex = aFilteredChannelKeys.indexOf(selectedKey);

        if (mainIndex !== -1) {
            loadChannel(mainIndex);
        } else {
            sSelectedGroup = '__all';
            if (o.GroupList) {
                const allGroupLiItems = o.GroupList.querySelectorAll('li');
                const allGroupItemIndex = Array.from(allGroupLiItems).findIndex(li => li.dataset.group === '__all');
                if (allGroupItemIndex !== -1) {
                    iGroupListIndex = allGroupItemIndex;
                    updateSelectedGroupInNav();
                }
            }
            buildNav();
            const newMainIndex = aFilteredChannelKeys.indexOf(selectedKey);
            if (newMainIndex !== -1) {
                loadChannel(newMainIndex);
            } else {
                console.warn("Selected EPG channel not found even in 'ALL' group:", selectedKey);
            }
        }
        hideEpg();
    }
    renderEpg();
    return;
  }

  // --- This is the Panel Logic ---
  if (bNavOpened) {
    e.preventDefault();
    
    // --- CHANNEL LIST (Panel 1) ---
    if (!bGroupsOpened) {
      const CHANNEL_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
       if (!CHANNEL_LIST_KEYS.includes(e.key)) return;

      if (e.key === 'ArrowUp') {
          if (iCurrentChannel === 0 && o.SearchField) {
              o.SearchField.focus();
              const currentSelected = o.ChannelList.querySelector('.selected');
              if (currentSelected) currentSelected.classList.remove('selected');
              iCurrentChannel = -1; 
          } else if (iCurrentChannel > 0) {
              iCurrentChannel = (iCurrentChannel - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
              updateSelectedChannelInNav();
          }
      } else if (e.key === 'ArrowDown') {
          if (iCurrentChannel === -1 && aFilteredChannelKeys.length > 0) {
              iCurrentChannel = 0;
              updateSelectedChannelInNav();
              o.SearchField.blur();
          } else if (aFilteredChannelKeys.length > 0 && iCurrentChannel !== -1) {
             iCurrentChannel = (iCurrentChannel + 1) % aFilteredChannelKeys.length;
             updateSelectedChannelInNav();
          }
      } else if (e.key === 'Enter') { 
            if (iCurrentChannel !== -1 && aFilteredChannelKeys.length > 0) {
                 loadChannel(iCurrentChannel);
                 hideNav();
            }
      } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // Closes Panel
            hideNav();
            if (iCurrentChannel === -1 && o.SearchField) o.SearchField.blur();
      } else if (e.key === 'ArrowLeft') { // Goes to Group List
            if (iCurrentChannel !== -1) { 
               showGroups();
            }
      }
    }
    // --- GROUP LIST (Panel 2) ---
    else { 
      const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
      const GROUP_LIST_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
      if (!GROUP_LIST_KEYS.includes(e.key)) return;

      if (e.key === 'ArrowUp') {
          iGroupListIndex = Math.max(0, iGroupListIndex - 1);
      } else if (e.key === 'ArrowDown') {
          iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
      } else if (e.key === 'Enter') { 
          groupItems[iGroupListIndex]?.click();
      } else if (e.key === 'ArrowRight') { // Goes back to Channel List
          hideGroups();
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // Closes Panel
          hideNav();
      }
      updateSelectedGroupInNav();
    }
    return;
  }
  // --- End Panel Logic ---


  if (bChannelSettingsOpened) {
    e.preventDefault();
    const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
    const SETTINGS_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
     if (!SETTINGS_KEYS.includes(e.key)) return;
    
    if (isSubmenu) {
        const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
        else if (e.key === 'Enter') { 
            submenuItems[iVideoSettingsIndex]?.click();
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') { 
            hideVideoFormatMenu();
        }
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else { // Main Settings
        const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
        else if (e.key === 'Enter') { 
            mainItems[iChannelSettingsIndex]?.click();
        } else if (e.key === 'ArrowRight') { 
            const selectedItem = mainItems[iChannelSettingsIndex];
            if (selectedItem && selectedItem.onclick.toString().includes('showVideoFormatMenu')) {
                selectedItem.click();
            }
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') { 
            hideChannelSettings();
        }
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return;
  }

  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
  if (!PLAYER_KEYS.includes(e.key)) return;

  e.preventDefault();
  switch (e.key) {
    case 'ArrowLeft':
        showNav(); 
        break;
    case 'ArrowRight': showChannelSettings(); break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iCurrentChannel - 1); break;
    case 'ArrowDown': loadChannel(iCurrentChannel + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': clearUi(); break;
  }
});

/* -------------------------
    Init
    ------------------------- */
document.addEventListener('DOMContentLoaded', initPlayer);
