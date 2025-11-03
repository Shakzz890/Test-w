const qs = (sel, root = document) => (root || document).querySelector(sel);
const qsa = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

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
   Channels (kept exactly as you provided)
   ------------------------- */
let channels = {
  KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
  StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
  SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
  SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
  Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
  anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
  aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"] },
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
let player = null, ui = null;
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iChannelListIndex = 0, iActiveChannelIndex = 0, iGroupListIndex = 1;
let isSessionActive = false;
let loaderFadeTimeout = null, tempMessageTimeout = null, channelNameTimeout = null;
let bHasPlayedOnce = false;

/* Panels state:
   navState: 0 = closed, 1 = channels, 2 = groups
   settingsOpen: false/true
*/
let navState = 0;
let settingsOpen = false;

/* overlay stack for back handling */
const overlayStack = [];
function pushOverlayState(name) {
  if (overlayStack.length === 0 && ui) try { ui.configure({ showBuffering: false }); } catch {}
  overlayStack.push(name);
  try { history.pushState({ overlay: name }, ''); } catch(e){}
}
function popOverlayState() {
  overlayStack.pop();
  if (overlayStack.length === 0 && ui) try { ui.configure({ showBuffering: true }); } catch {}
}

/* debounce toggle */
let lastToggleAt = 0;
function preventRapidToggle(ms = 300) {
  const now = Date.now();
  if (now - lastToggleAt < ms) return true;
  lastToggleAt = now;
  return false;
}

/* -------------------------
   Utilities
   ------------------------- */
const getEl = id => document.getElementById(id);
function showTempMessage(msg, ms = 3000) {
  if (!o.TempMessageOverlay) return;
  clearTimeout(tempMessageTimeout);
  o.TempMessageOverlay.textContent = msg;
  o.TempMessageOverlay.classList.remove('HIDDEN');
  o.TempMessageOverlay.classList.add('visible');
  tempMessageTimeout = setTimeout(() => {
    o.TempMessageOverlay.classList.remove('visible');
    setTimeout(() => o.TempMessageOverlay.classList.add('HIDDEN'), 300);
  }, ms);
}

/* -------------------------
   Shaka Player init (kept from your version)
   ------------------------- */
async function initPlayer() {
  Object.keys(channels).forEach((key, i) => { channels[key].number = i+1; channels[key].key = key; });
  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav();
  sSelectedGroup = '__all';
  buildNav();
  updateSelectedGroupInNav();

  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) { console.error("Browser not supported"); return; }

  player = new shaka.Player();
  ui = new shaka.ui.Overlay(player, o.PlayerContainer || document.body, o.AvPlayer || document.createElement('video'));
  ui.configure({ controlPanelElements: [], addSeekBar: false, addBigPlayButton: false, showBuffering: true, clickToPlay: false });

  if (o.AvPlayer) player.attach(o.AvPlayer);
  player.configure({ abr: { defaultBandwidthEstimate: 500000 }, streaming: { rebufferingGoal:2, bufferingGoal:3 } });

  player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    const isNetworkOrMediaError = [shaka.util.Error.Category.NETWORK, shaka.util.Error.Category.MEDIA, shaka.util.Error.Category.STREAMING].includes(e.detail.category);
    if (!isNetworkOrMediaError) showIdleAnimation(true);
    if (o.ChannelLoader) { clearTimeout(loaderFadeTimeout); o.ChannelLoader.classList.add('HIDDEN'); o.ChannelLoader.style.opacity='1'; o.ChannelLoader.classList.remove('fade-out'); }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  });

  player.addEventListener('trackschanged', renderChannelSettings);
  player.addEventListener('buffering', ev => {
    if (ev.buffering) {
      if (!bHasPlayedOnce && o.ChannelLoader) { o.ChannelLoader.classList.remove('HIDDEN'); o.ChannelLoader.classList.remove('fade-out'); o.ChannelLoader.style.opacity='1'; }
    } else hideLoaderAndShowVideo();
  });
  player.addEventListener('playing', () => { bHasPlayedOnce = true; hideLoaderAndShowVideo(); });
  player.addEventListener('adaptation', updateStreamInfo);
  player.addEventListener('streaming', updateStreamInfo);

  setupControls();
  showIdleAnimation(true);
  loadInitialChannel();
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

/* Loader helper */
function hideLoaderAndShowVideo() {
  clearTimeout(loaderFadeTimeout);
  if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  if (o.ChannelLoader && !o.ChannelLoader.classList.contains('HIDDEN')) {
    o.ChannelLoader.classList.add('fade-out');
    loaderFadeTimeout = setTimeout(() => {
      if (o.ChannelLoader) { o.ChannelLoader.classList.add('HIDDEN'); o.ChannelLoader.style.opacity='1'; o.ChannelLoader.classList.remove('fade-out'); }
    }, 500);
  }
}

/* -------------------------
   Controls (touch/click/keyboard)
   ------------------------- */
