/* script.js — Restored old logic and applied bugfixes
    - Restores iCurrentChannel and old init/load/play logic.
    - Restores old settings panel logic (select dropdown, CodecInfo).
    - Restores old keydown/touch logic.
    - Fixes: Play button, stuck loader background, channel info on up/down.
    - MODIFIED: Enabled click-to-pause, fixed ArrowLeft from search bar, AND fixed modal key controls.
*/

/* -------------------------
    Globals & cached elements
    ------------------------- */
let player = null;
let ui = null;
const o = {
  PlayerContainer: document.getElementById('playerContainer'),
  AvPlayer: document.getElementById('avplayer'),
  Nav: document.getElementById('nav'),
  GroupList: document.getElementById('GroupList'),
  DynamicGroupsList: document.getElementById('DynamicGroupsList'),
  ListContainer: document.getElementById('list_container'), // FIX: Added ListContainer
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
  StreamInfoOverlay: document.getElementById('StreamInfoOverlay'), // Using this from new 'o'
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
  TempMessageOverlay: document.getElementById('TempMessageOverlay'), // Added from new 'o'
  CodecInfo: document.getElementById('CodecInfo') // From old 'o'
};

// Restored full channel list
let channels = {
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"] },
    StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"] },
    SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"] },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"] },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"] },
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"] },
    gma7: { name: "GMA 7", type: "clearkey", manifestUri: "https://vod.nathcreqtives.com/1093/manifest.mpd", keyId: "31363231383438333031323033393138", key: "38694e34324d543478316b7455753437", logo: "https://i.imgur.com/Cu1tAY8.png", group: ["news", "entertainment"] },
    jeepneytv: { name: "Jeepney TV", type: "clearkey", manifestUri: "https://abslive.akamaized.net/dash/live/2028025/jeepneytv/manifest.mpd", keyId: "90ea4079e02f418db7b170e8763e65f0", key: "1bfe2d166e31d03eee86ee568bd6c272", logo: "https://upload.wikimedia.org/wikipedia/en/1/15/Jeepney_TV_Logo_2015.svg", group: ["entertainment"] },
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
    mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUri: "https://example.com/placeholder.m3u8", logo: "https://placehold.co/100x100/000/fff?text=Mr+Bean", group: ["entertainment"] },
    iQIYI: { name: "iQIYI", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/1006/default_ott.mpd", keyId: "placeholder", key: "placeholder", logo: "https://placehold.co/100x100/000/fff?text=iQIYI", group: ["entertainment"] },
    tv5: { name: "TV 5 HD", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", keyId: "2615129ef2c846a9bbd43a641c7303ef", key: "07c7f996b1734ea288641a68e1cfdc4d", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/TV5_logo.svg/1200px-TV5_logo.svg.png", group: ["news", "entertainment"] },
    kapamilya: { name: "Kapamilya Channel HD", type: "clearkey", manifestUri: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd", keyId: "bd17afb5dc9648a39be79ee3634dd4b8", key: "3ecf305d54a7729299b93a3d69c02ea5", logo: "https://placehold.co/100x100/000/fff?text=Kapamilya", group: ["entertainment"] },
};

/* -------------------------
    State variables
    ------------------------- */
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iCurrentChannel = 0;
let iGroupListIndex = 1; // Default fallback index
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
let aEpgFilteredChannelKeys = []; // For EPG list
let iSettingsModalIndex = 0;
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0; // For double-tap
let loaderFadeTimeout = null;
let tempMessageTimeout = null;
let bHasPlayedOnce = false; // For buffering logic

/* -------------------------
    Utilities
    ------------------------- */
function getEl(id) { return document.getElementById(id); }

// ADDED: showTempMessage from new code
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

/* -------------------------
    Core Player Functions
    ------------------------- */
async function initPlayer() {
  // Assign numbers and keys
  Object.keys(channels).forEach((key, i) => {
    channels[key].number = i + 1;
    channels[key].key = key;
  });

  loadFavoritesFromStorage();
  setupMainMenuControls();
  buildDynamicGroupNav(); // Build the group list first
  sSelectedGroup = '__all'; // Set default group
  
  // Find the index for '__all' AFTER building the nav
  if (o.GroupList) {
      const allGroupLiItems = o.GroupList.querySelectorAll('li'); // Get all li items in the GroupList container
      const initialGroupItem = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all'); // Find the one with data-group='__all'
      
      if (initialGroupItem) {
          // Calculate index relative to ALL list items in GroupList
          iGroupListIndex = Array.from(allGroupLiItems).indexOf(initialGroupItem); 
      } else {
           // Fallback if '__all' isn't found 
          iGroupListIndex = Array.from(allGroupLiItems).findIndex(li => li.textContent.trim() === 'ALL CHANNELS');
          if (iGroupListIndex === -1) iGroupListIndex = 1; // Absolute fallback
          console.warn("'__all' group item not found, using fallback index:", iGroupListIndex);
      }
  } else {
      iGroupListIndex = 1; 
      console.warn("GroupList not found during init index calculation.");
  }
  
  buildNav(); // Build initial channel list for the default group
  updateSelectedGroupInNav(); // Update visual selection for the initial group

  await shaka.polyfill.installAll();
  if (!shaka.Player.isBrowserSupported()) {
    console.error("Browser not supported");
    return;
  }

  player = new shaka.Player();
  ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);
  
  // Configure UI
  ui.configure({
    controlPanelElements: [],
    addSeekBar: false,
    addBigPlayButton: false,
    showBuffering: true, // Use Shaka's default spinner
    clickToPlay: true // MODIFIED: Set to true for click-to-pause
  });

  player.attach(o.AvPlayer);

  player.configure({
    abr: { defaultBandwidthEstimate: 500000 },
    streaming: { rebufferingGoal: 2, bufferingGoal: 8 }
  });

  player.addEventListener('error', e => {
    console.error('Shaka Error:', e.detail);
    showIdleAnimation(true); // Keep showing idle on error
    // Hide custom loader on error
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
  });

  // ADDED: Listeners to fix stuck loader
  player.addEventListener('buffering', handleBuffering);
  player.addEventListener('playing', handlePlaying);
  player.addEventListener('trackschanged', renderChannelSettings);

  showIdleAnimation(true); // Show idle screen + play button
  loadInitialChannel(); // Load channel data, but don't play yet
}

