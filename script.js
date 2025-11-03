/* ============================
   Shakzz TV — JW Player Script
   Cleaned, optimized, commented
   ============================ */

/* -------------------------
   DOM shortcuts & refs
   ------------------------- */
const $ = sel => document.querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

const o = {
  PlayerContainer: $('#playerContainer'),
  PlayerDiv: $('#player'),            // JW player container
  Nav: $('#nav'),
  GroupList: $('#GroupList'),
  DynamicGroupsList: $('#DynamicGroupsList'),
  ListContainer: $('#list_container'),
  ChannelList: $('#ChannelList'),
  ChannelLoader: $('#ChannelLoader'),
  IdleAnimation: $('#IdleAnimation'),
  PlayButton: $('#PlayButton'),
  BlurOverlay: $('#BlurOverlay'),
  ChannelInfo: $('#ChannelInfo'),
  SettingsMainMenu: $('#SettingsMainMenu'),
  SettingsVideoFormatMenu: $('#SettingsVideoFormatMenu'),
  SettingsContainer: $('#settings_container'),
  ChannelSettings: $('#ChannelSettings'),
  StreamInfoOverlay: $('#StreamInfoOverlay'),
  Guide: $('#Guide'),
  GuideContent: $('#GuideContent'),
  EpgOverlay: $('#EpgOverlay'),
  EpgChannels: $('#EpgChannels'),
  EpgTimeline: $('#EpgTimeline'),
  SettingsModal: $('#SettingsModal'),
  SettingsModalContent: $('#SettingsModalContent'),
  SearchField: $('#SearchField'),
  ChannelInfoName: $('#channel_name'),
  ChannelInfoEpg: $('#channel_epg'),
  ChannelInfoLogo: $('#ch_logo'),
  TempMessageOverlay: $('#TempMessageOverlay'),
  ListContainerScrollArea: $('#list_container_scrollarea')
};

/* -------------------------
   Channels (kept from user)
   (you already provided this object in your code)
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
   State
   ------------------------- */
let playerInstance = null;            // JW player instance
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iChannelListIndex = 0;
let iActiveChannelIndex = 0;
let iGroupListIndex = 1;
let navState = 'closed';              // 'closed' | 'channels' | 'groups'
let isSessionActive = false;
let channelNameTimeout = null;
let loaderFadeTimeout = null;
let tempMessageTimeout = null;
let bHasPlayedOnce = false;

/* Small throttle for toggles */
let lastToggleAt = 0;
const preventRapidToggle = (ms = 200) => {
  const now = Date.now();
  if (now - lastToggleAt < ms) return true;
  lastToggleAt = now;
  return false;
};

/* -------------------------
   Utility UI helpers
   ------------------------- */
function showTempMessage(msg, t = 3000) {
  if (!o.TempMessageOverlay) return;
  clearTimeout(tempMessageTimeout);
  o.TempMessageOverlay.textContent = msg;
  o.TempMessageOverlay.classList.remove('HIDDEN');
  o.TempMessageOverlay.classList.add('visible');
  tempMessageTimeout = setTimeout(() => {
    o.TempMessageOverlay.classList.remove('visible');
    setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 300);
  }, t);
}
function showLoader(show = true) {
  if (!o.ChannelLoader) return;
  clearTimeout(loaderFadeTimeout);
  if (show) {
    o.ChannelLoader.classList.remove('HIDDEN');
    o.ChannelLoader.classList.remove('fade-out');
    o.ChannelLoader.style.opacity = '1';
  } else {
    o.ChannelLoader.classList.add('fade-out');
    loaderFadeTimeout = setTimeout(() => {
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.classList.remove('fade-out');
      o.ChannelLoader.style.opacity = '1';
    }, 400);
  }
}
function showIdleAnimation(showPlayButton = false) {
  if (!o.IdleAnimation) return;
  o.IdleAnimation.classList.remove('HIDDEN');
  if (o.PlayButton) {
    if (showPlayButton && !isSessionActive) o.PlayButton.classList.remove('HIDDEN');
    else o.PlayButton.classList.add('HIDDEN');
  }
}
function hideIdleAnimation() {
  if (!o.IdleAnimation) return;
  o.IdleAnimation.classList.add('HIDDEN');
}
function showChannelName() {
  clearTimeout(channelNameTimeout);
  if (!o.ChannelInfo || !o.ChannelInfoName) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  const ch = channels[key];
  if (!ch) return;
  o.ChannelInfoName.textContent = ch.name || 'Unknown channel';
  o.ChannelInfoEpg.textContent = 'EPG not available';
  o.ChannelInfoLogo.innerHTML = ch.logo ? `<img src="${ch.logo}" alt="${ch.name}" onerror="this.style.display='none'">` : '';
  o.ChannelInfo.classList.add('visible');
  channelNameTimeout = setTimeout(hideChannelName, 4500);
}
function hideChannelName() { if (o.ChannelInfo) o.ChannelInfo.classList.remove('visible'); }