function setupControls() {
  const playerContainer = o.PlayerContainer || document.body;
  let touchStartX=0, touchStartY=0, touchEndX=0, touchEndY=0, lastTap=0;

  playerContainer.addEventListener('touchstart', e => {
    if (e.touches.length === 1) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; touchEndX=touchStartX; touchEndY=touchStartY; }
  }, { passive: true });

  playerContainer.addEventListener('touchmove', e => {
    if (e.touches.length === 1) { touchEndX = e.touches[0].clientX; touchEndY = e.touches[0].clientY; }
  }, { passive: true });

  playerContainer.addEventListener('touchend', e => {
    if (e.changedTouches.length !== 1) return;
    const dx = touchEndX - touchStartX, dy = touchEndY - touchStartY;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    const SWIPE = 50, TAP = 15;
    if (adx > SWIPE || ady > SWIPE) {
      if (adx > ady) {
        if (dx < 0) { /* left swipe */ navCycleLeft(); } else { /* right swipe */ navCycleRight(); }
      } else {
        if (dy < 0) loadChannel(iActiveChannelIndex - 1); else loadChannel(iActiveChannelIndex + 1);
      }
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
    }
    // tap / double tap
    if (adx < TAP && ady < TAP) {
      const now = Date.now();
      if (now - lastTap < 300) { lastTap = 0; toggleFullScreen(); }
      else { lastTap = now; setTimeout(() => { if (Date.now() - lastTap >= 300) handleSingleTap(); }, 320); }
    }
    touchStartX = touchStartY = touchEndX = touchEndY = 0;
  }, { passive: false });

  playerContainer.addEventListener('click', e => {
    // ignore clicks inside UI panels
    if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay') || e.target.closest('#PlayButton'))) return;
    handleSingleTap();
  });

  if (o.PlayButton) {
    o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
    o.PlayButton.removeEventListener('touchend', handleFirstPlay);
    o.PlayButton.addEventListener('touchend', ev => { ev.preventDefault(); handleFirstPlay(); });
  }

  if (o.SearchField) {
    o.SearchField.addEventListener('input', () => { buildNav(); if (aFilteredChannelKeys.length>0) { iChannelListIndex=0; updateSelectedChannelInNav(); } });
  } else console.warn("SearchField element not found.");

  const guideBtn = getEl('guide_button'); if (guideBtn) guideBtn.onclick = () => showGuide();
  const epgBtn = getEl('epg_button'); if (epgBtn) epgBtn.onclick = () => showEpg();
}

function handleSingleTap() {
  if (!isSessionActive) return;
  if (navState !== 0 || settingsOpen || overlayStack.length>0) clearUi();
  else showChannelName();
}

/* -------------------------
   Channel load / nav builders
   (kept your logic)
   ------------------------- */
function loadInitialChannel() {
  const storedLast = localStorage.getItem('iptvLastWatched');
  let initialChannelKey = 'SonictheHedgehog';
  if (!channels[initialChannelKey]) initialChannelKey = Object.keys(channels)[0];
  if (!initialChannelKey) { console.error("No channels defined."); return; }

  if (aFilteredChannelKeys.length === 0) { sSelectedGroup='__all'; buildNav(); if (aFilteredChannelKeys.length===0) { console.error("No channels available"); return; } }

  if (storedLast && channels[storedLast] && aFilteredChannelKeys.includes(storedLast)) initialChannelKey = storedLast;
  else if (!aFilteredChannelKeys.includes(initialChannelKey)) initialChannelKey = aFilteredChannelKeys[0];

  const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
  iChannelListIndex = initialIndex >= 0 ? initialIndex : 0;
  iActiveChannelIndex = iChannelListIndex;
  updateSelectedChannelInNav();
}

async function loadChannel(index, options={}) {
  clearTimeout(loaderFadeTimeout);
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    try { await player?.unload(); } catch {}
    showIdleAnimation(!isSessionActive);
    return;
  }

  iChannelListIndex = (index < 0) ? (aFilteredChannelKeys.length - 1) : (index % aFilteredChannelKeys.length);
  iActiveChannelIndex = iChannelListIndex;
  const channelKey = aFilteredChannelKeys[iChannelListIndex];
  if (!channelKey || !channels[channelKey]) { console.error("Invalid channel key", channelKey); showIdleAnimation(!isSessionActive); return; }
  const channel = channels[channelKey];

  if (!player) { console.error("Player not initialized"); return; }

  localStorage.setItem('iptvLastWatched', channelKey);

  if (!options.isFirstPlay && o.AvPlayer) o.AvPlayer.style.opacity = '0';
  if (o.ChannelLoader) { o.ChannelLoader.classList.remove('fade-out'); o.ChannelLoader.style.opacity='1'; o.ChannelLoader.classList.remove('HIDDEN'); }

  hideChannelName();
  updateSelectedChannelInNav();

  try {
    player.configure('drm.clearKeys', {});
    if (channel.type === 'clearkey' && channel.keyId && channel.key) {
      player.configure({ drm: { clearKeys: { [channel.keyId]: channel.key } } });
    }
    player.getNetworkingEngine()?.clearAllRequestFilters();
    if (channel.userAgent) player.getNetworkingEngine()?.registerRequestFilter((type, request) => { request.headers['User-Agent'] = channel.userAgent; });

    if (isSessionActive && o.AvPlayer) o.AvPlayer.muted = false;
    if (o.ChannelLoader) o.ChannelLoader.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg')";

    bHasPlayedOnce = false;
    await player.load(channel.manifestUri);

    if (o.PlayerContainer) o.PlayerContainer.focus();
    if (isSessionActive) { if (o.AvPlayer) o.AvPlayer.play().catch(e => console.warn("Autoplay prevented", e)); showChannelName(); }
  } catch (err) {
    console.error("Error loading channel:", err);
    showIdleAnimation(!isSessionActive);
    if (o.ChannelLoader) { clearTimeout(loaderFadeTimeout); o.ChannelLoader.classList.add('HIDDEN'); o.ChannelLoader.style.opacity='1'; o.ChannelLoader.classList.remove('fade-out'); }
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
  }
}