// ADDED: Buffering handler
function handleBuffering(event) {
    if (event.buffering) {
      // If it's buffering AND we haven't played the first frame yet (initial load)
      if (!bHasPlayedOnce) {
        if (o.ChannelLoader) {
          o.ChannelLoader.classList.remove('HIDDEN');
          o.ChannelLoader.classList.remove('fade-out');
          o.ChannelLoader.style.opacity = '1';
          // Apply anime background (moved from loadChannel)
          o.ChannelLoader.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg')";
        }
      }
      // If bHasPlayedOnce is true, we do nothing, letting Shaka's default spinner show.
    } else {
      // Always hide our custom loader when buffering stops
      hideLoaderAndShowVideo();
    }
}

// ADDED: Playing handler
function handlePlaying() {
    bHasPlayedOnce = true; // Set flag
    hideLoaderAndShowVideo();
}

// ADDED: Loader helper
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

function loadInitialChannel() {
  const storedLast = localStorage.getItem('iptvLastWatched');
  let initialChannelKey = 'aniplus'; 
  if (!channels[initialChannelKey]) {
      initialChannelKey = Object.keys(channels)[0]; 
      if (!initialChannelKey) {
          console.error("No channels defined.");
          showIdleAnimation(true); 
          return;
      }
  }
  
  // Ensure aFilteredChannelKeys is populated if empty
  if (aFilteredChannelKeys.length === 0) {
      sSelectedGroup = '__all'; // Ensure correct group context
      buildNav(); 
      // If still empty after building nav, critical error
      if (aFilteredChannelKeys.length === 0) {
           console.error("No channels available even in the '__all' group.");
           showIdleAnimation(true);
           return;
      }
  }

  // Determine the best initial channel key
  if (storedLast && channels[storedLast] && aFilteredChannelKeys.includes(storedLast)) {
       // Use last watched if valid and available in current filter
       initialChannelKey = storedLast;
  } 
  else if (!aFilteredChannelKeys.includes(initialChannelKey)) {
      // If default ('aniplus') isn't in filter, use the absolute first channel from filter
      initialChannelKey = aFilteredChannelKeys[0]; 
  }
  
  // Final check if we have a valid key
  if (!initialChannelKey || !aFilteredChannelKeys.includes(initialChannelKey)) {
       console.error("Could not determine a valid initial channel from filtered list.");
       showIdleAnimation(true);
       return;
  }

  const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
  
  // Set the index, but load the channel
  iCurrentChannel = (initialIndex >= 0 ? initialIndex : 0);
  updateSelectedChannelInNav(); // Update highlight in nav
  loadChannel(iCurrentChannel, { isInitialLoad: true }); // Load it
}


async function loadChannel(index, options = {}) {
  // ADDED: Clear fade timeout
  clearTimeout(loaderFadeTimeout);

  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    console.warn("loadChannel called with no filtered channels available.");
    try { await player?.unload(); } catch {} 
    showIdleAnimation(true);
    return;
  }

  iCurrentChannel = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length;
  
  const channelKey = aFilteredChannelKeys[iCurrentChannel];
  if (!channelKey || !channels[channelKey]) {
       console.error(`Invalid channel key or data for index ${iCurrentChannel}: ${channelKey}`);
       showIdleAnimation(true); 
       return;
  }
  const channel = channels[channelKey];
  
  if (!player) {
       console.error("Player not initialized before loading channel.");
       return;
  }

  localStorage.setItem('iptvLastWatched', channelKey);

  // MODIFIED: Show loader, but don't apply background here
  if (o.ChannelLoader) {
    o.ChannelLoader.classList.remove('fade-out');
    o.ChannelLoader.style.opacity = '1';
    o.ChannelLoader.classList.remove('HIDDEN');
  }
  
  if (!options.isInitialLoad) { // Only hide video if not the very first load
    if (o.AvPlayer) o.AvPlayer.style.opacity = '0';
  }

  // FIX: Set session active and show channel name on ANY load
  if (!isSessionActive && !options.isInitialLoad) {
      isSessionActive = true;
      hideIdleAnimation();
  }
  showChannelName(); 
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

    // ADDED: Reset play flag
    bHasPlayedOnce = false;
    await player.load(channel.manifestUri);
    
    // Manage player state based on session activity
    if (isSessionActive) { 
      hideIdleAnimation(); 
      if (o.AvPlayer) {
          o.AvPlayer.muted = false;
          o.AvPlayer.play().catch(e => console.warn("Autoplay after load prevented.", e)); 
      }
    } else if (options.isInitialLoad) { 
         // If initial load AND session NOT active, keep idle screen + play button visible
         showIdleAnimation(true); 
         // HIDE loader (since play won't start)
         hideLoaderAndShowVideo();
    }
    
  } catch (error) {
    console.error(`Error loading channel "${channel?.name}":`, error);
    showIdleAnimation(true); // Show idle screen on error
    // Hide loader on error
    if (o.ChannelLoader) {
      clearTimeout(loaderFadeTimeout);
      o.ChannelLoader.classList.add('HIDDEN');
      o.ChannelLoader.style.opacity = '1';
      o.ChannelLoader.classList.remove('fade-out');
    }
  }
}

