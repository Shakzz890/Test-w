/* Shakzz TV - cleaned / optimized drop-in JS
   Keeps original UI & CSS. Fixes:
   - double-click blank panel bug (debounce + transition locks)
   - anime background / loader overlap
   - mobile back-button: overlay control via history.pushState / popstate
   - TV remote navigation improvements
   - consistent animations + general performance cleanup
*/

(() => {
  'use strict';

  // ------------------------
  // Cached DOM (single place)
  // ------------------------
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
    StreamInfoOverlay: document.getElementById('StreamInfoOverlay'),
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

  // ------------------------
  // State
  // ------------------------
  let player = null;
  let ui = null;
  let channels = {
    // your channel objects (kept identical to what you provided)
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
    StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
    SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
    aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"] },
    sinemanila: { name: "SineManila", type: "hls", manifestUri: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "https://is5-ssl.mzstatic.com/image/thumb/Purple112/v4/64/72/72/64727284-ad63-33a7-59a6-7975c742c038/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg", group: ["movies", "entertainment"] },
    pbarush: { name: "PBA Rush", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3", key: "95b2f2ffd4e14073620506213b62ac82", logo: "https://static.wikia.nocookie.net/logopedia/images/0/00/PBA_Rush_Logo_2016.png", group: ["entertainment"] },
    animalplanet: { name: "Animal Planet", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", keyId: "436b69f987924fcbbc06d40a69c2799a", key: "c63d5b0d7e52335b61aeba4f6537d54d", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["documentary"] },
    discoverychannel: { name: "Discovery Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", keyId: "d9ac48f5131641a789328257e778ad3a", key: "b6e67c37239901980c6e37e0607ceee6", logo: "https://placehold.co/100x100/000/fff?text=Discovery", group: ["documentary"] },
    nickelodeon: { name: "Nickelodeon", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd", keyId: "9ce58f37576b416381b6514a809bfd8b", key: "f0fbb758cdeeaddfa3eae538856b4d72", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["cartoons & animations"] },
    nickjr: { name: "Nick Jr", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", keyId: "bab5c11178b646749fbae87962bf5113", key: "0ac679aad3b9d619ac39ad634ec76bc8", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["cartoons & animations"] },
    pbo: { name: "PBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "httpsIA803207.US.ARCHIVE.ORG/32/ITEMS/ZOO-MOO-KIDS-2020_202006/ZOOMOO-KIDS-2020.PNG", group: ["movies", "entertainment"] },
    angrybirds: { name: "Angry Birds", type: "hls", manifestUri: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=547", logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png", group: ["cartoons & animations"] },
    zoomooasia: { name: "Zoo Moo Asia", type: "hls", manifestUri: "https://zoomoo-samsungau.amagi.tv/playlist.m3u8", logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png", group: ["cartoons & animations", "entertainment"] },
    mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUri: "https://example.com/placeholder/live.m3u8", logo: "https://placehold.co/100x100/000/fff?text=Mr+Bean", group: ["entertainment"] }
  };

  // Filtered keys and indices
  let aFilteredChannelKeys = [];
  let sSelectedGroup = '__all';
  let iChannelListIndex = 0; // highlighted in nav
  let iActiveChannelIndex = 0; // playing channel
  let iGroupListIndex = 1;
  let iChannelSettingsIndex = 0;
  let iVideoSettingsIndex = 0;
  let iEpgChannelIndex = 0;
  let aEpgFilteredChannelKeys = [];
  let iSettingsModalIndex = 0;

  // flags & timers
  let channelNameTimeout = null;
  let isSessionActive = false;
  let bNavOpened = false;
  let bGroupsOpened = false;
  let bChannelSettingsOpened = false;
  let bSettingsModalOpened = false;
  let bGuideOpened = false;
  let bEpgOpened = false;
  let loaderFadeTimeout = null;
  let tempMessageTimeout = null;
  let lastPanelToggle = 0;
  const PANEL_DEBOUNCE_MS = 250; // prevents double-click blank panel
  let lastTapTime = 0;

  // small helper to get element by id (still available)
  const getEl = id => document.getElementById(id);

  // ------------------------
  // Panel lock / safe toggles
  // ------------------------
  function panelLock() {
    const now = Date.now();
    if (now - lastPanelToggle < PANEL_DEBOUNCE_MS) return false;
    lastPanelToggle = now;
    return true;
  }

  // Unified show/hide that uses lock and updates pushState
  function pushStateForOverlay(name) {
    // Called when opening overlays; add a state so back button closes overlay
    try {
      history.pushState({ overlay: name }, '', '');
    } catch (e) { /* some browsers may restrict pushState in some contexts */ }
  }

  function closeOverlayByName(name) {
    switch (name) {
      case 'epg': hideEpg(); break;
      case 'guide': window.hideGuide(); break;
      case 'settingsModal': window.hideSettingsModal(); break;
      case 'channelSettings': hideChannelSettings(); break;
      default: clearUi(); break;
    }
  }

  // Handle browser back button - close overlay instead of leaving
  window.addEventListener('popstate', (ev) => {
    // If there is an overlay open, close it and stop the back navigation
    if (bSettingsModalOpened || bEpgOpened || bGuideOpened || bChannelSettingsOpened || bNavOpened) {
      // close top-most overlay
      if (bSettingsModalOpened) {
        window.hideSettingsModal();
      } else if (bEpgOpened) {
        hideEpg();
      } else if (bGuideOpened) {
        window.hideGuide();
      } else if (bChannelSettingsOpened) {
        hideChannelSettings();
      } else if (bNavOpened) {
        hideNav();
      }
      // push a new state to avoid going back further automatically
      try { history.pushState({}, '', ''); } catch (e) {}
    } else {
      // no overlay open - allow default browser back
    }
  });

  // ------------------------
  // Utility helpers
  // ------------------------
  function safeInnerHTML(el, html) {
    if (!el) return;
    el.innerHTML = html;
  }

  function addClass(el, cls) { if (el && !el.classList.contains(cls)) el.classList.add(cls); }
  function removeClass(el, cls) { if (el && el.classList.contains(cls)) el.classList.remove(cls); }
  function toggleClass(el, cls) { if (!el) return; el.classList.toggle(cls); }

  function showTempMessage(msg) {
    if (!o.TempMessageOverlay) return;
    clearTimeout(tempMessageTimeout);
    o.TempMessageOverlay.textContent = msg;
    removeClass(o.TempMessageOverlay, 'HIDDEN');
    addClass(o.TempMessageOverlay, 'visible');
    tempMessageTimeout = setTimeout(() => {
      removeClass(o.TempMessageOverlay, 'visible');
      setTimeout(() => addClass(o.TempMessageOverlay, 'HIDDEN'), 300);
    }, 3000);
  }

  // ------------------------
  // Loader & animation consistency
  // ------------------------
  function showLoader() {
    if (!o.ChannelLoader) return;
    removeClass(o.ChannelLoader, 'HIDDEN');
    removeClass(o.ChannelLoader, 'fade-out');
    o.ChannelLoader.style.opacity = '1';
  }

  function hideLoaderAndShowVideo() {
    clearTimeout(loaderFadeTimeout);
    if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
    if (!o.ChannelLoader) return;
    // fade-out, then hide
    addClass(o.ChannelLoader, 'fade-out');
    loaderFadeTimeout = setTimeout(() => {
      addClass(o.ChannelLoader, 'HIDDEN');
      removeClass(o.ChannelLoader, 'fade-out');
    }, 450); // match your CSS fade (adjust if necessary)
  }

  // ------------------------
  // Core Player init
  // ------------------------
  async function initPlayer() {
    // assign channel numbers & keys
    Object.keys(channels).forEach((key, i) => {
      channels[key].number = i + 1;
      channels[key].key = key;
    });

    loadFavoritesFromStorage();
    setupMainMenuControls();
    buildDynamicGroupNav();
    sSelectedGroup = '__all';

    // determine initial group index safely
    try {
      if (o.GroupList) {
        const allGroupLiItems = o.GroupList.querySelectorAll('li');
        const initialGroupItem = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
        if (initialGroupItem) {
          iGroupListIndex = Array.from(allGroupLiItems).indexOf(initialGroupItem);
        } else {
          iGroupListIndex = 1;
        }
      }
    } catch (e) { iGroupListIndex = 1; }

    buildNav();
    updateSelectedGroupInNav();

    // shaka
    await shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka Player not supported in this browser.");
      return;
    }

    player = new shaka.Player();
    ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);
    ui.configure({
      controlPanelElements: [],
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

    // events
    player.addEventListener('error', (e) => {
      console.error('Shaka Error:', e.detail || e);
      showIdleAnimation(true);
      // restore loader state
      if (o.ChannelLoader) {
        clearTimeout(loaderFadeTimeout);
        addClass(o.ChannelLoader, 'HIDDEN');
        removeClass(o.ChannelLoader, 'fade-out');
        o.ChannelLoader.style.opacity = '1';
      }
      if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
    });

    player.addEventListener('trackschanged', renderChannelSettings);
    player.addEventListener('buffering', (ev) => {
      if (!ev.buffering) hideLoaderAndShowVideo();
    });
    player.addEventListener('playing', hideLoaderAndShowVideo);
    player.addEventListener('adaptation', updateStreamInfo);
    player.addEventListener('streaming', updateStreamInfo);

    setupControls(); // touch, click, dblclick
    setupKeydown();  // keyboard/remote handling
    showIdleAnimation(true);
    loadInitialChannel();
  }

  // ------------------------
  // Load initial channel + load channel function
  // ------------------------
  function loadInitialChannel() {
    const storedLast = localStorage.getItem('iptvLastWatched');
    let initialChannelKey = 'SonictheHedgehog';
    if (!channels[initialChannelKey]) initialChannelKey = Object.keys(channels)[0];

    if (aFilteredChannelKeys.length === 0) {
      sSelectedGroup = '__all';
      buildNav();
    }

    if (storedLast && channels[storedLast] && aFilteredChannelKeys.includes(storedLast)) {
      initialChannelKey = storedLast;
    } else if (!aFilteredChannelKeys.includes(initialChannelKey)) {
      initialChannelKey = aFilteredChannelKeys[0];
    }

    if (!initialChannelKey) return;
    const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
    iChannelListIndex = (initialIndex >= 0 ? initialIndex : 0);
    iActiveChannelIndex = iChannelListIndex;
    updateSelectedChannelInNav();
  }

  async function loadChannel(index, options = {}) {
    clearTimeout(loaderFadeTimeout);

    if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
      console.warn("No channels available to load.");
      try { await player?.unload(); } catch (e) {}
      showIdleAnimation(!isSessionActive);
      return;
    }

    // normalize index
    if (typeof index !== 'number') index = iChannelListIndex;
    index = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length;
    iChannelListIndex = index;
    iActiveChannelIndex = iChannelListIndex;

    const channelKey = aFilteredChannelKeys[iChannelListIndex];
    const channel = channels[channelKey];
    if (!channel) {
      console.error('Invalid channel at index', iChannelListIndex);
      showIdleAnimation(!isSessionActive);
      return;
    }
    if (!player) {
      console.error('Player not initialized');
      return;
    }

    localStorage.setItem('iptvLastWatched', channelKey);

    // hide video to avoid flashes, show loader
    if (o.AvPlayer) o.AvPlayer.style.opacity = '0';
    showLoader();
    hideChannelName();
    updateSelectedChannelInNav();

    try {
      // Clear previous DRM config
      player.configure('drm.clearKeys', {});
      if (channel.type === 'clearkey' && channel.keyId && channel.key) {
        player.configure({ drm: { clearKeys: { [channel.keyId]: channel.key } } });
      }

      // clear networking filters then optionally register user-agent
      try { player.getNetworkingEngine()?.clearAllRequestFilters(); } catch (e) {}
      if (channel.userAgent) {
        try {
          player.getNetworkingEngine()?.registerRequestFilter((type, request) => {
            request.headers['User-Agent'] = channel.userAgent;
          });
        } catch (e) { console.warn('Unable to set networking filter', e); }
      }

      // unmute before load to help autoplay in some browsers
      if (isSessionActive && o.AvPlayer) o.AvPlayer.muted = false;

      await player.load(channel.manifestUri);

      if (isSessionActive && o.AvPlayer) {
        o.AvPlayer.play().catch(err => console.warn('Autoplay prevented:', err));
        showChannelName();
      }
    } catch (error) {
      console.error(`Error loading channel "${channel?.name}"`, error);
      showIdleAnimation(!isSessionActive);
      if (o.ChannelLoader) {
        clearTimeout(loaderFadeTimeout);
        addClass(o.ChannelLoader, 'HIDDEN');
        removeClass(o.ChannelLoader, 'fade-out');
      }
      if (o.AvPlayer) o.AvPlayer.style.opacity = '1';
    }
  }

  // ------------------------
  // Navigation & Nav building
  // ------------------------
  function buildNav() {
    if (!o.ChannelList || !o.SearchField) {
      console.error('ChannelList or SearchField missing');
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
    } catch (e) {
      console.error('Error building nav filter', e);
      aFilteredChannelKeys = [];
    }

    o.ChannelList.innerHTML = '';
    o.ChannelList.scrollTop = 0;

    if (aFilteredChannelKeys.length === 0) {
      const msg = sSelectedGroup === '__fav'
        ? 'No favorite channels found. Add channels using the settings menu (→).'
        : 'No channels found in this category.';
      safeInnerHTML(o.ChannelList, `<li style="justify-content:center; color:#888; padding:12px; height:auto; line-height:normal; white-space:normal; text-align:center;">${msg}</li>`);
      return;
    }

    const frag = document.createDocumentFragment();
    aFilteredChannelKeys.forEach((key, idx) => {
      const ch = channels[key];
      if (!ch) return;
      const li = document.createElement('li');
      li.className = 'channel-item';
      li.dataset.channelKey = key;
      li.onclick = (ev) => {
        if (!panelLock()) return; // prevent double activations
        if (isSessionActive) {
          loadChannel(idx);
          // small delay to allow click visual, then close nav
          setTimeout(hideNav, 60);
        } else {
          iChannelListIndex = idx;
          updateSelectedChannelInNav();
          setTimeout(hideNav, 60);
        }
      };

      const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
      const logoHtml = ch.logo ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'; this.onerror=null;"></div>` : '<div class="nav_logo" style="width:50px;"></div>';
      const safeName = (ch.name || 'Unknown Channel').replace(/</g, '&lt;');
      li.innerHTML = `${fav}<span class="list-ch">${ch.number || '?'}</span><span class="list-title">${safeName}</span>${logoHtml}`;
      frag.appendChild(li);
    });

    o.ChannelList.appendChild(frag);
    updateSelectedChannelInNav();
  }

  function updateSelectedChannelInNav() {
    if (!o.ChannelList) return;
    try {
      const current = o.ChannelList.querySelector('.selected');
      if (current) current.classList.remove('selected');

      const items = o.ChannelList.querySelectorAll('li.channel-item');
      if (iChannelListIndex >= 0 && iChannelListIndex < items.length) {
        const newItem = items[iChannelListIndex];
        if (newItem) {
          newItem.classList.add('selected');
          if (bNavOpened && typeof newItem.scrollIntoView === 'function') {
            newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else if (aFilteredChannelKeys.length > 0 && items.length > 0) {
        iChannelListIndex = 0;
        const firstItem = items[0];
        if (firstItem) firstItem.classList.add('selected');
        console.warn('iChannelListIndex out of bounds, setting to 0');
      } else {
        iChannelListIndex = 0;
      }
    } catch (e) {
      console.error('Error updateSelectedChannelInNav', e);
    }
  }

  function updateSelectedGroupInNav() {
    if (!o.GroupList) return;
    try {
      const curr = o.GroupList.querySelector('.selected');
      if (curr) curr.classList.remove('selected');
      const lis = o.GroupList.querySelectorAll('li');
      if (iGroupListIndex >= 0 && iGroupListIndex < lis.length) {
        const newItem = lis[iGroupListIndex];
        if (newItem) {
          newItem.classList.add('selected');
          if (bGroupsOpened && typeof newItem.scrollIntoView === 'function') {
            newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else console.warn('Invalid iGroupListIndex', iGroupListIndex);
    } catch (e) { console.error('Error updateSelectedGroupInNav', e); }
  }

  // ------------------------
  // Groups (dynamic)
  // ------------------------
  function buildDynamicGroupNav() {
    if (!o.DynamicGroupsList || !o.GroupList) return;
    let sortedGroups = [];
    try {
      const allGroups = new Set(Object.values(channels).flatMap(ch => ch?.group || []));
      sortedGroups = [...allGroups].sort();
    } catch (e) { console.error('Error sorting groups', e); }

    o.DynamicGroupsList.innerHTML = '';
    const nodes = [];

    const favLi = document.createElement('li');
    favLi.dataset.group = '__fav';
    favLi.textContent = 'FAVORITES';
    nodes.push(favLi);

    const allLi = document.createElement('li');
    allLi.dataset.group = '__all';
    allLi.textContent = 'ALL CHANNELS';
    nodes.push(allLi);

    sortedGroups.forEach(name => {
      const safeName = (name || 'Unnamed Group').replace(/</g, '&lt;');
      const li = document.createElement('li');
      li.dataset.group = safeName;
      li.textContent = safeName.toUpperCase();
      nodes.push(li);
    });

    nodes.forEach(n => o.DynamicGroupsList.appendChild(n));

    // attach click handlers for GroupList items (only once)
    const fullGroupItems = o.GroupList.querySelectorAll('li');
    fullGroupItems.forEach((li, idx) => {
      li.onclick = null; // reset
      if (li.hasAttribute('data-group')) {
        li.onclick = () => selectGroup(idx);
      } else if (li.id === 'guide_button') {
        li.onclick = () => { if (panelLock()) showGuide(); };
      } else if (li.id === 'epg_button') {
        li.onclick = () => { if (panelLock()) showEpg(); };
      }
    });
  }

  function selectGroup(index) {
    if (!o.GroupList || !o.ListContainer) return;
    const items = o.GroupList.querySelectorAll('li');
    if (index < 0 || index >= items.length) return;
    const item = items[index];
    if (!item || !item.dataset.group) return;

    const group = item.dataset.group;
    if (group === '__fav') {
      const hasFav = Object.values(channels).some(ch => ch.favorite);
      if (!hasFav) {
        showTempMessage('No favorite channels added yet.');
        hideNav();
        return;
      }
    }

    sSelectedGroup = group;
    iGroupListIndex = index;
    updateSelectedGroupInNav();
    buildNav();

    if (aFilteredChannelKeys.length > 0) {
      iChannelListIndex = 0;
      updateSelectedChannelInNav();
    }
    // close groups after selection
    requestAnimationFrame(() => hideGroups());
  }

  // ------------------------
  // Settings & Modals (kept as before, but safer)
  // ------------------------
  function renderChannelSettings() {
    if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0 || iActiveChannelIndex >= aFilteredChannelKeys.length) return;
    const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
    const currentChannel = channels[currentKey];
    if (!currentChannel) return;
    if (!o.SettingsMainMenu) return console.error('SettingsMainMenu not found');

    const currentFormat = getAspectRatio();
    safeInnerHTML(o.SettingsMainMenu, `
      <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
      <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
      <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
    `);
    updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
  }

  function showVideoFormatMenu() {
    if (!o.SettingsContainer) return console.error('SettingsContainer not found');
    addClass(o.SettingsContainer, 'submenu-visible');
    iVideoSettingsIndex = 0;
    renderVideoFormatMenu();
  }

  function hideVideoFormatMenu() {
    if (!o.SettingsContainer) return;
    removeClass(o.SettingsContainer, 'submenu-visible');
    iChannelSettingsIndex = 1;
    if (o.SettingsMainMenu) updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
  }

  function renderVideoFormatMenu() {
    if (!o.SettingsVideoFormatMenu) return console.error('SettingsVideoFormatMenu not found');
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
      case 'stretch': o.AvPlayer.style.objectFit = 'fill'; formatName = 'Stretch'; break;
      case '16:9': o.AvPlayer.style.objectFit = 'contain'; formatName = '16:9'; break;
      case 'fill': o.AvPlayer.style.objectFit = 'cover'; formatName = 'Fill'; break;
      case 'zoom': o.AvPlayer.style.objectFit = 'cover'; o.AvPlayer.style.transform = 'scale(1.15)'; formatName = 'Zoom'; break;
      default: o.AvPlayer.style.objectFit = 'contain'; formatName = 'Original';
    }
    localStorage.setItem('iptvAspectRatio', formatName);
    renderVideoFormatMenu();
  }

  function showSettingsModal(type) {
    if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) return console.error('modal element missing');
    if (!panelLock()) return;
    clearUi('settingsModal');
    addClass(o.BlurOverlay, 'visible');
    bSettingsModalOpened = true;
    iSettingsModalIndex = 0;
    try {
      o.SettingsModalContent.innerHTML = renderModalContent(type);
    } catch (err) {
      console.error('Error rendering modal', err);
      safeInnerHTML(o.SettingsModalContent, '<p>Error loading content.</p>');
    }
    removeClass(o.SettingsModal, 'HIDDEN');
    updateSettingsModalSelection();
    pushStateForOverlay('settingsModal');
  }

  window.hideSettingsModal = () => {
    bSettingsModalOpened = false;
    addClass(o.SettingsModal, 'HIDDEN');
    removeClass(o.BlurOverlay, 'visible');
  };

  function renderModalContent(type) {
    if (!player) return '<p>Player not initialized.</p>';
    let contentHtml = '';
    try {
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
        contentHtml = `<h2>Edit Channel</h2><div style="padding:15px 25px;">
          <label>Name</label><br><input type="text" id="edit_ch_name" class="edit-modal-field" value="${safeName}"><br>
          <label>Logo URL</label><br><input type="text" id="edit_ch_logo" class="edit-modal-field" value="${safeLogo}">
        </div><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" onclick="applyChannelEdit()">SAVE</button></div>`;
      }
    } catch (e) {
      console.error('Error creating modal', e);
      contentHtml = '<p>Error displaying options.</p>';
    }
    return contentHtml;
  }

  window.applyChannelEdit = () => {
    const nameInput = getEl('edit_ch_name');
    const logoInput = getEl('edit_ch_logo');
    if (!nameInput || !logoInput) {
      console.error('Edit modal inputs not found');
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

  // quality / format / subtitles / audio handlers
  window.applyQualityAndClose = (selected) => {
    if (!player) return;
    try {
      if (selected === 'auto') {
        player.configure({ abr: { enabled: true } });
      } else {
        player.configure({ abr: { enabled: false } });
        const trackToSelect = (player.getVariantTracks() || []).find(t => t.id == selected);
        if (trackToSelect) player.selectVariantTrack(trackToSelect, true);
        else player.configure({ abr: { enabled: true } });
      }
    } catch (e) { console.error('Error setting quality', e); try { player.configure({ abr: { enabled: true } }); } catch {} }
    hideSettingsModal();
  };

  window.applyFormatAndClose = (value) => { setAspectRatio(value); hideSettingsModal(); };
  window.setSubtitlesAndClose = (track, isVisible) => {
    if (!player) return;
    try {
      player.setTextTrackVisibility(isVisible);
      if (isVisible && track && typeof track.id !== 'undefined') {
        const t = (player.getTextTracks() || []).find(x => x.id === track.id);
        if (t) player.selectTextTrack(t);
      }
    } catch (e) { console.error('Error setting subtitles', e); }
    hideSettingsModal();
  };
  window.setAudioAndClose = (lang) => {
    if (!player) return;
    try { if (typeof lang === 'string') player.selectAudioLanguage(lang); } catch (e) { console.error('Error selecting audio', e); }
    hideSettingsModal();
  };

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
      iChannelListIndex = newIndex !== -1 ? newIndex : (aFilteredChannelKeys.length > 0 ? 0 : 0);
      updateSelectedChannelInNav();
    }
  }

  // ------------------------
  // Channel Info display
  // ------------------------
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
    addClass(o.ChannelInfo, 'visible');
    channelNameTimeout = setTimeout(hideChannelName, 5000);
  }

  function hideChannelName() {
    if (o.ChannelInfo) removeClass(o.ChannelInfo, 'visible');
  }

  // ------------------------
  // Favorites storage
  // ------------------------
  function loadFavoritesFromStorage() {
    try {
      const favs = JSON.parse(localStorage.getItem('iptvFavoriteChannels') || '[]');
      if (Array.isArray(favs)) {
        Object.keys(channels).forEach(k => { if (channels[k]) channels[k].favorite = favs.includes(k); });
      } else console.warn('Favorites data not array');
    } catch (e) { console.error('Error load favorites', e); }
  }

  function saveFavoritesToStorage() {
    try {
      const favs = Object.entries(channels).filter(([, ch]) => ch && ch.favorite).map(([k]) => k);
      localStorage.setItem('iptvFavoriteChannels', JSON.stringify(favs));
      console.log('Saved Favorites:', favs);
    } catch (e) { console.error('Error save favorites', e); }
  }

  // ------------------------
  // First play handling
  // ------------------------
  function handleFirstPlay() {
    if (isSessionActive) return;
    isSessionActive = true;
    hideIdleAnimation();
    if (aFilteredChannelKeys.length > 0 && iChannelListIndex >= 0 && iChannelListIndex < aFilteredChannelKeys.length) {
      loadChannel(iChannelListIndex);
    } else {
      console.error('No valid channel selected on first play');
      showIdleAnimation(true);
      isSessionActive = false;
    }
  }

  function showIdleAnimation(showPlayButton = false) {
    if (o.IdleAnimation) removeClass(o.IdleAnimation, 'HIDDEN');
    if (o.PlayButton) {
      if (showPlayButton && !isSessionActive) removeClass(o.PlayButton, 'HIDDEN');
      else addClass(o.PlayButton, 'HIDDEN');
    }
  }
  function hideIdleAnimation() { if (o.IdleAnimation) addClass(o.IdleAnimation, 'HIDDEN'); }

  // ------------------------
  // Settings selection helpers
  // ------------------------
  function updateSettingsSelection(container, index) {
    if (!container || typeof container.querySelector !== 'function') return;
    try {
      const cur = container.querySelector('.selected');
      if (cur) cur.classList.remove('selected');
      const items = container.querySelectorAll('.settings-item');
      if (items && index >= 0 && index < items.length) {
        const item = items[index];
        if (item) {
          item.classList.add('selected');
          if (typeof item.scrollIntoView === 'function') item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else console.warn('Invalid index for settings selection', index);
    } catch (e) { console.error('Error updateSettingsSelection', e); }
  }

  function updateSettingsModalSelection() {
    if (!o.SettingsModalContent) return;
    try {
      const cur = o.SettingsModalContent.querySelector('.selected');
      if (cur) cur.classList.remove('selected');
      const items = o.SettingsModalContent.querySelectorAll('.modal-selectable');
      if (items && iSettingsModalIndex >= 0 && iSettingsModalIndex < items.length) {
        const item = items[iSettingsModalIndex];
        if (item) {
          item.classList.add('selected');
          if (typeof item.scrollIntoView === 'function') item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else console.warn('Invalid modal index', iSettingsModalIndex);
    } catch (e) { console.error('Error updateSettingsModalSelection', e); }
  }

  // ------------------------
  // Show/hide nav/groups/settings/epg/guide - with state & pushState
  // ------------------------
  function showNav() {
    if (!o.Nav) return;
    if (!panelLock()) return;
    bNavOpened = true;
    addClass(o.Nav, 'visible');
    updateSelectedChannelInNav();
    pushStateForOverlay('nav');
  }

  function hideNav() {
    if (!o.Nav) return;
    bNavOpened = false;
    removeClass(o.Nav, 'visible');
    if (o.ListContainer?.classList.contains('groups-opened')) hideGroups();
  }

  function showGroups() {
    if (bNavOpened && o.ListContainer) {
      bGroupsOpened = true;
      addClass(o.ListContainer, 'groups-opened');
      updateSelectedGroupInNav();
    }
  }

  function hideGroups() {
    bGroupsOpened = false;
    if (o.ListContainer) removeClass(o.ListContainer, 'groups-opened');
  }

  function showChannelSettings() {
    if (!o.ChannelSettings) return;
    if (!panelLock()) return;
    updateStreamInfo();
    if (o.StreamInfoOverlay) removeClass(o.StreamInfoOverlay, 'HIDDEN');
    clearUi('channelSettings');
    hideVideoFormatMenu();
    iChannelSettingsIndex = 0;
    renderChannelSettings();
    bChannelSettingsOpened = true;
    addClass(o.ChannelSettings, 'visible');
    pushStateForOverlay('channelSettings');
  }

  function hideChannelSettings() {
    if (!o.ChannelSettings) return;
    bChannelSettingsOpened = false;
    addClass(o.ChannelSettings, 'HIDDEN');
    if (o.StreamInfoOverlay) addClass(o.StreamInfoOverlay, 'HIDDEN');
  }

  window.showGuide = () => {
    if (!o.Guide || !o.GuideContent || !o.BlurOverlay) return;
    if (!panelLock()) return;
    clearUi('guide');
    addClass(o.BlurOverlay, 'visible');
    renderGuideContent();
    bGuideOpened = true;
    removeClass(o.Guide, 'HIDDEN');
    pushStateForOverlay('guide');
  };
  window.hideGuide = () => {
    bGuideOpened = false;
    addClass(o.Guide, 'HIDDEN');
    removeClass(o.BlurOverlay, 'visible');
  };

  function renderGuideContent() {
    if (!o.GuideContent) return;
    safeInnerHTML(o.GuideContent, `
      <h2>Controls (TV Remote)</h2>
      <ul style="list-style:none;padding:0;font-size:clamp(16px,2.5vw,22px);line-height:1.8;">
        <li><kbd>←</kbd> - Open Channel List</li>
        <li><kbd>←</kbd> (in list) - Open Group List</li>
        <li><kbd>→</kbd> - Open Channel Settings</li>
        <li><kbd>OK</kbd>/<kbd>Enter</kbd> - Show Info / Select</li>
        <li><kbd>↑</kbd>/<kbd>↓</kbd> - Change channel</li>
        <li><kbd>ESC</kbd> - Go Back / Close Panel</li>
      </ul>
      <h2>Controls (Mobile)</h2>
      <ul style="list-style:none;padding:0;font-size:clamp(16px,2.5vw,22px);line-height:1.8;">
        <li><b>Swipe Left-to-Right</b> - Open Nav / Open Groups</li>
        <li><b>Swipe Right-to-Left</b> - Open Settings / Close Nav</li>
        <li><b>Swipe Up/Down</b> - Change channel</li>
        <li><b>Single Tap</b> - Close Panel / Show Info</li>
      </ul>
    `);
  }

  // ------------------------
  // EPG
  // ------------------------
  function showEpg() {
    if (!o.EpgOverlay || !o.EpgChannels || !o.EpgTimeline) return;
    if (!panelLock()) return;
    clearUi('epg');

    aEpgFilteredChannelKeys = Object.keys(channels).sort((a, b) => (channels[a]?.number ?? Infinity) - (channels[b]?.number ?? Infinity));
    const currentKey = aFilteredChannelKeys[iActiveChannelIndex];
    iEpgChannelIndex = aEpgFilteredChannelKeys.indexOf(currentKey);
    if (iEpgChannelIndex === -1) {
      const currentChannelData = channels[aEpgFilteredChannelKeys[iActiveChannelIndex]];
      if (currentChannelData) iEpgChannelIndex = aEpgFilteredChannelKeys.findIndex(key => channels[key]?.number === currentChannelData.number);
      if (iEpgChannelIndex === -1) iEpgChannelIndex = 0;
    }

    renderEpg();
    bEpgOpened = true;
    removeClass(o.EpgOverlay, 'HIDDEN');
    pushStateForOverlay('epg');
  }

  function hideEpg() {
    bEpgOpened = false;
    addClass(o.EpgOverlay, 'HIDDEN');
  }

  function renderEpg() {
    if (!o.EpgChannels || !o.EpgTimeline) return;
    let channelsHtml = '';
    aEpgFilteredChannelKeys.forEach((key, idx) => {
      const ch = channels[key];
      if (!ch) return;
      const selectedClass = idx === iEpgChannelIndex ? 'selected' : '';
      const safeName = (ch.name || 'Unknown').replace(/</g, '&lt;');
      channelsHtml += `<div class="epg-ch-item ${selectedClass}">${ch.number || '?'} . ${safeName}</div>`;
    });
    safeInnerHTML(o.EpgChannels, channelsHtml);
    safeInnerHTML(o.EpgTimeline, generateDummyEpg());
    try {
      const sel = o.EpgChannels.querySelector('.selected');
      if (sel && typeof sel.scrollIntoView === 'function') sel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) { console.error('EPG scroll error', e); }
  }

  function generateDummyEpg() {
    return `
      <div class="epg-pr-item"><div class="epg-pr-time">Now Playing</div><div class="epg-pr-title">Current Program Title (Placeholder)</div></div>
      <div class="epg-pr-item"><div class="epg-pr-time">Up Next</div><div class="epg-pr-title">Next Program Title (Placeholder)</div></div>
      <div class="epg-pr-item"><div class="epg-pr-time">Later</div><div class="epg-pr-title">Future Program Title (Placeholder)</div></div>
    `;
  }

  // ------------------------
  // Keyboard & TV remote mapping
  // ------------------------
  // Default mapping (as you suggested) — will behave the same for TV remotes that emit standard keys.
  // If a platform has custom codes (e.g. Tizen), map them to these keys before calling handler.
  function setupKeydown() {
    document.addEventListener('keydown', (e) => {
      // normalize
      const key = e.key;
      // If search field focused, behave specially
      if (document.activeElement === o.SearchField) {
        if (key === 'ArrowDown' && bNavOpened && !bGroupsOpened) {
          e.preventDefault();
          iChannelListIndex = 0;
          o.SearchField.blur();
          updateSelectedChannelInNav();
        } else if (key === 'Escape') {
          e.preventDefault();
          o.SearchField.blur();
          iChannelListIndex = 0;
          updateSelectedChannelInNav();
        }
        return;
      }

      // Guide modal open
      if (bGuideOpened) {
        e.preventDefault();
        if (key === 'Escape') window.hideGuide();
        return;
      }

      // Settings modal navigation
      if (bSettingsModalOpened) {
        e.preventDefault();
        const items = o.SettingsModalContent?.querySelectorAll('.modal-selectable') || [];
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
          if (closeButton) closeButton.click();
          else window.hideSettingsModal();
        }
        return;
      }

      // EPG handling
      if (bEpgOpened) {
        e.preventDefault();
        const EPG_KEYS = ['Escape', 'ArrowUp', 'ArrowDown', 'Enter'];
        if (!EPG_KEYS.includes(key)) return;
        if (key === 'Escape') hideEpg();
        else if (key === 'ArrowUp') { iEpgChannelIndex = Math.max(0, iEpgChannelIndex - 1); renderEpg(); }
        else if (key === 'ArrowDown') { iEpgChannelIndex = Math.min(aEpgFilteredChannelKeys.length - 1, iEpgChannelIndex + 1); renderEpg(); }
        return;
      }

      // Nav open: groups vs channels
      if (bNavOpened) {
        e.preventDefault();
        if (bGroupsOpened) {
          const groupItems = o.GroupList?.querySelectorAll('li') || [];
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
              const cs = o.ChannelList.querySelector('.selected');
              if (cs) cs.classList.remove('selected');
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

      // Channel settings open handling
      if (bChannelSettingsOpened) {
        e.preventDefault();
        const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
        const SETTINGS_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
        if (!SETTINGS_KEYS.includes(key)) return;
        if (isSubmenu) {
          const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') || [];
          if (key === 'ArrowUp') iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
          else if (key === 'ArrowDown') iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
          else if (key === 'Enter') submenuItems[iVideoSettingsIndex]?.click();
          else if (key === 'ArrowLeft' || key === 'Escape') {
            if (iVideoSettingsIndex === 0 && key === 'ArrowLeft') submenuItems[0]?.click();
            else hideVideoFormatMenu();
          }
          updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
        } else {
          const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') || [];
          if (key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
          else if (key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
          else if (key === 'Enter') mainItems[iChannelSettingsIndex]?.click();
          else if (key === 'ArrowRight') {
            const sel = mainItems[iChannelSettingsIndex];
            if (sel && iChannelSettingsIndex === 1) sel.click(); // open video format
          }
          else if (key === 'ArrowLeft' || key === 'Escape') hideChannelSettings();
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
        }
        return;
      }

      // Default player key handling mapping
      const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm', 'Backspace'];
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
        case 'Backspace': clearUi(); break;
      }

    }, { passive: false });
  }

  // ------------------------
  // Touch & mouse handling: unify single/double tap + swipe
  // ------------------------
  function setupControls() {
    const pc = o.PlayerContainer;
    if (!pc) return;

    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

    pc.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX; touchEndY = touchStartY;
      }
    }, { passive: true });

    pc.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }
    }, { passive: true });

    pc.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const targetElement = document.elementFromPoint(touchStartX, touchStartY);
      // ignore gestures started on UI elements
      if (targetElement && (targetElement.closest('#nav') || targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay'))) {
        touchStartX = touchStartY = touchEndX = touchEndY = 0;
        return;
      }
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absX = Math.abs(deltaX), absY = Math.abs(deltaY);
      const SWIPE_THRESHOLD = 50, TAP_THRESHOLD = 15;
      if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
        handleSwipeGesture(deltaX, deltaY, absX, absY);
        lastTapTime = 0;
      } else if (absX < TAP_THRESHOLD && absY < TAP_THRESHOLD) {
        const current = Date.now();
        if (current - lastTapTime < 300) {
          // double-tap
          handleDoubleTapAction();
          lastTapTime = 0;
        } else {
          // single-tap will fire via click handler below; just mark time
          lastTapTime = current;
          setTimeout(() => {
            // if not double tapped, trigger single tap action
            if (Date.now() - lastTapTime >= 300 && lastTapTime !== 0) {
              handleSingleTapAction();
              lastTapTime = 0;
            }
          }, 320);
        }
      }
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
    }, { passive: true });

    pc.addEventListener('click', (e) => {
      // ignore clicks on UI controls
      if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay') || e.target.closest('#PlayButton'))) return;
      // single click -> show info or close UI
      handleSingleTapAction();
    });

    pc.addEventListener('dblclick', (e) => {
      e.preventDefault();
      handleDoubleTapAction();
    });
  }

  function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
    const isHorizontal = absDeltaX > absDeltaY;
    if (isHorizontal) {
      // if overlays open, horizontal swipe closes them
      if (bGuideOpened) { window.hideGuide(); return; }
      if (bEpgOpened) { hideEpg(); return; }
      if (bSettingsModalOpened) { window.hideSettingsModal(); return; }
      // panel navigation
      if (deltaX > 0) { // swipe right
        if (bChannelSettingsOpened) hideChannelSettings();
        else if (bNavOpened && !bGroupsOpened) showGroups();
        else if (!bNavOpened) showNav();
      } else { // swipe left
        if (bGroupsOpened) hideGroups();
        else if (bNavOpened) hideNav();
        else if (!bChannelSettingsOpened) showChannelSettings();
      }
    } else {
      // vertical swipe -> change channel (if no overlay open)
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

  // ------------------------
  // Fullscreen helper
  // ------------------------
  function toggleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen().catch(err => console.error('Fullscreen enable error', err));
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      else console.warn('Fullscreen API not supported');
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(err => console.error('Fullscreen disable error', err));
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }

  // ------------------------
  // EPG / Channel Info / hide helpers already provided above
  // ------------------------
  function clearUi(exclude) {
    if (exclude !== 'nav' && exclude !== 'epg' && exclude !== 'guide') hideNav();
    if (exclude !== 'channelSettings' && exclude !== 'settingsModal') hideChannelSettings();
    if (exclude !== 'guide') window.hideGuide();
    if (exclude !== 'channelName') hideChannelName();
    if (exclude !== 'settingsModal') window.hideSettingsModal();
    if (exclude !== 'epg') hideEpg();
    if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) {
      clearTimeout(tempMessageTimeout);
      removeClass(o.TempMessageOverlay, 'visible');
      addClass(o.TempMessageOverlay, 'HIDDEN');
    }
  }

  // ------------------------
  // Stream info
  // ------------------------
  function updateStreamInfo() {
    const infoOverlay = o.StreamInfoOverlay;
    if (!infoOverlay || !player) return;
    try {
      const variant = (player.getVariantTracks() || []).find(t => t.active);
      if (!variant) { infoOverlay.innerHTML = 'Stream Info: N/A'; return; }
      const codecs = variant.codecs || 'N/A';
      const resolution = `${variant.width}x${variant.height}`;
      const bandwidth = (variant.bandwidth / 1000000).toFixed(2);
      infoOverlay.innerHTML = `Codecs:     ${codecs}\nResolution: ${resolution}\nBandwidth:  ${bandwidth} Mbit/s`;
    } catch (e) {
      console.warn('Could not get stream info', e);
      infoOverlay.innerHTML = 'Stream Info: Error';
    }
  }

  // ------------------------
  // Setup main menu buttons (guide/epg/play)
  // ------------------------
  function setupMainMenuControls() {
    const guideBtn = getEl('guide_button');
    const epgBtn = getEl('epg_button');
    if (guideBtn) guideBtn.onclick = () => { if (panelLock()) showGuide(); }; else console.warn('guide_button not found');
    if (epgBtn) epgBtn.onclick = () => { if (panelLock()) showEpg(); }; else console.warn('epg_button not found');
    if (o.PlayButton) {
      o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
      o.PlayButton.addEventListener('mousedown', handleFirstPlay);
    }
  }

  // ------------------------
  // Event wiring for search + play (already partly above)
  // ------------------------
  if (o.SearchField) {
    o.SearchField.addEventListener('input', () => {
      buildNav();
      if (aFilteredChannelKeys.length > 0) {
        iChannelListIndex = 0;
        if (isSessionActive) loadChannel(0);
        updateSelectedChannelInNav();
      } else {
        try { player?.unload(); } catch {}
        showIdleAnimation(true);
      }
    });
  }

  // ------------------------
  // EPG channel render and scroll handled above
  // ------------------------

  // ------------------------
  // Expose some functions to window scope for inline onclick handlers in your markup
  // (we already used inline onclicks in generated content)
  // ------------------------
  window.showVideoFormatMenu = showVideoFormatMenu;
  window.hideVideoFormatMenu = hideVideoFormatMenu;
  window.showSettingsModal = showSettingsModal;
  window.toggleFavourite = toggleFavourite;
  window.showNav = showNav;
  window.hideNav = hideNav;
  window.showGroups = showGroups;
  window.hideGroups = hideGroups;
  window.showChannelSettings = showChannelSettings;
  window.hideChannelSettings = hideChannelSettings;
  window.showEpg = showEpg;
  window.hideEpg = hideEpg;
  window.showGuide = window.showGuide; // already assigned
  window.hideGuide = window.hideGuide; // already assigned
  window.loadChannel = loadChannel;

  // ------------------------
  // Initialize
  // ------------------------
  document.addEventListener('DOMContentLoaded', initPlayer);

})(); // IIFE end