/* -------------------------
   Nav builders (group/channel lists)
   ------------------------- */
function setupMainMenuControls() {
  const guideBtn = getEl('guide_button'); if (guideBtn) guideBtn.onclick = () => showGuide();
  const epgBtn = getEl('epg_button'); if (epgBtn) epgBtn.onclick = () => showEpg();
  if (o.PlayButton) { o.PlayButton.removeEventListener('mousedown', handleFirstPlay); o.PlayButton.addEventListener('mousedown', handleFirstPlay); }
}

function buildDynamicGroupNav() {
  if (!o.DynamicGroupsList || !o.GroupList) return;
  const allGroups = new Set(Object.values(channels).flatMap(ch=>ch?.group||[]));
  const sorted = [...allGroups].sort();
  o.DynamicGroupsList.innerHTML = '';
  const favLi = document.createElement('li'); favLi.dataset.group='__fav'; favLi.textContent='FAVORITES'; o.DynamicGroupsList.appendChild(favLi);
  const allLi = document.createElement('li'); allLi.dataset.group='__all'; allLi.textContent='ALL CHANNELS'; o.DynamicGroupsList.appendChild(allLi);
  sorted.forEach(g => { const li = document.createElement('li'); li.dataset.group=g; li.textContent = g.toUpperCase(); o.DynamicGroupsList.appendChild(li); });

  // attach clicks for existing left-panel markup (GroupList)
  const fullGroupListItems = qsa('li', o.GroupList);
  fullGroupListItems.forEach((li, idx) => {
    li.onclick = null;
    if (li.hasAttribute('data-group')) li.onclick = () => selectGroup(idx);
    else if (li.id === 'guide_button') li.onclick = showGuide;
    else if (li.id === 'epg_button') li.onclick = showEpg;
  });
}

function selectGroup(index) {
  const groupItems = qsa('li', o.GroupList);
  if (index < 0 || index >= groupItems.length) return;
  const item = groupItems[index];
  if (!item || !item.dataset.group) return;
  if (item.dataset.group === '__fav') {
    const hasFav = Object.values(channels).some(ch => ch.favorite === true);
    if (!hasFav) { showTempMessage("No favorite channels added yet."); closeNav(); return; }
  }
  sSelectedGroup = item.dataset.group;
  iGroupListIndex = index;
  updateSelectedGroupInNav();
  buildNav();
  if (aFilteredChannelKeys.length>0) { iChannelListIndex = 0; updateSelectedChannelInNav(); }
  requestAnimationFrame(() => hideGroups());
}

function buildNav() {
  if (!o.ChannelList || !o.SearchField) return;
  const searchTerm = (o.SearchField.value || '').toLowerCase();
  try {
    aFilteredChannelKeys = Object.keys(channels).filter(key => {
      const ch = channels[key];
      if (!ch || typeof ch.name !== 'string') return false;
      const inGroup = sSelectedGroup === '__all' || (sSelectedGroup === '__fav' && ch.favorite === true) || (Array.isArray(ch.group) && ch.group.includes(sSelectedGroup));
      const inSearch = !searchTerm || ch.name.toLowerCase().includes(searchTerm);
      return inGroup && inSearch;
    }).sort((a,b)=> (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));
  } catch(e){ console.error("Error building nav", e); aFilteredChannelKeys = []; }

  o.ChannelList.innerHTML = '';
  o.ChannelList.scrollTop = 0;
  if (aFilteredChannelKeys.length === 0) {
    const msg = sSelectedGroup === '__fav' ? 'No favorite channels found. Add channels using the settings menu (→).' : 'No channels found in this category.';
    o.ChannelList.innerHTML = `<li style="justify-content:center; color:#888; padding:12px; text-align:center;">${msg}</li>`;
    return;
  }

  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, idx) => {
    const ch = channels[key]; if (!ch) return;
    const li = document.createElement('li'); li.className='channel-item';
    li.onclick = () => { if (preventRapidToggle(220)) return; if (isSessionActive) loadChannel(idx); else { iChannelListIndex = idx; updateSelectedChannelInNav(); } setTimeout(closeNav, 50); };
    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
    const logoHtml = ch.logo ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'; this.onerror=null;"></div>` : '<div class="nav_logo" style="width:50px;"></div>';
    const safeName = (ch.name || 'Unknown Channel').replace(/</g,'&lt;');
    li.innerHTML = `${fav}<span class="list-ch">${ch.number||'?'}</span><span class="list-title">${safeName}</span>${logoHtml}`;
    frag.appendChild(li);
  });
  o.ChannelList.appendChild(frag);
  updateSelectedChannelInNav();
}