/* -------------------------
    UI and Navigation
    ------------------------- */
function setupMainMenuControls() {
  const guideBtn = getEl('guide_button');
  const epgBtn = getEl('epg_button');
  // Add listeners if elements exist
  if (guideBtn) guideBtn.onclick = showGuide;
  else console.warn("guide_button not found.");
  if (epgBtn) epgBtn.onclick = showEpg;
  else console.warn("epg_button not found.");

  if (o.PlayButton) {
      o.PlayButton.removeEventListener('mousedown', handleFirstPlay); // Remove potential duplicates
      o.PlayButton.addEventListener('mousedown', handleFirstPlay); 
  } else {
      console.error("PlayButton element not found.");
  }
}

// FIX: Build full list including static items, reattach listeners robustly
function buildDynamicGroupNav() {
  if (!o.DynamicGroupsList || !o.GroupList) {
      console.error("Required group list elements not found.");
      return; 
  }

  // Get unique dynamic groups, handle potential errors
  let sortedGroups = [];
  try {
      const allGroups = new Set(Object.values(channels).flatMap(ch => ch?.group || []));
      sortedGroups = [...allGroups].sort();
  } catch (error) { console.error("Error processing channel groups:", error); }
  
  // Clear only the dynamic list container
  o.DynamicGroupsList.innerHTML = ''; 

  // --- Create and Append ALL group items (static + dynamic) ---
  const allListItems = [];

  // Static: Favorites
  const favLi = document.createElement('li');
  favLi.dataset.group = '__fav';
  favLi.textContent = 'FAVORITES';
  allListItems.push(favLi);

  // Static: All Channels
  const allLi = document.createElement('li');
  allLi.dataset.group = '__all';
  allLi.textContent = 'ALL CHANNELS';
  allListItems.push(allLi);

  // Dynamic Groups
  sortedGroups.forEach(name => {
    const safeName = (name || 'Unnamed Group').replace(/</g, '&lt;');
    const dynamicLi = document.createElement('li');
    dynamicLi.dataset.group = safeName;
    dynamicLi.textContent = safeName.toUpperCase();
    allListItems.push(dynamicLi);
  });

  // Append all items to the DOM
  allListItems.forEach(li => o.DynamicGroupsList.appendChild(li));

  // --- Re-attach click handlers using the correct context ---
  // Select ALL list items within the main #GroupList container (including static nav, headers etc.)
  const fullGroupListItems = o.GroupList.querySelectorAll('li'); 
  
  fullGroupListItems.forEach((li, index) => {
      // Clear any previous listener first to prevent duplicates
      li.onclick = null; 
      
      // Add listener only if it's a clickable group item
      if (li.hasAttribute('data-group')) {
        li.onclick = () => selectGroup(index); // Use the index within the full list
      } 
      // Re-add listeners for static nav items (GUIDE/EPG) if necessary (though handled by setupMainMenuControls)
      else if (li.id === 'guide_button') {
         li.onclick = showGuide;
      } else if (li.id === 'epg_button') {
         li.onclick = showEpg;
      }
  });
}