/* -------------------------
   Build Groups & Channels UI
   ------------------------- */
function buildDynamicGroupNav() {
  if (!o.DynamicGroupsList || !o.GroupList) return;
  const allGroups = new Set(Object.values(channels).flatMap(c => c.group || []));
  const sorted = [...allGroups].sort();
  o.DynamicGroupsList.innerHTML = '';

  const liFav = document.createElement('li'); liFav.dataset.group = '__fav'; liFav.textContent = 'FAVORITES';
  const liAll = document.createElement('li'); liAll.dataset.group = '__all'; liAll.textContent = 'ALL CHANNELS';
  o.DynamicGroupsList.appendChild(liFav); o.DynamicGroupsList.appendChild(liAll);

  sorted.forEach(g => {
    const li = document.createElement('li');
    li.dataset.group = g;
    li.textContent = g.toUpperCase();
    o.DynamicGroupsList.appendChild(li);
  });

  // bind all top-level li handlers inside GroupList (keeps index mapping simple)
  const allLis = $$('li', o.GroupList);
  allLis.forEach((li, idx) => {
    li.onclick = () => {
      // only groups have data-group (guide/epg are header items)
      if (li.dataset.group) {
        selectGroup(idx);
      } else if (li.id === 'guide_button') showGuide();
      else if (li.id === 'epg_button') showEpg();
    };
  });
}
function selectGroup(index) {
  const lis = $$('li', o.GroupList);
  if (!lis[index] || !lis[index].dataset.group) return;
  sSelectedGroup = lis[index].dataset.group;
  iGroupListIndex = index;
  buildNav();
  iChannelListIndex = 0;
  iActiveChannelIndex = 0;
  updateSelectedChannelInNav();
  // animate back to channel list (mirror user flow)
  showChannels(); // switch view (keeps nav open)
}

/* Filter + render channels */
function buildNav() {
  if (!o.ChannelList || !o.SearchField) return;
  const term = (o.SearchField.value || '').toLowerCase();

  aFilteredChannelKeys = Object.keys(channels).filter(k => {
    const ch = channels[k];
    if (!ch || typeof ch.name !== 'string') return false;
    const inGroup = sSelectedGroup === '__all' || (sSelectedGroup === '__fav' && ch.favorite) || (Array.isArray(ch.group) && ch.group.includes(sSelectedGroup));
    const inSearch = !term || ch.name.toLowerCase().includes(term);
    return inGroup && inSearch;
  }).sort((a, b) => (channels[a].number || 0) - (channels[b].number || 0));

  // render
  o.ChannelList.innerHTML = '';
  if (aFilteredChannelKeys.length === 0) {
    o.ChannelList.innerHTML = `<li style="padding:16px; text-align:center; color:#888">No channels</li>`;
    return;
  }
  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, idx) => {
    const ch = channels[key];
    const li = document.createElement('li'); li.className = 'channel-item';
    li.dataset.key = key;
    li.onclick = () => {
      if (preventRapidToggle()) return;
      iChannelListIndex = idx;
      iActiveChannelIndex = idx;
      if (isSessionActive) loadChannel(idx);
      else updateSelectedChannelInNav();
      setTimeout(hideNav, 60);
    };
    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
    const logoHtml = ch.logo ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'"></div>` : `<div class="nav_logo"></div>`;
    li.innerHTML = `${fav}<span class="list-ch">${ch.number || '?'}</span><span class="list-title">${ch.name}</span>${logoHtml}`;
    frag.appendChild(li);
  });
  o.ChannelList.appendChild(frag);
  updateSelectedChannelInNav();
}