function updateSelectedChannelInNav() {
  if (!o.ChannelList) return;
  try {
    const prev = o.ChannelList.querySelector('.selected'); if (prev) prev.classList.remove('selected');
    const items = qsa('li.channel-item', o.ChannelList);
    if (iChannelListIndex >=0 && iChannelListIndex < items.length) {
      const item = items[iChannelListIndex];
      if (item) { item.classList.add('selected'); items.forEach((li, idx) => li.classList.toggle('playing', idx===iActiveChannelIndex)); if (navState!==0 && typeof item.scrollIntoView==='function') item.scrollIntoView({behavior:'smooth', block:'center'}); }
    } else if (items.length>0) { iChannelListIndex = 0; items[0].classList.add('selected'); }
    else iChannelListIndex = -1;
  } catch(e){ console.error("Error updating selected channel", e); }
}

function updateSelectedGroupInNav() {
  if (!o.GroupList) return;
  try {
    const prev = o.GroupList.querySelector('.selected'); if (prev) prev.classList.remove('selected');
    const all = qsa('li', o.GroupList);
    if (iGroupListIndex >=0 && iGroupListIndex < all.length) { all[iGroupListIndex].classList.add('selected'); if (navState===2 && typeof all[iGroupListIndex].scrollIntoView==='function') all[iGroupListIndex].scrollIntoView({behavior:'smooth', block:'center'}); }
  } catch(e){ console.error("Error updating group nav", e); }
}

/* -------------------------
   Settings (right panel) - restored content
   ------------------------- */
function renderChannelSettings() {
  if (!aFilteredChannelKeys || aFilteredChannelKeys.length===0 || iActiveChannelIndex>=aFilteredChannelKeys.length) return;
  const currentKey = aFilteredChannelKeys[iActiveChannelIndex]; const currentChannel = channels[currentKey]; if (!currentChannel) return;
  if (!o.SettingsMainMenu) return;

  const html = `
    <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
    <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
    <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
  `;
  requestAnimationFrame(()=> { o.SettingsMainMenu.innerHTML = html; updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex); });
}

function renderVideoFormatMenu() {
  const current = getAspectRatio();
  return `
    <div class="settings-item" onclick="hideVideoFormatMenu()">&#8592; Back</div>
    <div class="settings-item-header">Video Settings</div>
    <div class="settings-item" onclick="showSettingsModal('format')">
      <span>Video format</span><span style="color: var(--text-medium);">${current} &gt;</span>
    </div>
    <div class="settings-item" onclick="showSettingsModal('quality')">
      <span>Video track</span><span style="color: var(--text-medium);">&gt;</span>
    </div>
  `;
}

function showVideoFormatMenu() {
  if (preventRapidToggle(220)) return;
  if (!o.SettingsContainer || !o.SettingsVideoFormatMenu) return;
  const submenuHtml = renderVideoFormatMenu();
  requestAnimationFrame(()=> {
    o.SettingsVideoFormatMenu.innerHTML = submenuHtml;
    requestAnimationFrame(()=> {
      iVideoSettingsIndex = 0;
      updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
      setTimeout(()=> o.SettingsContainer.classList.add('submenu-visible'), 0);
    });
  });
}

function hideVideoFormatMenu() {
  if (!o.SettingsContainer) return;
  o.SettingsContainer.classList.remove('submenu-visible');
  iChannelSettingsIndex = 1;
  if (o.SettingsMainMenu) updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
}

function showSettingsModal(type) {
  if (preventRapidToggle(220)) return;
  if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) return;
  clearUi('settingsModal');
  o.BlurOverlay.classList.add('visible');
  bSettingsModalOpened = true; iSettingsModalIndex = 0;
  try {
    const content = renderModalContent(type);
    requestAnimationFrame(()=> { o.SettingsModalContent.innerHTML = content; o.SettingsModal.classList.remove('HIDDEN'); updateSettingsModalSelection(); });
  } catch(e){ console.error("Error rendering modal", e); o.SettingsModalContent.innerHTML = '<p>Error</p>'; }
  pushOverlayState('settingsModal');
}

window.hideSettingsModal = () => {
  bSettingsModalOpened = false;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  popOverlayState();
  if (o.PlayerContainer) o.PlayerContainer.focus();
};