// OLD selectGroup logic (with transitionend)
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
  // Ensure it's a clickable group item with a data-group attribute
  if (!item || !item.hasAttribute('data-group')) {
       return; // Ignore clicks on non-group items like headers
  }

  // Favorites Check
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
  const afterTransition = (event) => {
    // IMPORTANT: Ensure the event is for the 'transform' property AND targets the correct element
    if (event.propertyName !== 'transform' || event.target !== o.ListContainer) {
      return; 
    }
    
    // Remove the listener to prevent multiple executions
    o.ListContainer.removeEventListener('transitionend', afterTransition); 

    console.log("Transition ended for list_container, building nav..."); // Debug log

    buildNav(); // Rebuild the channel list based on the new group

    // --- Update UI, Reset Index ---
    if (aFilteredChannelKeys.length > 0) {
      iCurrentChannel = 0; // Reset channel index to the first in the new list
      updateSelectedChannelInNav(); // Highlight the first channel visually
      // Ensure idle screen is hidden if the session is already active
      if (isSessionActive) { 
          hideIdleAnimation(); 
      }
    } else {
      // If the selected group is empty
      try { player?.unload(); } catch {} // Unload current video if any
      showIdleAnimation(!isSessionActive); // Show idle (with play button only if session hasn't started)
    }
  };

  // Add the event listener *before* starting the transition
  o.ListContainer.addEventListener('transitionend', afterTransition, { once: true }); 

  console.log("Starting transition (hiding groups)..."); // Debug log
  // Start the transition by removing the class
  hideGroups(); 
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
    
  // --- Console Log for Debugging Blank Panel ---
  console.log(`Building Nav for group: "${sSelectedGroup}", Found channels: ${aFilteredChannelKeys.length}`);


  o.ChannelList.innerHTML = ''; // Clear previous content
  o.ChannelList.scrollTop = 0; // Ensure scrolled to top

  if (aFilteredChannelKeys.length === 0) {
    const msg = sSelectedGroup === '__fav' 
        ? 'No favorite channels found. Add channels using the settings menu (→).' 
        : 'No channels found in this category.';
    // Ensure list item styles allow wrapping
    o.ChannelList.innerHTML = `<li style="justify-content:center; color:#888; padding:12px; height: auto; line-height: normal; white-space: normal; text-align: center;">${msg}</li>`; 
    return;
  }

  const frag = document.createDocumentFragment();
  aFilteredChannelKeys.forEach((key, index) => {
    const ch = channels[key];
    if (!ch) return; // Skip if channel data is somehow missing
    
    const item = document.createElement('li');
    item.className = 'channel-item';
    item.onclick = () => {
      // Logic from old code
      if (isSessionActive) {
        loadChannel(index);
      } else {
        // If session not active, just select it, load happens on Play button click
        iCurrentChannel = index;
        updateSelectedChannelInNav();
      }
      setTimeout(hideNav, 50); // Small delay before closing nav
    };
    
    const fav = ch.favorite ? `<span class="fav-star">⭐</span>` : '';
    // Handle logo errors gracefully
    const logoHtml = ch.logo 
        ? `<div class="nav_logo"><img src="${ch.logo}" alt="" onerror="this.style.display='none'; this.onerror=null;"></div>` // Prevent infinite error loops
        : '<div class="nav_logo" style="width: 50px;"></div>'; // Consistent placeholder
        
    // Basic text sanitization
    const safeName = (ch.name || 'Unknown Channel').replace(/</g, '&lt;');
    
    item.innerHTML = `${fav}<span class="list-ch">${ch.number || '?'}</span><span class="list-title">${safeName}</span>${logoHtml}`;
    frag.appendChild(item);
  });
  
  o.ChannelList.appendChild(frag);
  updateSelectedChannelInNav(); // Highlight the correct channel
}


