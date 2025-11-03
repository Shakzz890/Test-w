/* ============================
   Shakzz TV — Shaka Player script
   Cleaned, optimized, commented
   ============================ */

/* -------------------------
   DOM helpers & refs
   ------------------------- */
const $ = s => document.querySelector(s);
const $$ = (s, root = document) => Array.from((root || document).querySelectorAll(s));

const o = {
  PlayerContainer: $('#playerContainer'),
  AvPlayer: $('#avplayer'),
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
   Channels (copied/kept)
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
let player = null;                      // shaka player
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iChannelListIndex = 0;
let iActiveChannelIndex = 0;
let iGroupListIndex = 1;
let navState = 'closed';                // 'closed'|'channels'|'groups'
let isSessionActive = false;
let channelNameTimeout = null;
let loaderFadeTimeout = null;
let tempMessageTimeout = null;
let lastTap = 0;                        // for double-tap
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

/* small toggle throttle */
let lastToggleAt = 0;
const preventRapidToggle = (ms = 220) => {
  const now = Date.now();
  if (now - lastToggleAt < ms) return true;
  lastToggleAt = now;
  return false;
};

/* -------------------------
   UI helpers
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
function showIdleAnimation(showPlayButton = true) {
  if (!o.IdleAnimation) return;
  o.IdleAnimation.classList.remove('HIDDEN');
  if (o.PlayButton) {
    if (showPlayButton && !isSessionActive) o.PlayButton.classList.remove('HIDDEN');
    else o.PlayButton.classList.add('HIDDEN');
  }
}
function hideIdleAnimation() { if (o.IdleAnimation) o.IdleAnimation.classList.add('HIDDEN'); }
function showChannelName() {
  clearTimeout(channelNameTimeout);
  if (!o.ChannelInfo || !o.ChannelInfoName) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  const ch = channels[key];
  if (!ch) return;
  o.ChannelInfoName.textContent = ch.name || 'Unknown';
  o.ChannelInfoEpg.textContent = 'EPG not available';
  o.ChannelInfoLogo.innerHTML = ch.logo ? `<img src="${ch.logo}" alt="${ch.name}" onerror="this.style.display='none'">` : '';
  o.ChannelInfo.classList.add('visible');
  channelNameTimeout = setTimeout(hideChannelName, 4500);
}
function hideChannelName() { if (o.ChannelInfo) o.ChannelInfo.classList.remove('visible'); }

/* -------------------------
   Build groups and channel list
   ------------------------- */
function buildDynamicGroupNav() {
  if (!o.DynamicGroupsList || !o.GroupList) return;
  const groups = new Set(Object.values(channels).flatMap(ch => ch.group || []));
  const sorted = [...groups].sort();
  o.DynamicGroupsList.innerHTML = '';

  const fav = document.createElement('li'); fav.dataset.group = '__fav'; fav.textContent = 'FAVORITES';
  const all = document.createElement('li'); all.dataset.group = '__all'; all.textContent = 'ALL CHANNELS';
  o.DynamicGroupsList.appendChild(fav); o.DynamicGroupsList.appendChild(all);

  sorted.forEach(g => {
    const li = document.createElement('li');
    li.dataset.group = g;
    li.textContent = g.toUpperCase();
    o.DynamicGroupsList.appendChild(li);
  });

  // bind top-level list items (guide/epg included)
  const allLis = $$('li', o.GroupList);
  allLis.forEach((li, idx) => {
    li.onclick = () => {
      if (li.dataset.group) selectGroup(idx);
      else if (li.id === 'guide_button') showGuide();
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
  // show channel list after selecting
  showChannels();
}

function buildNav() {
  if (!o.ChannelList) return;
  const term = (o.SearchField?.value || '').toLowerCase();

  aFilteredChannelKeys = Object.keys(channels).filter(k => {
    const ch = channels[k];
    if (!ch || typeof ch.name !== 'string') return false;
    const inGroup = sSelectedGroup === '__all' || (sSelectedGroup === '__fav' && ch.favorite) || (Array.isArray(ch.group) && ch.group.includes(sSelectedGroup));
    const inSearch = !term || ch.name.toLowerCase().includes(term);
    return inGroup && inSearch;
  }).sort((a,b) => (channels[a].number || 0) - (channels[b].number || 0));

  o.ChannelList.innerHTML = '';
  if (!aFilteredChannelKeys.length) {
    o.ChannelList.innerHTML = `<li style="padding:16px; color:#888; text-align:center">No channels</li>`;
    return;
  }

  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, idx) => {
    const ch = channels[key];
    const li = document.createElement('li');
    li.className = 'channel-item';
    li.dataset.key = key;
    li.onclick = () => {
      if (preventRapidToggle()) return;
      iChannelListIndex = idx; iActiveChannelIndex = idx;
      if (isSessionActive) loadChannel(idx);
      else updateSelectedChannelInNav();
      setTimeout(hideNav, 60);
    };
    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
    const logo = ch.logo ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'"></div>` : `<div class="nav_logo"></div>`;
    li.innerHTML = `${fav}<span class="list-ch">${ch.number || '?'}</span><span class="list-title">${ch.name}</span>${logo}`;
    frag.appendChild(li);
  });
  o.ChannelList.appendChild(frag);
  updateSelectedChannelInNav();
}

/* Visual selection */
function updateSelectedChannelInNav() {
  const items = $$('.channel-item', o.ChannelList) || [];
  items.forEach(it => it.classList.remove('selected', 'playing'));
  if (items[iChannelListIndex]) items[iChannelListIndex].classList.add('selected');
  if (items[iActiveChannelIndex]) items[iActiveChannelIndex].classList.add('playing');
  if (navState === 'channels' && items[iChannelListIndex] && items[iChannelListIndex].scrollIntoView) {
    items[iChannelListIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
function updateSelectedGroupInNav() {
  const items = $$('li', o.GroupList) || [];
  items.forEach(i => i.classList.remove('selected'));
  if (items[iGroupListIndex]) {
    items[iGroupListIndex].classList.add('selected');
    if (navState === 'groups' && items[iGroupListIndex].scrollIntoView) items[iGroupListIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* -------------------------
   Shaka player init (no UI overlay)
   ------------------------- */
async function initPlayer() {
  // number channels
  Object.keys(channels).forEach((k,i) => { channels[k].number = i+1; channels[k].key = k; });

  loadFavoritesFromStorage();
  buildDynamicGroupNav();
  buildNav();
  updateSelectedGroupInNav();

  // show idle
  showIdleAnimation(true);

  // shaka polyfills
  try { await shaka.polyfill.installAll(); } catch(e) { console.warn('shaka polyfill error', e); }

  if (!shaka.Player.isBrowserSupported()) {
    console.error('Shaka not supported');
    return;
  }

  // create player attached to video element; we DO NOT use shaka.ui.Overlay
  player = new shaka.Player(o.AvPlayer);
  player.configure({
    manifest: { retryParameters: { maxAttempts: 2 } },
    streaming: { bufferingGoal: 3, rebufferingGoal: 1 },
    drm: {}
  });

  // disable click-to-play and other default behaviors on video
  o.AvPlayer.controls = false;
  o.AvPlayer.setAttribute('playsinline', '');
  o.PlayerContainer.style.pointerEvents = ''; // allow our own handlers
  // block right-click menu on player
  o.PlayerContainer?.addEventListener('contextmenu', e => e.preventDefault());

  // Shaka event wiring
  player.addEventListener('error', e => {
    console.error('Shaka Error', e.detail);
    showTempMessage('Playback error');
    showIdleAnimation(true);
    showLoader(false);
  });

  player.addEventListener('buffering', ev => {
    if (ev.buffering) showLoader(true);
    else showLoader(false);
  });

  player.addEventListener('adaptation', updateStreamInfo);
  player.addEventListener('streaming', updateStreamInfo);
  player.addEventListener('playing', () => { showLoader(false); bHasPlayedOnce = true; });

  // UI wiring
  bindControls();
}

/* -------------------------
   Load channel (shaka.load)
   ------------------------- */
async function loadChannel(index, opts = {}) {
  opts = opts || {};
  if (!player) return showIdleAnimation(true);
  if (!aFilteredChannelKeys.length) { buildNav(); if (!aFilteredChannelKeys.length) return showIdleAnimation(true); }

  // normalize index
  index = ((index % aFilteredChannelKeys.length) + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
  iChannelListIndex = index; iActiveChannelIndex = index;
  updateSelectedChannelInNav();

  const key = aFilteredChannelKeys[index];
  const ch = channels[key];
  if (!ch) return showIdleAnimation(true);

  try {
    localStorage.setItem('iptvLastWatched', key);
  } catch(e){}

  // show loader
  showLoader(true);
  hideChannelName();

  // clear old keys
  try { player.configure('drm.clearKeys', {}); } catch(e){}

  if (ch.type === 'clearkey' && ch.keyId && ch.key) {
    try { player.configure({ drm: { clearKeys: { [ch.keyId]: ch.key } } }); } catch(e){}
  }

  // optionally set user agent on networking engine (best-effort)
  try {
    player.getNetworkingEngine()?.clearAllRequestFilters();
    if (ch.userAgent) {
      player.getNetworkingEngine()?.registerRequestFilter((type, req) => { req.headers['User-Agent'] = ch.userAgent; });
    }
  } catch(e){}

  try {
    await player.load(ch.manifestUri);
    // autoplay if session active
    if (isSessionActive || opts.isFirstPlay) {
      try { await o.AvPlayer.play(); } catch(err) { console.warn('autoplay prevented', err); }
    }
    showLoader(false);
    showChannelName();
  } catch (err) {
    console.error('Load failed', err);
    showTempMessage('Stream failed');
    showLoader(false);
    showIdleAnimation(true);
  }
}

/* -------------------------
   First play
   ------------------------- */
function handleFirstPlay() {
  if (isSessionActive) return;
  isSessionActive = true;
  hideIdleAnimation();
  if (!aFilteredChannelKeys.length) buildNav();
  if (!aFilteredChannelKeys.length) { showTempMessage('No channels'); isSessionActive = false; return; }
  iActiveChannelIndex = Math.max(0, iChannelListIndex || 0);
  loadChannel(iActiveChannelIndex, { isFirstPlay: true });
}

/* -------------------------
   Left panel state machine
   ------------------------- */
function showChannels() {
  if (!o.Nav || !o.ListContainer) return;
  navState = 'channels';
  o.Nav.classList.add('visible');
  o.ListContainer.classList.remove('groups-opened');
  updateSelectedChannelInNav();
  updateSelectedGroupInNav();
}
function showGroups() {
  if (!o.Nav || !o.ListContainer) return;
  navState = 'groups';
  o.Nav.classList.add('visible');
  o.ListContainer.classList.add('groups-opened');
  updateSelectedGroupInNav();
}
function hideNav() {
  if (!o.Nav) return;
  navState = 'closed';
  o.Nav.classList.remove('visible');
  o.ListContainer.classList.remove('groups-opened');
  o.PlayerContainer?.focus();
}

/* -------------------------
   Right panel & modals (lean)
   ------------------------- */
function renderChannelSettings() {
  if (!o.SettingsMainMenu) return;
  // simple settings with PIP button
  o.SettingsMainMenu.innerHTML = `
    <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
    <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
    <div class="settings-item" id="pip_button" onclick="togglePip()">Picture-in-Picture</div>
    <div class="settings-item" onclick="toggleFavourite()"> ${getActiveChannel()?.favorite ? 'Remove from Favorites' : 'Add to Favorites'} </div>
  `;
}
function showChannelSettings() {
  if (!o.ChannelSettings) return;
  if (preventRapidToggle()) return;
  renderChannelSettings();
  o.StreamInfoOverlay?.classList.remove('HIDDEN');
  o.ChannelSettings.classList.add('visible');
  pushOverlayState('channelSettings');
}
function hideChannelSettings() {
  o.StreamInfoOverlay?.classList.add('HIDDEN');
  o.ChannelSettings.classList.remove('visible');
  popOverlayState();
  o.PlayerContainer?.focus();
}

/* minimal settings modal stubs (kept from your previous logic) */
function showSettingsModal(type) {
  if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) return;
  o.BlurOverlay.classList.add('visible');
  o.SettingsModalContent.innerHTML = renderModalContent(type);
  o.SettingsModal.classList.remove('HIDDEN');
  pushOverlayState('settingsModal');
}
window.hideSettingsModal = () => {
  o.SettingsModal?.classList.add('HIDDEN');
  o.BlurOverlay?.classList.remove('visible');
  popOverlayState();
  o.PlayerContainer?.focus();
};

/* reuse previous modal rendering functions (quality/format/subtitles/edit) */
function renderModalContent(type) {
  // short safe fallback so your existing modal UI still works
  if (type === 'format') {
    return `<h2>Video Format</h2><ul class="popup-content-list">
      <li class="modal-selectable" onclick="applyFormatAndClose('original')">Original</li>
      <li class="modal-selectable" onclick="applyFormatAndClose('fill')">Fill</li>
      <li class="modal-selectable" onclick="applyFormatAndClose('zoom')">Zoom</li>
    </ul><div class="popup-buttons"><button onclick="hideSettingsModal()">CLOSE</button></div>`;
  }
  if (type === 'subtitles') {
    return `<h2>Subtitles</h2><div style="padding:16px">No subtitles available</div><div class="popup-buttons"><button onclick="hideSettingsModal()">CLOSE</button></div>`;
  }
  return `<div style="padding:16px">No options</div><div class="popup-buttons"><button onclick="hideSettingsModal()">CLOSE</button></div>`;
}
window.applyFormatAndClose = (v) => { setAspectRatio(v); hideSettingsModal(); };

/* -------------------------
   Simple helpers
   ------------------------- */
function getActiveChannel() {
  return channels[aFilteredChannelKeys[iActiveChannelIndex]];
}
function toggleFavourite() {
  const key = aFilteredChannelKeys[iActiveChannelIndex];
  if (!key) return;
  channels[key].favorite = !channels[key].favorite;
  saveFavoritesToStorage();
  buildNav();
  renderChannelSettings();
}

/* -------------------------
   PIP functionality
   ------------------------- */
async function togglePip() {
  try {
    // if in PiP -> exit
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }
    // if video supports PiP
    if (o.AvPlayer && typeof o.AvPlayer.requestPictureInPicture === 'function') {
      await o.AvPlayer.requestPictureInPicture();
      return;
    }
    showTempMessage('PIP not supported');
  } catch (e) {
    console.warn('PiP error', e);
    showTempMessage('PIP failed');
  }
}

/* -------------------------
   Fullscreen toggle (double-tap)
   ------------------------- */
function toggleFullScreen() {
  const doc = document;
  if (!doc.fullscreenElement) {
    (doc.documentElement.requestFullscreen && doc.documentElement.requestFullscreen()) ||
    (doc.documentElement.webkitRequestFullscreen && doc.documentElement.webkitRequestFullscreen()) ||
    (doc.documentElement.mozRequestFullScreen && doc.documentElement.mozRequestFullScreen()) ||
    (doc.documentElement.msRequestFullscreen && doc.documentElement.msRequestFullscreen());
  } else {
    (doc.exitFullscreen && doc.exitFullscreen()) ||
    (doc.webkitExitFullscreen && doc.webkitExitFullscreen()) ||
    (doc.mozCancelFullScreen && doc.mozCancelFullScreen()) ||
    (doc.msExitFullscreen && doc.msExitFullscreen());
  }
}

/* -------------------------
   Stream info overlay
   ------------------------- */
function updateStreamInfo() {
  if (!o.StreamInfoOverlay || !player) return;
  try {
    const variant = (player.getVariantTracks() || []).find(t => t.active);
    if (!variant) { o.StreamInfoOverlay.innerHTML = 'Stream Info: N/A'; return; }
    const codecs = variant.codecs || 'N/A';
    const res = `${variant.width || 0}x${variant.height || 0}`;
    const bw = variant.bandwidth ? (variant.bandwidth / 1e6).toFixed(2) : 'N/A';
    o.StreamInfoOverlay.innerHTML = `Codecs: ${codecs}\nResolution: ${res}\nBandwidth: ${bw} Mbit/s`;
  } catch (e) { o.StreamInfoOverlay.innerHTML = 'Stream Info: N/A'; }
}

/* -------------------------
   Key & touch handlers (left/right/tap/double-tap)
   ------------------------- */
function bindControls() {
  // play button
  o.PlayButton?.addEventListener('click', handleFirstPlay);
  o.PlayButton?.addEventListener('touchend', (ev) => { ev.preventDefault(); handleFirstPlay(); });

  // search input
  o.SearchField?.addEventListener('input', () => { buildNav(); iChannelListIndex = 0; updateSelectedChannelInNav(); });

  // keyboard
  document.addEventListener('keydown', (e) => {
    // search focused shortcuts
    if (document.activeElement === o.SearchField) {
      if (e.key === 'Escape') { o.SearchField.blur(); updateSelectedChannelInNav(); }
      if (e.key === 'Enter') { o.SearchField.blur(); buildNav(); updateSelectedChannelInNav(); }
      return;
    }

    // overlay close priority
    if (o.Guide && !o.Guide.classList.contains('HIDDEN') && e.key === 'Escape') { hideGuide(); return; }
    if (o.SettingsModal && !o.SettingsModal.classList.contains('HIDDEN') && e.key === 'Escape') { window.hideSettingsModal(); return; }
    if (o.EpgOverlay && !o.EpgOverlay.classList.contains('HIDDEN') && e.key === 'Escape') { hideEpg(); return; }

    // left/right panel behavior
    if (e.key === 'ArrowLeft') {
      if (navState === 'closed') { showChannels(); buildNav(); }
      else if (navState === 'channels') { showGroups(); }
      // if groups already open -> noop
      e.preventDefault(); return;
    }
    if (e.key === 'ArrowRight') {
      if (navState === 'groups') { showChannels(); }
      else if (navState === 'channels') { hideNav(); }
      e.preventDefault(); return;
    }

    // when nav open and in channel list: up/down/enter navigation
    if (navState === 'channels') {
      const items = $$('.channel-item', o.ChannelList);
      if (['ArrowUp','ArrowDown','Enter','Escape'].includes(e.key)) {
        if (e.key === 'ArrowUp') { iChannelListIndex = Math.max(0, iChannelListIndex - 1); updateSelectedChannelInNav(); }
        if (e.key === 'ArrowDown') { iChannelListIndex = Math.min(items.length - 1, iChannelListIndex + 1); updateSelectedChannelInNav(); }
        if (e.key === 'Enter') { iActiveChannelIndex = iChannelListIndex; if (isSessionActive) loadChannel(iActiveChannelIndex); else updateSelectedChannelInNav(); hideNav(); }
        if (e.key === 'Escape') { hideNav(); }
        e.preventDefault(); return;
      }
    }

    // global keys
    if (['Enter','ArrowUp','ArrowDown','h','e','m','p','P','Escape'].includes(e.key)) {
      e.preventDefault();
      switch (e.key) {
        case 'Enter': showChannelName(); break;
        case 'ArrowUp': loadChannel(iActiveChannelIndex - 1); break;
        case 'ArrowDown': loadChannel(iActiveChannelIndex + 1); break;
        case 'h': showGuide(); break;
        case 'e': showEpg(); break;
        case 'm': showChannelSettings(); break;
        case 'p': case 'P': togglePip(); break;
        case 'Escape': hideNav(); hideChannelSettings(); hideGuide(); hideEpg(); break;
      }
    }
  });

  /* Touch / swipe handlers (supports mobile gestures) */
  o.PlayerContainer?.addEventListener('touchstart', (ev) => {
    if (ev.touches.length !== 1) return;
    touchStartX = ev.touches[0].clientX; touchStartY = ev.touches[0].clientY;
    touchEndX = touchStartX; touchEndY = touchStartY;
  }, { passive: true });

  o.PlayerContainer?.addEventListener('touchmove', (ev) => {
    if (ev.touches.length !== 1) return;
    touchEndX = ev.touches[0].clientX; touchEndY = ev.touches[0].clientY;
  }, { passive: true });

  o.PlayerContainer?.addEventListener('touchend', (ev) => {
    const dx = touchEndX - touchStartX, dy = touchEndY - touchStartY;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    const SWIPE = 40, TAP = 12;
    // swipe horizontal/vertical
    if (absX > SWIPE || absY > SWIPE) {
      const startedInNav = !!ev.target.closest?.('#nav');
      if (!startedInNav) {
        if (absX > absY) {
          if (dx < 0) { // swipe left
            // same as pressing LEFT while nav closed/open mapping:
            if (navState === 'closed') { showChannels(); buildNav(); }
            else if (navState === 'channels') showGroups();
            // if groups open -> noop
          } else { // swipe right
            if (navState === 'groups') showChannels();
            else if (navState === 'channels') hideNav();
          }
        } else {
          // vertical swipe changes channels if no nav open
          if (navState === 'closed') {
            if (dy > 0) loadChannel(iActiveChannelIndex + 1);
            else loadChannel(iActiveChannelIndex - 1);
          }
        }
      }
      return;
    }

    // tap / double-tap detection (anywhere on video)
    const now = Date.now();
    if (now - lastTap < 300) { // double-tap
      lastTap = 0;
      toggleFullScreen();
    } else {
      lastTap = now;
      // single tap: show channel name or close overlays
      setTimeout(() => {
        if (Date.now() - lastTap >= 300) {
          // if any overlay open -> clear UI else show channel name
          if (navState !== 'closed' || o.ChannelSettings?.classList.contains('visible') || !o.SettingsModal?.classList.contains('HIDDEN')) {
            clearUi();
          } else {
            showChannelName();
          }
          lastTap = 0;
        }
      }, 320);
    }
  }, { passive: false });

  // mouse double-click -> fullscreen
  o.PlayerContainer?.addEventListener('dblclick', (e) => { e.preventDefault(); toggleFullScreen(); });
}

/* -------------------------
   Clear UI / overlays
   ------------------------- */
function clearUi() {
  hideNav(); hideChannelSettings(); hideGuide(); hideEpg();
  window.hideSettingsModal?.();
  // hide temp messages
  if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) {
    clearTimeout(tempMessageTimeout);
    o.TempMessageOverlay.classList.remove('visible');
    o.TempMessageOverlay.classList.add('HIDDEN');
  }
  o.PlayerContainer?.focus();
}

/* Guide & EPG (kept simple) */
window.showGuide = () => {
  if (!o.Guide) return;
  clearUi();
  o.BlurOverlay?.classList.add('visible');
  o.Guide.classList.remove('HIDDEN');
  o.GuideContent.innerHTML = `<h2>Controls</h2><ul style="padding:0 16px"><li>← Open list</li><li>← (again) Groups</li><li>→ Back/Close</li><li>Double-tap: Fullscreen</li><li>P: PIP</li></ul>`;
  pushOverlayState('guide');
};
window.hideGuide = () => { o.Guide?.classList.add('HIDDEN'); o.BlurOverlay?.classList.remove('visible'); popOverlayState(); o.PlayerContainer?.focus(); };

function showEpg() {
  if (!o.EpgOverlay) return;
  clearUi();
  prepareEpg();
  o.EpgOverlay.classList.remove('HIDDEN');
  pushOverlayState('epg');
}
function hideEpg() { o.EpgOverlay.classList.add('HIDDEN'); popOverlayState(); o.PlayerContainer?.focus(); }
function prepareEpg() {
  const keys = aFilteredChannelKeys.length ? aFilteredChannelKeys : Object.keys(channels);
  o.EpgChannels.innerHTML = keys.map((k,i) => `<div class="epg-ch-item">${channels[k].number || i+1}. ${channels[k].name}</div>`).join('');
  o.EpgTimeline.innerHTML = `<div style="padding:16px">EPG placeholder</div>`;
}

/* -------------------------
   Favorites store
   ------------------------- */
function loadFavoritesFromStorage() {
  try {
    const arr = JSON.parse(localStorage.getItem('iptvFavoriteChannels') || '[]');
    if (Array.isArray(arr)) Object.keys(channels).forEach(k => channels[k].favorite = arr.includes(k));
  } catch(e){}
}
function saveFavoritesToStorage() {
  try {
    const list = Object.entries(channels).filter(([,ch]) => ch.favorite).map(([k]) => k);
    localStorage.setItem('iptvFavoriteChannels', JSON.stringify(list));
  } catch(e){}
}

/* -------------------------
   History helpers for overlays
   ------------------------- */
const overlayStack = [];
function pushOverlayState(name) { overlayStack.push(name); try { history.pushState({ overlay:name }, ''); } catch(e){} }
function popOverlayState() { overlayStack.pop(); }

/* close overlays on back */
window.addEventListener('popstate', () => {
  const top = overlayStack[overlayStack.length-1];
  if (!top) return;
  if (top === 'guide') hideGuide();
  if (top === 'epg') hideEpg();
  if (top === 'channelSettings') hideChannelSettings();
  if (overlayStack.length === 0) try { history.replaceState({}, ''); } catch(e){}
});

/* -------------------------
   Init
   ------------------------- */
function init() {
  // number channels
  Object.keys(channels).forEach((k,i) => { channels[k].number = i+1; channels[k].key = k; });

  loadFavoritesFromStorage();
  buildDynamicGroupNav();
  buildNav();
  updateSelectedGroupInNav();

  initPlayer();

  // restore last watched
  const last = localStorage.getItem('iptvLastWatched');
  if (last && Object.keys(channels).includes(last)) {
    const idx = aFilteredChannelKeys.indexOf(last);
    if (idx >= 0) { iChannelListIndex = idx; iActiveChannelIndex = idx; updateSelectedChannelInNav(); }
  }

  // expose some globals for inline HTML handlers
  window.handleFirstPlay = handleFirstPlay;
  window.togglePip = togglePip;
  window.showEpg = showEpg;
  window.showChannelSettings = showChannelSettings;
  window.hideChannelSettings = hideChannelSettings;
  window.toggleFavourite = toggleFavourite;
  window.showSettingsModal = showSettingsModal;
  window.hideSettingsModal = window.hideSettingsModal;

  // focus player for remote keys
  o.PlayerContainer?.setAttribute('tabindex','-1');
  o.PlayerContainer?.focus();
}

/* run on DOM ready */
document.addEventListener('DOMContentLoaded', init);