/* modal content & window helpers (kept from your version) */
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
      const cur = channels[aFilteredChannelKeys[iActiveChannelIndex]]; if (!cur) return '<p>Channel missing</p>';
      const safeName = (cur.name || '').replace(/"/g, '&quot;'); const safeLogo = (cur.logo || '').replace(/"/g, '&quot;');
      contentHtml = `<h2>Edit Channel</h2><div style="padding:15px 25px;"><label>Name</label><br><input id="edit_ch_name" value="${safeName}" class="edit-modal-field"><br><label>Logo URL</label><br><input id="edit_ch_logo" value="${safeLogo}" class="edit-modal-field"></div><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" onclick="applyChannelEdit()">SAVE</button></div>`;
    }
  } catch(e) { console.error("Error generating modal content", e); contentHtml = "<p>Error</p>"; }
  return contentHtml;
}

window.applyChannelEdit = () => {
  const name = getEl('edit_ch_name'), logo = getEl('edit_ch_logo');
  if (!name || !logo) return hideSettingsModal();
  if (!aFilteredChannelKeys || iActiveChannelIndex>=aFilteredChannelKeys.length) return hideSettingsModal();
  const key = aFilteredChannelKeys[iActiveChannelIndex]; if (!channels[key]) return hideSettingsModal();
  channels[key].name = name.value; channels[key].logo = logo.value;
  buildNav(); hideSettingsModal();
};

window.applyQualityAndClose = (selected) => {
  if (!player) return; try {
    if (selected === 'auto') player.configure({ abr: { enabled: true } });
    else {
      player.configure({ abr: { enabled: false } });
      const t = (player.getVariantTracks() || []).find(x=>x.id==selected);
      if (t) player.selectVariantTrack(t, true);
      else player.configure({ abr: { enabled: true } });
    }
  } catch(e){ console.error("applyQuality error", e); try { player.configure({ abr: { enabled: true } }); } catch{} }
  hideSettingsModal();
};

window.applyFormatAndClose = (val) => { setAspectRatio(val); hideSettingsModal(); };
window.setSubtitlesAndClose = (track, isVisible) => { if (!player) return; try { player.setTextTrackVisibility(isVisible); if (isVisible && track && typeof track.id!=='undefined') { const t = (player.getTextTracks()||[]).find(x=>x.id===track.id); if (t) player.selectTextTrack(t); } } catch(e){ console.error("setSubtitles error", e); } hideSettingsModal(); };
window.setAudioAndClose = (lang) => { if (!player) return; try { if (lang) player.selectAudioLanguage(lang); } catch(e){ console.error("setAudio error", e); } hideSettingsModal(); };

/* toggle favorite */
function toggleFavourite() {
  if (!aFilteredChannelKeys || iActiveChannelIndex>=aFilteredChannelKeys.length) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex]; if (!channels[key]) return;
  channels[key].favorite = !channels[key].favorite; saveFavoritesToStorage();
  if (bChannelSettingsOpened) renderChannelSettings();
  if (navState !== 0 && (sSelectedGroup === '__fav' || sSelectedGroup === '__all')) { buildNav(); const newIndex = aFilteredChannelKeys.indexOf(key); if (newIndex!==-1) iChannelListIndex=newIndex; else if (aFilteredChannelKeys.length>0) iChannelListIndex=0; else iChannelListIndex=-1; updateSelectedChannelInNav(); }
}

/* -------------------------
   UI helpers & idle
   ------------------------- */
function showIdleAnimation(showPlayButton=false) {
  if (o.IdleAnimation) { o.IdleAnimation.style.backgroundImage = "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg?w=1600&h=900&fit=crop')"; o.IdleAnimation.classList.remove('HIDDEN'); }
  if (o.PlayButton) { if (showPlayButton && !isSessionActive) o.PlayButton.classList.remove('HIDDEN'); else o.PlayButton.classList.add('HIDDEN'); }
}
function hideIdleAnimation() { if (o.IdleAnimation) o.IdleAnimation.classList.add('HIDDEN'); }

function clearUi(exclude) {
  if (exclude !== 'nav') closeNav();
  if (exclude !== 'channelSettings' && exclude !== 'settingsModal') closeSettingsPanel();
  if (exclude !== 'guide') hideGuide();
  if (exclude !== 'channelName') hideChannelName();
  if (exclude !== 'settingsModal') window.hideSettingsModal();
  if (exclude !== 'epg') hideEpg();
  if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) { clearTimeout(tempMessageTimeout); o.TempMessageOverlay.classList.remove('visible'); o.TempMessageOverlay.classList.add('HIDDEN'); }
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

/* -------------------------
   NAV state machine helpers (fixed)
   ------------------------- */