function updateSelectedChannelInNav() {
  if (!o.ChannelList) return; 
  try {
      const currentSelected = o.ChannelList.querySelector('.selected');
      if (currentSelected) currentSelected.classList.remove('selected');
      
      const channelItems = o.ChannelList.querySelectorAll('li.channel-item');
      
      // Validate index before using it
      if (iCurrentChannel >= 0 && iCurrentChannel < channelItems.length) {
          const newItem = channelItems[iCurrentChannel];
          if (newItem) {
            newItem.classList.add('selected');
            // Scroll only if Nav is open AND Group list is closed
            if (bNavOpened && !bGroupsOpened && typeof newItem.scrollIntoView === 'function') { 
                newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
      } else if (aFilteredChannelKeys.length > 0 && channelItems.length > 0) { 
           // Fallback: Index out of bounds, select first item if list not empty
           iCurrentChannel = 0; 
           const firstItem = channelItems[0];
           if (firstItem) firstItem.classList.add('selected');
           console.warn("iCurrentChannel was out of bounds, selecting first channel.");
       } else {
           // List is empty, reset index
           iCurrentChannel = -1;
       }
      
  } catch (error) { console.error("Error updating selected channel in nav:", error); }
}


function updateSelectedGroupInNav() {
   if (!o.GroupList) return;
   try {
       const currentSelected = o.GroupList.querySelector('.selected');
       if (currentSelected) currentSelected.classList.remove('selected');
       
       const allLis = o.GroupList.querySelectorAll('li');
       // Validate index before use
       if (iGroupListIndex >= 0 && iGroupListIndex < allLis.length) { 
           const newItem = allLis[iGroupListIndex];
           if (newItem) {
             newItem.classList.add('selected');
             // Scroll into view only if the group overlay is currently open
             if (bGroupsOpened && typeof newItem.scrollIntoView === 'function') {
                 newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
           }
       } else {
           // Index is invalid, log warning.
           console.warn("Cannot update selected group, invalid iGroupListIndex:", iGroupListIndex);
       }
   } catch (error) { console.error("Error updating selected group in nav:", error); }
}

/* -------------------------
    Settings & Modals
    ------------------------- */
// Restored old renderChannelSettings
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
  
  // Use CodecInfo from old code
  if (o.CodecInfo) {
      o.CodecInfo.textContent = `Video: ${vRes} (${vCodec}) | Audio: ${aCodec}`;
  }

  if (o.SettingsMainMenu) {
      o.SettingsMainMenu.innerHTML = `
        <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
        <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
        <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
      `;
      updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
  } else { console.error("SettingsMainMenu element not found"); }
}

// Restored old showVideoFormatMenu
function showVideoFormatMenu() {
  if (o.SettingsContainer) { 
    o.SettingsContainer.classList.add('submenu-visible');
    iVideoSettingsIndex = 0;
    renderVideoFormatMenu();
  } else { console.error("SettingsContainer element not found."); }
}

// Restored old hideVideoFormatMenu
function hideVideoFormatMenu() {
  if (o.SettingsContainer) { 
      o.SettingsContainer.classList.remove('submenu-visible');
      iChannelSettingsIndex = 1; 
      if (o.SettingsMainMenu) {
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
      } else { console.error("SettingsMainMenu element not found for focus update."); }
  } else { console.error("SettingsContainer element not found."); }
}

// Restored old renderVideoFormatMenu (with <select>)
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
        <div class="settings-item" onclick="showSettingsModal('quality')">Video track</div>
      `;
      // Find the current format and set the dropdown
      const currentFormat = getAspectRatio();
      const select = o.SettingsVideoFormatMenu.querySelector('select');
      if (select) {
        if (currentFormat === 'Stretch') select.value = 'stretch';
        else if (currentFormat === '16:9') select.value = '16:9';
        else if (currentFormat === 'Zoom') select.value = 'zoom';
        else select.value = 'original';
      }
      updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
  } else { console.error("SettingsVideoFormatMenu element not found."); }
}

// Restored old getAspectRatio
function getAspectRatio() {
    if (!o.AvPlayer) return 'Original';
    const style = o.AvPlayer.style;
    if (style.objectFit === 'fill') return 'Stretch';
    if (style.objectFit === 'cover' && style.transform === 'scale(1.15)') return 'Zoom';
    // Note: This version doesn't have a 'Fill' case
    return localStorage.getItem('iptvAspectRatio') || 'Original'; // Fallback
}


// Restored old setAspectRatio
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
}

function showSettingsModal(type) {
  if (!o.SettingsModal || !o.SettingsModalContent || !o.BlurOverlay) {
      console.error("Required modal elements not found.");
      return;
  }
  clearUi('settingsModal'); 
  o.BlurOverlay.classList.add('visible');
  bSettingsModalOpened = true;
  iSettingsModalIndex = 0; // Reset index
  try {
      o.SettingsModalContent.innerHTML = renderModalContent(type);
  } catch (error) {
      console.error("Error rendering modal content:", error);
      o.SettingsModalContent.innerHTML = '<p>Error loading content.</p>'; 
  }
  o.SettingsModal.classList.remove('HIDDEN');
  updateSettingsModalSelection(); // Added call
}

window.hideSettingsModal = () => {
  bSettingsModalOpened = false;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
  if (o.PlayerContainer) o.PlayerContainer.focus();
};

// Restored old renderModalContent
function renderModalContent(type) {
  let contentHtml = '';
  try {
      if (!player) return '<p>Player not initialized.</p>';

      if (type === 'quality') {
        const tracks = [...new Map((player.getVariantTracks() || []).filter(t => t.height).map(t => [t.height, t])).values()].sort((a,b)=>b.height-a.height);
        let itemsHtml = `<li class="modal-selectable" onclick="this.querySelector('input').checked=true">Auto <input type="radio" name="quality" value="auto" ${player.getConfiguration()?.abr?.enabled ? 'checked' : ''}></li>`;
        tracks.forEach(track => {
          const bps = track.bandwidth > 1000000 ? `${(track.bandwidth/1e6).toFixed(2)} Mbps` : `${Math.round(track.bandwidth/1e3)} Kbps`;
          const isChecked = track.active && !player.getConfiguration()?.abr?.enabled; 
          itemsHtml += `<li class="modal-selectable" onclick="this.querySelector('input').checked=true">${track.height}p, ${bps} <input type="radio" name="quality" value='${track.id}' ${isChecked ? 'checked' : ''}></li>`;
        });
        contentHtml = `<h2>Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" onclick="hideSettingsModal()">CANCEL</button><button class="modal-selectable" onclick="applyQualitySetting()">OK</button></div>`;
      
      } else if (type === 'subtitles') {
        const textTracks = player.getTextTracks() || [];
        const audioTracks = player.getAudioLanguagesAndRoles() || [];
        let subItemsHtml = `<li class="modal-selectable" onclick="setSubtitles(null, false)">Off</li>`;
        textTracks.forEach(track => {
          // Sanitize track object before stringifying for inline JS
          const safeTrackData = { id: track.id, label: track.label, language: track.language };
          const safeTrack = JSON.stringify(safeTrackData).replace(/</g, '\\u003c'); 
          subItemsHtml += `<li class="modal-selectable" onclick='setSubtitles(${safeTrack}, true)'>${track.label || track.language}</li>`;
        });
        let audioItemsHtml = audioTracks.map(track => `<li class="modal-selectable" onclick="setAudio('${track.language}')">${track.language} (Audio)</li>`).join('');
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
      // NOTE: Old code did not have a 'format' modal type, it used the <select> element.
  } catch (error) {
      console.error("Error generating modal content:", error);
      contentHtml = "<p>Error displaying options.</p>"; 
  }
  return contentHtml;
}