/* Visual selection */
function updateSelectedChannelInNav() {
  const items = $$('.channel-item', o.ChannelList);
  items.forEach(i => i.classList.remove('selected', 'playing'));
  if (iChannelListIndex >= 0 && items[iChannelListIndex]) items[iChannelListIndex].classList.add('selected');
  if (iActiveChannelIndex >= 0 && items[iActiveChannelIndex]) items[iActiveChannelIndex].classList.add('playing');
  if (navState === 'channels' && items[iChannelListIndex] && typeof items[iChannelListIndex].scrollIntoView === 'function') {
    items[iChannelListIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
function updateSelectedGroupInNav() {
  const items = $$('li', o.GroupList);
  items.forEach(i => i.classList.remove('selected'));
  if (iGroupListIndex >= 0 && items[iGroupListIndex]) {
    items[iGroupListIndex].classList.add('selected');
    if (navState === 'groups' && typeof items[iGroupListIndex].scrollIntoView === 'function') {
      items[iGroupListIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

/* -------------------------
   JW Player integration
   - controls disabled, pointer events blocked
   - we still use playerInstance API for loading/play
   ------------------------- */
function initJWPlayer() {
  // safe guard
  if (!o.PlayerDiv) {
    console.error("JW player container #player not found.");
    return;
  }

  // instantiate player with no item initially; controls disabled
  playerInstance = jwplayer('player').setup({
    file: '',                 // loaded later
    autostart: false,
    mute: false,
    controls: false,          // hide UI
    width: '100%',
    height: '100%',
    playbackRateControls: false,
    displaytitle: false,
    displaydescription: false,
    repeat: false
  });

  // prevent jw UI interactions (context menu / pointer / clicks)
  o.PlayerDiv.style.pointerEvents = 'none';
  o.PlayerDiv.addEventListener('contextmenu', e => e.preventDefault());
  // block JW keyboard handling on the player element but not global remote keys
  o.PlayerDiv.addEventListener('keydown', e => e.stopImmediatePropagation(), true);

  // JW events
  playerInstance.on('ready', () => {
    // ready, but we don't auto play until user first play
    // ensure JW logo or overlays hidden by CSS (controls:false usually hides)
    // remove jw logo if present
    setTimeout(() => {
      const logo = o.PlayerDiv.querySelector('.jw-logo'); if (logo) logo.style.display = 'none';
    }, 200);
  });

  playerInstance.on('play', () => {
    bHasPlayedOnce = true;
    showLoader(false);
  });

  playerInstance.on('error', (err) => {
    console.error('JW Player error', err);
    showTempMessage('Playback error');
    showIdleAnimation(true);
    showLoader(false);
  });

  // Stream info updates (approx from player API)
  playerInstance.on('buffer', (evt) => {
    if (evt.bufferPercent < 100) showLoader(true);
  });

  // keep search and nav wired
  buildDynamicGroupNav();
  buildNav();
}

/* Load channel by index (safe, wraps JW load/play) */
async function loadChannel(index, { isFirstPlay = false } = {}) {
  if (!playerInstance) {
    console.error("Player not ready.");
    return;
  }
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    showIdleAnimation(true);
    return;
  }

  // normalize index
  index = ((index % aFilteredChannelKeys.length) + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
  iChannelListIndex = index;
  iActiveChannelIndex = index;
  updateSelectedChannelInNav();

  const key = aFilteredChannelKeys[index];
  const ch = channels[key];
  if (!ch) return showIdleAnimation(true);

  // save last watched
  try { localStorage.setItem('iptvLastWatched', key); } catch (e) {}

  // show loader and prepare play
  showLoader(true);
  hideChannelName();

  const item = { file: ch.manifestUri, type: ch.type === 'clearkey' ? 'dash' : 'hls' };

  // clearkey handling (best-effort): JW supports clearkeys via drm configuration on item
  if (ch.type === 'clearkey' && ch.keyId && ch.key) {
    try {
      item.drm = { clearkeys: { [ch.keyId]: ch.key } };
    } catch (e) { /* ignore if not supported */ }
  }

  try {
    playerInstance.load([ item ]);
    // autoplay when in session
    if (isSessionActive || isFirstPlay) {
      await playerInstance.play();
    }
    bHasPlayedOnce = true;
    showLoader(false);
    showChannelName();
  } catch (err) {
    console.error("Failed to load/play channel", err);
    showTempMessage('Stream failed');
    showLoader(false);
    showIdleAnimation(true);
  }
}

/* First play kick */
function handleFirstPlay() {
  if (isSessionActive) return;
  isSessionActive = true;
  hideIdleAnimation();

  if (aFilteredChannelKeys.length === 0) buildNav();
  if (aFilteredChannelKeys.length === 0) {
    showTempMessage('No channels available');
    isSessionActive = false;
    return;
  }

  iActiveChannelIndex = Math.max(0, iChannelListIndex || 0);
  loadChannel(iActiveChannelIndex, { isFirstPlay: true });
}

/* -------------------------
   Left panel state machine (user-specified flow)
   states: closed -> channels -> groups
   Left key: closed -> channels -> groups
   Right key: groups -> channels -> closed
   ------------------------- */
function showChannels() {
  if (!o.Nav || !o.ListContainer) return;
  navState = 'channels';
  o.Nav.classList.add('visible');
  o.ListContainer.classList.remove('groups-opened');
  updateSelectedChannelInNav();
  updateSelectedGroupInNav(); // keep selection consistent
}
function showGroups() {
  if (!o.Nav || !o.ListContainer) return;
  navState = 'groups';
  o.Nav.classList.add('visible');
  // Use CSS class defined in your CSS to translate container
  o.ListContainer.classList.add('groups-opened');
  updateSelectedGroupInNav();
}
function hideNav() {
  if (!o.Nav || navState === 'closed') return;
  navState = 'closed';
  o.Nav.classList.remove('visible');
  o.ListContainer.classList.remove('groups-opened');
  // focus back to player container
  o.PlayerContainer?.focus();
}

/* -------------------------
   Right panel toggles and other overlays (kept lean)
   ------------------------- */
function showChannelSettings() {
  if (!o.ChannelSettings) return;
  if (preventRapidToggle()) return;
  o.StreamInfoOverlay?.classList.remove('HIDDEN');
  o.ChannelSettings.classList.add('visible');
  pushOverlayState('channelSettings');
}
function hideChannelSettings() {
  o.StreamInfoOverlay?.classList.add('HIDDEN');
  o.ChannelSettings?.classList.remove('visible');
  popOverlayState();
  o.PlayerContainer?.focus();
}
function showGuide() {
  if (!o.Guide) return;
  o.BlurOverlay?.classList.add('visible');
  o.Guide.classList.remove('HIDDEN');
  pushOverlayState('guide');
}
function hideGuide() {
  o.Guide?.classList.add('HIDDEN');
  o.BlurOverlay?.classList.remove('visible');
  popOverlayState();
  o.PlayerContainer?.focus();
}
function showEpg() {
  if (!o.EpgOverlay) return;
  prepareEpg();
  o.EpgOverlay.classList.remove('HIDDEN');
  pushOverlayState('epg');
}
function hideEpg() {
  if (!o.EpgOverlay) return;
  o.EpgOverlay.classList.add('HIDDEN');
  popOverlayState();
  o.PlayerContainer?.focus();
}

/* EPG simple renderer */
function prepareEpg() {
  // populate filtered or fallback
  let keys = aFilteredChannelKeys.length ? [...aFilteredChannelKeys] : Object.keys(channels);
  o.EpgChannels.innerHTML = keys.map((k, i) => {
    const ch = channels[k];
    return `<div class="epg-ch-item">${ch.number || (i+1)}. ${ch.name || 'Unknown'}</div>`;
  }).join('');
  o.EpgTimeline.innerHTML = `<div style="padding:16px">EPG placeholder</div>`;
}

/* -------------------------
   Favorites store
   ------------------------- */
function loadFavoritesFromStorage() {
  try {
    const arr = JSON.parse(localStorage.getItem('iptvFavoriteChannels') || '[]');
    if (Array.isArray(arr)) {
      Object.keys(channels).forEach(k => channels[k].favorite = arr.includes(k));
    }
  } catch (e) { /* ignore */ }
}
function saveFavoritesToStorage() {
  try {
    const list = Object.entries(channels).filter(([k, ch]) => ch.favorite).map(([k]) => k);
    localStorage.setItem('iptvFavoriteChannels', JSON.stringify(list));
  } catch (e) { /* ignore */ }
}

/* -------------------------
   Overlay history helpers (simple)
   ------------------------- */
const overlayStack = [];
function pushOverlayState(name) { overlayStack.push(name); try { history.pushState({ overlay: name }, ''); } catch (e) {} }
function popOverlayState() { overlayStack.pop(); }

/* handle browser back to close overlays */
window.addEventListener('popstate', (ev) => {
  const top = overlayStack[overlayStack.length - 1];
  if (!top) return;
  switch (top) {
    case 'guide': hideGuide(); break;
    case 'epg': hideEpg(); break;
    case 'channelSettings': hideChannelSettings(); break;
    default: break;
  }
  if (overlayStack.length === 0) try { history.replaceState({}, ''); } catch(e){}
});

/* -------------------------
   Input handlers (keyboard + remote)
   ------------------------- */
document.addEventListener('keydown', (e) => {
  // If search focused, let it handle search navigation
  if (document.activeElement === o.SearchField) {
    if (e.key === 'Escape') { o.SearchField.blur(); updateSelectedChannelInNav(); }
    else if (e.key === 'Enter') { o.SearchField.blur(); buildNav(); updateSelectedChannelInNav(); }
    return;
  }

  // modal/overlay escapes first
  if (o.Guid && !o.Guide?.classList.contains('HIDDEN')) {
    if (e.key === 'Escape') hideGuide();
    return;
  }

  // Left/Right panel logic (explicit per spec)
  if (e.key === 'ArrowLeft') {
    // left pressed
    if (navState === 'closed') {
      // open channel list
      showChannels();
      buildNav();
    } else if (navState === 'channels') {
      // go to groups
      showGroups();
    } else {
      // already groups -> no-op
    }
    e.preventDefault();
    return;
  }
  if (e.key === 'ArrowRight') {
    // right pressed
    if (navState === 'groups') {
      // groups -> back to channels
      showChannels();
    } else if (navState === 'channels') {
      // channels -> close nav
      hideNav();
    } else {
      // nav closed -> no-op
    }
    e.preventDefault();
    return;
  }

  // navigation when nav open (channel up/down/select)
  if (navState === 'channels') {
    const items = $$('.channel-item', o.ChannelList);
    if (e.key === 'ArrowUp') {
      iChannelListIndex = Math.max(0, (iChannelListIndex - 1));
      updateSelectedChannelInNav();
      e.preventDefault();
      return;
    } else if (e.key === 'ArrowDown') {
      iChannelListIndex = Math.min(items.length - 1, iChannelListIndex + 1);
      updateSelectedChannelInNav();
      e.preventDefault();
      return;
    } else if (e.key === 'Enter') {
      if (aFilteredChannelKeys[iChannelListIndex]) {
        iActiveChannelIndex = iChannelListIndex;
        if (isSessionActive) loadChannel(iActiveChannelIndex);
        else updateSelectedChannelInNav();
        hideNav();
      }
      e.preventDefault();
      return;
    } else if (e.key === 'Escape') {
      hideNav();
      e.preventDefault();
      return;
    }
  }

  // global player keys (when no overlays)
  const playerKeys = ['Enter','ArrowUp','ArrowDown','h','e','m','Escape'];
  if (!playerKeys.includes(e.key)) return;
  e.preventDefault();
  switch (e.key) {
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iActiveChannelIndex - 1); break;
    case 'ArrowDown': loadChannel(iActiveChannelIndex + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': // close overlays
      hideNav(); hideChannelSettings(); hideGuide(); hideEpg(); break;
  }
});

/* -------------------------
   Mouse / touch handlers (kept minimal)
   ------------------------- */
(function attachBasicTouch() {
  // Play button tap
  o.PlayButton?.addEventListener('click', () => handleFirstPlay());
  o.PlayButton?.addEventListener('touchend', (ev) => { ev.preventDefault(); handleFirstPlay(); });

  // block right-click on entire page to avoid jw menu
  document.addEventListener('contextmenu', e => {
    // allow contextmenu only on inputs
    if (e.target && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
  });
})();

/* -------------------------
   Init sequence
   ------------------------- */
function init() {
  // number channels
  Object.keys(channels).forEach((k, i) => { channels[k].number = i + 1; channels[k].key = k; });

  // restore favorites
  loadFavoritesFromStorage();

  // prepare UI
  buildDynamicGroupNav();
  buildNav();
  updateSelectedGroupInNav();

  // init JW player (and wire events)
  initJWPlayer();

  // show idle
  showIdleAnimation(true);

  // restore last watched
  const last = localStorage.getItem('iptvLastWatched');
  if (last && Object.keys(channels).includes(last)) {
    const idx = Object.keys(channels).indexOf(last);
    if (idx >= 0) { iChannelListIndex = idx; iActiveChannelIndex = idx; updateSelectedChannelInNav(); }
  }

  // focus container for remote key events
  o.PlayerContainer?.setAttribute('tabindex', '-1');
  o.PlayerContainer?.focus();

  // wire search
  o.SearchField?.addEventListener('input', () => {
    buildNav();
    iChannelListIndex = 0;
    updateSelectedChannelInNav();
  });

  // small paint / layout fixes for submenu transitions: force reflow when needed
  const rc = o.SettingsContainer;
  if (rc) {
    rc.addEventListener('transitionend', () => { /* noop - keeps paint pipeline stable */ });
  }

  // DOM ready complete
}

/* execute when DOM is ready */
document.addEventListener('DOMContentLoaded', init);

/* expose some functions to global (for inline onclick in your HTML/CSS) */
window.handleFirstPlay = handleFirstPlay;
window.showGuide = showGuide;
window.hideGuide = hideGuide;
window.showEpg = showEpg;
window.hideEpg = hideEpg;
window.toggleFavourite = function toggleFavouriteGlobal() {
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  if (!key) return;
  channels[key].favorite = !channels[key].favorite;
  saveFavoritesToStorage();
  buildNav();
  renderChannelSettings?.(); // safe call if exists
};