function openNavChannels() {
  if (!o.Nav) return;
  if (navState === 0) pushOverlayState('nav');
  navState = 1;
  o.Nav.classList.add('visible');
  o.ListContainer?.classList.remove('groups-opened');
  updateSelectedChannelInNav();
}
function openNavGroups() {
  if (!o.Nav) return;
  if (navState === 0) pushOverlayState('nav');
  navState = 2;
  o.Nav.classList.add('visible');
  o.ListContainer?.classList.add('groups-opened');
  updateSelectedGroupInNav();
}
function closeNav() {
  if (!o.Nav) return;
  o.Nav.classList.remove('visible');
  o.ListContainer?.classList.remove('groups-opened');
  if (overlayStack[overlayStack.length-1] === 'nav') popOverlayState();
  navState = 0;
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

/* LEFT (advance) and RIGHT (reverse) cycles:
   LEFT: 0 -> 1 -> 2 -> 1 -> 2...
   RIGHT: 2 -> 1 -> 0
*/
function navCycleLeft() {
  if (preventRapidToggle()) return;
  if (navState === 0) openNavChannels();    // closed -> channels
  else if (navState === 1) openNavGroups(); // channels -> groups
  else if (navState === 2) openNavChannels(); // groups -> channels (toggle)
}

function navCycleRight() {
  if (preventRapidToggle()) return;
  if (navState === 2) openNavChannels(); // groups -> channels
  else if (navState === 1) closeNav();   // channels -> closed
  else closeNav();                       // closed -> closed (no-op)
}

/* -------------------------
   Right panel (settings) open/close
   ------------------------- */
function openSettingsPanel() {
  if (!o.ChannelSettings || !o.SettingsContainer) return;
  clearUi('channelSettings');
  updateStreamInfo();
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.remove('HIDDEN');
  hideVideoFormatMenu();
  iChannelSettingsIndex = 0;
  renderChannelSettings();
  bChannelSettingsOpened = true;
  settingsOpen = true;
  o.ChannelSettings.classList.add('visible');
  o.SettingsContainer.classList.add('open'); // add class for transform animation
  pushOverlayState('channelSettings');
}
function closeSettingsPanel() {
  if (!o.ChannelSettings || !o.SettingsContainer) return;
  bChannelSettingsOpened = false;
  settingsOpen = false;
  o.ChannelSettings.classList.remove('visible');
  o.SettingsContainer.classList.remove('open');
  if (overlayStack[overlayStack.length-1] === 'channelSettings') popOverlayState();
  if (o.PlayerContainer) o.PlayerContainer.focus();
}
function toggleSettingsPanel() { if (settingsOpen) closeSettingsPanel(); else openSettingsPanel(); }

/* -------------------------
   Guide & EPG (kept)
   ------------------------- */
window.showGuide = () => {
  if (!o.Guide || !o.GuideContent || !o.BlurOverlay) return;
  if (preventRapidToggle()) return;
  clearUi('guide');
  o.BlurOverlay.classList.add('visible');
  renderGuideContent();
  o.Guide.classList.remove('HIDDEN');
  pushOverlayState('guide');
};
window.hideGuide = () => {
  if (o.Guide) o.Guide.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  popOverlayState();
  if (o.PlayerContainer) o.PlayerContainer.focus();
};
function renderGuideContent() {
  if (!o.GuideContent) return;
  o.GuideContent.innerHTML = `
    <h2>Controls</h2>
    <ul style="list-style:none; padding:0; font-size:16px;">
      <li><kbd>←</kbd> - Open Channel List (press again to show Groups)</li>
      <li><kbd>→</kbd> - Back: Groups -> Channels -> Close</li>
      <li><kbd>OK / Enter</kbd> - Show Info / Select</li>
      <li><kbd>↑/↓</kbd> - Change channel</li>
      <li><kbd>ESC</kbd> - Close</li>
    </ul>
  `;
}

function showEpg() {
  if (!o.EpgOverlay || !o.EpgChannels || !o.EpgTimeline) return;
  if (preventRapidToggle()) return;
  clearUi('epg');
  aEpgFilteredChannelKeys = [...aFilteredChannelKeys];
  if (aEpgFilteredChannelKeys.length === 0) aEpgFilteredChannelKeys = Object.keys(channels).sort((a,b)=> (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));
  const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
  iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
  if (iEpgChannelIndex === -1) {
    const cur = channels[currentKey];
    if (cur) iEpgChannelIndex = aEpgFilteredChannelKeys.findIndex(k => channels[k]?.number === cur.number);
    if (iEpgChannelIndex === -1) iEpgChannelIndex = 0;
  }
  renderEpg();
  o.EpgOverlay.classList.remove('HIDDEN');
  pushOverlayState('epg');
}
function hideEpg() { if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN'); popOverlayState(); if (o.PlayerContainer) o.PlayerContainer.focus(); }
function renderEpg() {
  if (!o.EpgChannels || !o.EpgTimeline) return;
  let html = '';
  aEpgFilteredChannelKeys.forEach((k, idx) => {
    const ch = channels[k]; if (!ch) return;
    html += `<div class="epg-ch-item ${idx===iEpgChannelIndex ? 'selected' : ''}">${ch.number || '?'} . ${ (ch.name||'Unknown').replace(/</g,'&lt;')}</div>`;
  });
  o.EpgChannels.innerHTML = html;
  o.EpgTimeline.innerHTML = generateDummyEpg();
  try { const sel = o.EpgChannels.querySelector('.selected'); if (sel && typeof sel.scrollIntoView === 'function') sel.scrollIntoView({behavior:'smooth', block:'center'}); } catch(e){}
}
function generateDummyEpg(){ return `<div class="epg-pr-item"><div class="epg-pr-time">Now</div><div class="epg-pr-title">Placeholder</div></div>`; }

/* Channel name display */
function showChannelName() {
  clearTimeout(channelNameTimeout);
  if (!o.ChannelInfo || !o.ChannelInfoName || !o.ChannelInfoEpg || !o.ChannelInfoLogo) return;
  if (!aFilteredChannelKeys || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
  const key = aFilteredChannelKeys[iActiveChannelIndex]; const ch = channels[key]; if (!ch) return;
  o.ChannelInfoName.textContent = ch.name || 'Unknown';
  o.ChannelInfoEpg.textContent = 'EPG not available';
  o.ChannelInfoLogo.innerHTML = ch.logo ? `<img src="${ch.logo}" alt="${ch.name||'logo'}" style="max-height:80px;max-width:80px;" onerror="this.style.display='none'">` : '';
  o.ChannelInfo.classList.add('visible');
  channelNameTimeout = setTimeout(hideChannelName, 5000);
}
function hideChannelName(){ if (o.ChannelInfo) o.ChannelInfo.classList.remove('visible'); }

/* Favorites storage */
function loadFavoritesFromStorage() {
  try {
    const favs = JSON.parse(localStorage.getItem("iptvFavoriteChannels") || "[]");
    if (Array.isArray(favs)) Object.keys(channels).forEach(k=> { if (channels[k]) channels[k].favorite = favs.includes(k); });
  } catch(e){ console.error("Error loading favorites", e); }
}
function saveFavoritesToStorage() {
  try {
    const favs = Object.entries(channels).filter(([,c])=>c && c.favorite).map(([k])=>k);
    localStorage.setItem("iptvFavoriteChannels", JSON.stringify(favs));
  } catch(e){ console.error("Error saving favorites", e); }
}

/* First play */
function handleFirstPlay() {
  if (isSessionActive) return;
  isSessionActive = true;
  hideIdleAnimation();
  if (aFilteredChannelKeys.length>0 && iChannelListIndex>=0 && iChannelListIndex<aFilteredChannelKeys.length) {
    iActiveChannelIndex = iChannelListIndex;
    loadChannel(iActiveChannelIndex, { isFirstPlay:true });
  } else { console.error("No valid channel selected on first play."); showIdleAnimation(true); isSessionActive=false; }
}

/* Settings selection helpers */
function updateSettingsSelection(container, index) {
  if (!container) return;
  try {
    const prev = container.querySelector('.selected'); if (prev) prev.classList.remove('selected');
    const items = qsa('.settings-item', container);
    if (items && index>=0 && index<items.length) { items[index].classList.add('selected'); if (typeof items[index].scrollIntoView === 'function') items[index].scrollIntoView({behavior:'smooth', block:'center'}); }
  } catch(e){ console.error("updateSettingsSelection error", e); }
}
function updateSettingsModalSelection() {
  if (!o.SettingsModalContent) return;
  try {
    const prev = o.SettingsModalContent.querySelector('.selected'); if (prev) prev.classList.remove('selected');
    const items = qsa('.modal-selectable', o.SettingsModalContent);
    if (items && iSettingsModalIndex>=0 && iSettingsModalIndex<items.length) { items[iSettingsModalIndex].classList.add('selected'); if (typeof items[iSettingsModalIndex].scrollIntoView==='function') items[iSettingsModalIndex].scrollIntoView({behavior:'smooth', block:'center'}); }
  } catch(e){ console.error("updateSettingsModalSelection error", e); }
}

/* Fullscreen toggle */
function toggleFullScreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen().catch(err=>console.error("FS error", err));
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
    else console.warn("Fullscreen not supported");
  } else {
    if (document.exitFullscreen) document.exitFullscreen().catch(err=>console.error("FS exit error", err));
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
}

/* Key handling */
document.addEventListener('keydown', (e) => {
  // Search field special handling
  if (document.activeElement === o.SearchField) {
    if (e.key === 'ArrowDown' && navState === 1) { e.preventDefault(); iChannelListIndex = 0; o.SearchField.blur(); updateSelectedChannelInNav(); }
    else if (e.key === 'Escape') { e.preventDefault(); o.SearchField.blur(); iChannelListIndex = iActiveChannelIndex; updateSelectedChannelInNav(); }
    else if (e.key === 'Enter') { e.preventDefault(); o.SearchField.blur(); iChannelListIndex = (aFilteredChannelKeys.length>0)?0:-1; updateSelectedChannelInNav(); }
    return;
  }

  // Settings modal open handling
  if (bSettingsModalOpened) {
    e.preventDefault();
    const items = o.SettingsModalContent ? qsa('.modal-selectable', o.SettingsModalContent) : [];
    if (!items || items.length === 0) { if (e.key === 'Escape') window.hideSettingsModal(); return; }
    if (e.key === 'ArrowUp') { iSettingsModalIndex = Math.max(0, iSettingsModalIndex-1); updateSettingsModalSelection(); }
    else if (e.key === 'ArrowDown') { iSettingsModalIndex = Math.min(items.length-1, iSettingsModalIndex+1); updateSettingsModalSelection(); }
    else if (e.key === 'Enter') { const sel = items[iSettingsModalIndex]; if (sel) { if (sel.tagName==='LI' && sel.dataset.value) { const type = o.SettingsModalContent.querySelector('input[name="quality"]') ? 'quality' : (o.SettingsModalContent.querySelector('input[name="format"]') ? 'format' : 'other'); if (type==='quality') window.applyQualityAndClose(sel.dataset.value); else if (type==='format') window.applyFormatAndClose(sel.dataset.value); else if (typeof sel.click === 'function') sel.click(); } else if (typeof sel.click === 'function') sel.click(); } }
    else if (e.key === 'Escape') { const btn = Array.from(items).find(b => b.tagName==='BUTTON' && (b.textContent.toUpperCase()==='CANCEL' || b.textContent.toUpperCase()==='CLOSE')); if (btn) btn.click(); else window.hideSettingsModal(); }
    return;
  }

  // EPG open handling
  if (bEpgOpened) {
    e.preventDefault();
    if (e.key === 'Escape') hideEpg();
    else if (e.key === 'ArrowUp') { iEpgChannelIndex = Math.max(0, iEpgChannelIndex-1); renderEpg(); }
    else if (e.key === 'ArrowDown') { iEpgChannelIndex = Math.min(aEpgFilteredChannelKeys.length-1, iEpgChannelIndex+1); renderEpg(); }
    return;
  }

  // Nav open handling
  if (navState !== 0) {
    e.preventDefault();
    // groups open?
    if (navState === 2) {
      const groupItems = o.GroupList ? qsa('li', o.GroupList) : [];
      if (e.key === 'ArrowUp') iGroupListIndex = Math.max(0, iGroupListIndex-1);
      else if (e.key === 'ArrowDown') iGroupListIndex = Math.min(groupItems.length-1, iGroupListIndex+1);
      else if (e.key === 'Enter') groupItems[iGroupListIndex]?.click();
      else if (e.key === 'ArrowLeft') navCycleLeft();
      else if (e.key === 'ArrowRight') navCycleRight();
      else if (e.key === 'Escape') navCycleRight();
      updateSelectedGroupInNav();
    } else {
      // channel list open
      if (e.key === 'ArrowUp') {
        if (iChannelListIndex === 0 && o.SearchField) { o.SearchField.focus(); const cur = o.ChannelList.querySelector('.selected'); if (cur) cur.classList.remove('selected'); iChannelListIndex = -1; }
        else if (iChannelListIndex > 0) { iChannelListIndex = (iChannelListIndex - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length; updateSelectedChannelInNav(); }
      } else if (e.key === 'ArrowDown') {
        if (iChannelListIndex === -1 && aFilteredChannelKeys.length>0) { iChannelListIndex = 0; updateSelectedChannelInNav(); o.SearchField.blur(); }
        else if (aFilteredChannelKeys.length>0 && iChannelListIndex !== -1) { iChannelListIndex = (iChannelListIndex + 1) % aFilteredChannelKeys.length; updateSelectedChannelInNav(); }
      } else if (e.key === 'Enter') { if (iChannelListIndex !== -1 && aFilteredChannelKeys.length>0) { loadChannel(iChannelListIndex); closeNav(); } }
      else if (e.key === 'ArrowLeft') navCycleLeft();
      else if (e.key === 'ArrowRight' || e.key === 'Escape') navCycleRight();
    }
    return;
  }

  // If settings panel open, close with either arrow
  if (settingsOpen && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { closeSettingsPanel(); return; }

  // Default player-level keys
  const PLAYER_KEYS = ['ArrowLeft','ArrowRight','Enter','ArrowUp','ArrowDown','h','e','Escape','m'];
  if (!PLAYER_KEYS.includes(e.key)) return;
  e.preventDefault();

  switch (e.key) {
    case 'ArrowLeft': navCycleLeft(); break;
    case 'ArrowRight':
      if (navState === 0) toggleSettingsPanel();
      else navCycleRight();
      break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iActiveChannelIndex - 1); break;
    case 'ArrowDown': loadChannel(iActiveChannelIndex + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': toggleSettingsPanel(); break;
    case 'Escape': clearUi(); break;
  }
});

/* -------------------------
   Stream info
   ------------------------- */
function updateStreamInfo() {
  const info = o.StreamInfoOverlay; if (!info || !player) return;
  try {
    const variant = (player.getVariantTracks()||[]).find(t=>t.active);
    if (!variant) { info.innerHTML = 'Stream Info: N/A'; return; }
    const codecs = variant.codecs || 'N/A', resolution = `${variant.width}x${variant.height}`, bandwidth = (variant.bandwidth/1e6).toFixed(2);
    info.innerHTML = `Codecs: ${codecs}\nResolution: ${resolution}\nBandwidth: ${bandwidth} Mbit/s`;
  } catch(e){ console.warn("updateStreamInfo error", e); info.innerHTML='Stream Info: Error'; }
}

/* -------------------------
   Init
   ------------------------- */
document.addEventListener('DOMContentLoaded', initPlayer);