// Restored old modal helpers
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
  buildNav(); // Rebuild nav to reflect changes
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
        else { console.warn("Selected quality track not found:", selected); player.configure({ abr: { enabled: true } }); } // Fallback to auto
      }
  } catch(error) { console.error("Error applying quality setting:", error); try { player.configure({ abr: { enabled: true } }); } catch {} } // Fallback to auto on error
  hideSettingsModal();
};

window.setSubtitles = (track, isVisible) => {
  if (!player) return hideSettingsModal(); 
  try {
      player.setTextTrackVisibility(isVisible);
      // Ensure track exists and has an id before trying to select
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
    // Basic validation for language string
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
  
  // Update settings panel immediately if open
  if (bChannelSettingsOpened) { 
      renderChannelSettings(); 
  }
  
  // Rebuild nav list if open OR if the current group IS favorites
  if (bNavOpened || sSelectedGroup === '__fav') { 
      buildNav(); 
      // After rebuilding, re-apply the selection highlight to the correct item
      const newIndex = aFilteredChannelKeys.indexOf(key);
      if (newIndex !== -1) {
          iCurrentChannel = newIndex;
      } else if (aFilteredChannelKeys.length > 0) {
          iCurrentChannel = 0;
      } else {
          iCurrentChannel = 0; // Reset
      }
      updateSelectedChannelInNav(); 
  } 
}


/* -------------------------
    UI State & Helpers
    ------------------------- */
function showIdleAnimation(showPlayButton = false) {
  if (o.IdleAnimation) {
    o.IdleAnimation.style.backgroundImage = "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/sung-jinwoo-solo-leveling.jpg?w=1600&h=900&fit=crop')";
    o.IdleAnimation.classList.remove('HIDDEN');
  }
  if (o.PlayButton) {
      // Only show play button if session NOT active and requested
      if (showPlayButton && !isSessionActive) { 
          o.PlayButton.classList.remove('HIDDEN');
      } else {
          o.PlayButton.classList.add('HIDDEN');
      }
  }
}

function hideIdleAnimation() { 
    if (o.IdleAnimation) o.IdleAnimation.classList.add('HIDDEN'); 
    // Do NOT set isSessionActive here. Let handleFirstPlay manage it.
}


function clearUi(exclude) {
  // Close panels unless excluded
  if (exclude !== 'nav' && exclude !== 'epg' && exclude !== 'guide') hideNav();
  if (exclude !== 'channelSettings') hideChannelSettings();
  if (exclude !== 'guide') window.hideGuide(); // Use window.
  if (exclude !== 'channelName') hideChannelName();
  if (exclude !== 'settingsModal') window.hideSettingsModal(); // Use window.
  if (exclude !== 'epg') hideEpg();
  // Hide temp message
  if (o.TempMessageOverlay && !o.TempMessageOverlay.classList.contains('HIDDEN')) {
      clearTimeout(tempMessageTimeout);
      o.TempMessageOverlay.classList.remove('visible');
      o.TempMessageOverlay.classList.add('HIDDEN');
  }
  // Refocus player
  if (o.PlayerContainer) o.PlayerContainer.focus();
}


function showNav() {
  if (!o.Nav) return; 
  // clearUi('nav'); // Old code did not have this
  bNavOpened = true;
  o.Nav.classList.add('visible');
  updateSelectedChannelInNav();
}

function hideNav() {
  if (!o.Nav) return; 
  bNavOpened = false;
  bGroupsOpened = false; // Always close groups when closing main nav
  o.Nav.classList.remove('visible');
  // Ensure group view visually resets if it was open
  if (o.ListContainer?.classList.contains('groups-opened')) {
      hideGroups(); 
  }
  if (o.PlayerContainer) o.PlayerContainer.focus();
}

function showGroups() {
  // Ensure Nav is open and ListContainer exists
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
  if (o.CodecInfo) o.CodecInfo.textContent = ''; 
  if (o.StreamInfoOverlay) o.StreamInfoOverlay.classList.add('HIDDEN'); // Also hide this
  if (o.PlayerContainer) o.PlayerContainer.focus();
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
  if (o.PlayerContainer) o.PlayerContainer.focus();
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
    </ul>
  `;
}


/* -------------------------
    EPG
    ------------------------- */
function showEpg() {
  if (!o.EpgOverlay || !o.EpgChannels || !o.EpgTimeline) return; 
  clearUi('epg');
  
  // Use old EPG logic (base on 'all' channels)
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
    bEpgOpened = false; 
    if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN'); 
    if (o.PlayerContainer) o.PlayerContainer.focus();
}

function renderEpg() {
  if (!o.EpgChannels || !o.EpgTimeline) return; 
  
  let channelsHtml = '';
  // Use EPG list
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
  isSessionActive = true; // Set session active *now*
  
  hideIdleAnimation(); // Hide the visual idle screen
  
  if (o.AvPlayer) {
      o.AvPlayer.muted = false;
      o.AvPlayer.play().catch(e => {
          console.warn("Autoplay was prevented.", e);
          showIdleAnimation(true); // Show play button again if play failed
          isSessionActive = false; // Reset state if play failed immediately
      });
  } else { console.error("AV Player element not found."); isSessionActive = false; } // Reset state if player missing
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

// ADDED: From new code
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

// ADDED: From new code
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

// ADDED: updateStreamInfo (but modified to use CodecInfo if available)
function updateStreamInfo() {
  const infoOverlay = o.StreamInfoOverlay || o.CodecInfo; // Use old CodecInfo as fallback
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
    // Format for old CodecInfo vs new StreamInfoOverlay
    if (infoOverlay.id === 'CodecInfo') {
      infoOverlay.textContent = `Video: ${resolution} (${codecs.split(',')[0]}) | Audio: ${codecs.split(',')[1] || 'N/A'}`;
    } else {
      infoOverlay.innerHTML = `Codecs:     ${codecs}\nResolution: ${resolution}\nBandwidth:  ${bandwidth} Mbit/s`;
    }
  } catch (error) {
    console.warn("Could not get stream info:", error);
    infoOverlay.innerHTML = 'Stream Info: Error';
  }
}


/* -------------------------
    Event Listeners (keyboard / touch)
    ------------------------- */
// Using the event listeners block from your last prompt
if (o.PlayButton) {
    o.PlayButton.addEventListener('mousedown', handleFirstPlay);
} else { console.error("PlayButton element not found."); }

if (o.SearchField) {
    o.SearchField.addEventListener('input', () => {
      buildNav(); 
      if (aFilteredChannelKeys.length > 0) {
        // Only load if session active, reset index regardless
        iCurrentChannel = 0; 
        if (isSessionActive) { loadChannel(0); }
        updateSelectedChannelInNav(); // Update highlight even if not loading
      } else {
        try { player?.unload(); } catch {}
        showIdleAnimation(true); 
      }
    });
} else { console.error("SearchField element not found."); }

document.addEventListener('keydown', (e) => {
  // MODIFIED: Handle search bar focus differently
  if (document.activeElement === o.SearchField) {
      if (e.key === 'ArrowLeft') {
          o.SearchField.blur();
          if (bNavOpened && !bGroupsOpened) {
              showGroups();
          }
          e.preventDefault();
          return; // Handled
      }
      if (e.key === 'ArrowRight' || e.key === 'Escape') {
          o.SearchField.blur();
          if (bNavOpened) {
              hideNav();
          }
          e.preventDefault();
          return; // Handled
      }
      if (e.key === 'ArrowDown') {
          o.SearchField.blur();
          if (bNavOpened && !bGroupsOpened && aFilteredChannelKeys.length > 0) {
              iCurrentChannel = 0;
              updateSelectedChannelInNav();
          }
          e.preventDefault();
          return; // Handled
      }
      if (e.key === 'Enter') {
           o.SearchField.blur();
           e.preventDefault();
           return; // Handled
      }
      // Let other keys (typing) pass through
      return;
  }
  
  // *** ADDED: Correct block for modal controls ***
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
               if (typeof selectedItem.click === 'function') {
                 // Universal click handler for buttons or list items
                 selectedItem.click();
               }
          }
      } else if (e.key === 'Escape') {
          // Find a "CANCEL" or "CLOSE" button to click, otherwise just hide
          const closeButton = Array.from(items).find(btn => btn.tagName === 'BUTTON' && (btn.textContent.toUpperCase() === 'CANCEL' || btn.textContent.toUpperCase() === 'CLOSE'));
          if (closeButton) {
              closeButton.click();
          } else {
              window.hideSettingsModal();
          }
      }
      return;
  }
  // *** END: Correct block for modal controls ***

  // EPG open
  if (bEpgOpened) {
    e.preventDefault(); 
    const EPG_KEYS = ['Escape', 'ArrowUp', 'ArrowDown', 'Enter']; 
    if (!EPG_KEYS.includes(e.key)) return; 
    if (e.key === 'Escape') hideEpg();
    else if (e.key === 'ArrowUp') iEpgChannelIndex = Math.max(0, iEpgChannelIndex - 1);
    else if (e.key === 'ArrowDown') {
         const itemCount = o.EpgChannels?.querySelectorAll('.epg-ch-item').length ?? 0;
         iEpgChannelIndex = Math.min(itemCount - 1, iEpgChannelIndex + 1);
    }
    // else if (e.key === 'Enter') { /* Action */ }
    renderEpg(); 
    return; 
  }

  // Guide open
  if (bGuideOpened) {
       e.preventDefault();
       if (e.key === 'Escape') hideGuide();
       return; 
  }

  // Nav open
  if (bNavOpened) {
    e.preventDefault();
    if (bGroupsOpened) { // Group List
      const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
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
          if (iCurrentChannel === 0 && o.SearchField) { // Check for search field
              o.SearchField.focus(); // Focus search field
              iCurrentChannel = -1; // Set index to -1 to indicate search focus
              updateSelectedChannelInNav(); // Deselect item
          } else if (iCurrentChannel > 0) {
              iCurrentChannel = (iCurrentChannel - 1 + aFilteredChannelKeys.length) % aFilteredChannelKeys.length;
              updateSelectedChannelInNav();
          }
      }
      else if (e.key === 'ArrowDown') {
          if (iCurrentChannel === -1) { // If search is focused
              iCurrentChannel = 0; // Move to first item
              o.SearchField.blur();
              updateSelectedChannelInNav();
          } else {
             iCurrentChannel = (iCurrentChannel + 1) % aFilteredChannelKeys.length;
             updateSelectedChannelInNav();
          }
      }
      else if (e.key === 'Enter') { 
          if (iCurrentChannel !== -1) { // Only load if not on search
            loadChannel(iCurrentChannel); 
            hideNav(); 
          }
      }
      else if (e.key === 'ArrowRight' || e.key === 'Escape') hideNav(); 
      else if (e.key === 'ArrowLeft') {
          // MODIFIED: Removed faulty check
          showGroups(); 
      }
    }
    return; 
  }

  // Channel Settings open (FIX: Added .click() simulation for Enter/ArrowRight)
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
             // Simulate click on the selected submenu item
             if (submenuItems[iVideoSettingsIndex] && typeof submenuItems[iVideoSettingsIndex].click === 'function') {
                  submenuItems[iVideoSettingsIndex].click();
             }
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') hideVideoFormatMenu(); 
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else { // Main settings menu
        const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
        else if (e.key === 'ArrowDown') iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
        else if (e.key === 'Enter' || e.key === 'ArrowRight') {
             // Simulate click on the selected main menu item
             if (mainItems[iChannelSettingsIndex] && typeof mainItems[iChannelSettingsIndex].click === 'function') {
                  mainItems[iChannelSettingsIndex].click();
             }
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') hideChannelSettings(); 
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return; 
  }

  // Default player controls
  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape'];
  if (!PLAYER_KEYS.includes(e.key)) return; 
  e.preventDefault(); 
  switch (e.key) {
    case 'ArrowLeft': showNav(); break;
    case 'ArrowRight': showChannelSettings(); break;
    case 'Enter': showChannelName(); break; 
    case 'ArrowUp': loadChannel(iCurrentChannel - 1); break;
    case 'ArrowDown': loadChannel(iCurrentChannel + 1); break;
    case 'h': showGuide(); break;
    case 'e': showEpg(); break;
    case 'Escape': clearUi(); break; 
  }
});

// Using old touch logic from your paste
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchEndX = touchStartX; 
  touchEndY = touchStartY;
}, { passive: true }); 

document.addEventListener('touchmove', e => {
  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  // Check if touch started inside a panel, if so, ignore.
  const targetElement = document.elementFromPoint(touchStartX, touchStartY);
  if (targetElement && (targetElement.closest('#nav') || targetElement.closest('#ChannelSettings') || targetElement.closest('#SettingsModal') || targetElement.closest('#Guide') || targetElement.closest('#EpgOverlay') || targetElement.closest('#PlayButton') )) {
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
  }

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  const swipeThreshold = 50; 
  const tapThreshold = 10; 

  const isHorizontal = absDeltaX > absDeltaY;

  // TAP
  if (absDeltaX < tapThreshold && absDeltaY < tapThreshold) {
      // Double tap check
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) {
          toggleFullScreen();
          lastTapTime = 0;
      } else {
          // MODIFIED: Single Tap
          // Shaka 'clickToPlay=true' will handle pause/play.
          // We only handle closing UI if a panel is open.
          if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
              clearUi(); // Close any open UI
          }
          // REMOVED: showChannelName()
          lastTapTime = currentTime;
      }
      touchStartX = touchStartY = touchEndX = touchEndY = 0;
      return;
  }

  // SWIPE
  if (isHorizontal && absDeltaX > swipeThreshold) { // Horizontal
    if (deltaX > 0) { // Right
      if (bChannelSettingsOpened) hideChannelSettings(); 
      else if (bGroupsOpened) hideGroups(); 
      // else if (bNavOpened) { /* Close nav? */ hideNav(); } // Optional: close nav on swipe right
      else if (!bNavOpened) showNav(); // Only show if no panels open
    } else { // Left
      if (bNavOpened && !bGroupsOpened) showGroups(); 
      // else if (bNavOpened && bGroupsOpened) { /* Do nothing */ }
      // else if (bChannelSettingsOpened) { /* Open submenu? */ }
      else if (!bNavOpened && !bChannelSettingsOpened) showChannelSettings(); // Open settings only if closed
    }
  } else if (!isHorizontal && absDeltaY > swipeThreshold) { // Vertical
    if (!bNavOpened && !bChannelSettingsOpened && !bGuideOpened && !bEpgOpened && !bSettingsModalOpened) {
      if (deltaY > 0) loadChannel(iCurrentChannel + 1); // Down
      else loadChannel(iCurrentChannel - 1); // Up
    }
  }

  touchStartX = touchStartY = touchEndX = touchEndY = 0;
});


/* -------------------------
    Init
    ------------------------- */
// Use DOMContentLoaded for standard initialization
document.addEventListener('DOMContentLoaded', initPlayer);

