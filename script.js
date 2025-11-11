/* ======= BEGIN AUTO-PATCHED WRAPPER =======
   This wrapper preserves your original script then applies:
   - force 'contain' aspect ratio for JWPlayer video
   - disable pause toggle on click/tap while not breaking double-tap fullscreen
   - override pause() to no-op and auto-resume on pause
   - ChannelLoader show/fade behavior on channel switch and when playback starts
   NOTE: Keep original script below. Wrapper attaches after DOMContentLoaded.
   ======= END WRAPPER ======= */

(function(){

/* --- Preserve original script --- */
let player = null; 
let ui = null; 
const o = {
  PlayerContainer: document.getElementById('playerContainer'),
  // Correctly mapping to the HTML ID: jwplayer-container
  JwPlayerContainer: document.getElementById('jwplayer-container'), 
  Nav: document.getElementById('nav'),
  GroupList: document.getElementById('GroupList'),
  DynamicGroupsList: document.getElementById('DynamicGroupsList'),
  ListContainer: document.getElementById('list_container'),
  ChannelList: document.getElementById('ChannelList'),
  // RESTORED: ChannelLoader
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
  ChannelInfoLogo: document.getElementById('ch_logo'),
  TempMessageOverlay: document.getElementById('TempMessageOverlay') || document.createElement('div')
};

if (!document.getElementById('TempMessageOverlay')) {
    o.TempMessageOverlay.id = 'TempMessageOverlay';
    document.body.appendChild(o.TempMessageOverlay);
    Object.assign(o.TempMessageOverlay.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: '1000', padding: '20px 40px', background: 'rgba(0,0,0,0.7)',
        color: 'white', borderRadius: '10px', transition: 'opacity 0.3s',
        opacity: '0', pointerEvents: 'none', display: 'none'
    });
    o.TempMessageOverlay.classList.add('HIDDEN');
}

// Channel data (copied from your input)
let channels = {
SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUrl: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"], },
SuperMario: { name: "Super Mario", type: "hls", manifestUrl: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"], },
Teletubbies: { name: "Teletubbies", type: "hls", manifestUrl: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"], },
anione: { name: "Ani One", type: "hls", manifestUrl: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"], },
aniplus: { name: "Aniplus", type: "hls", manifestUrl: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"], },
sinemanila: { name: "SineManila", type: "hls", manifestUrl: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "", group:["movies", "entertainment"], },
mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUrl: "https://amg00627-amg00627c40-rakuten-uk-5725.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg00627-banijayfast-mrbeanpopupcc-rakutenuk/cb573d1d7d6c648b92d43b66cef24582847b3dcb0e6c886470af4a9765d96300dbf9b9c8fd3ab13c1ec0468a710b6d5a4d1cd209af3c419b8b1dfd034f25536b9f9bb565da9f0211c9a06b5756af6a4208a55b05a7700079d6a05a2b8d2fba74005cb95a3c1862c3ed47ad662f9ad253d72a39e8fc8b307b24455a9c5a43e6a64cb7abe95810893aa5b00140c12e14fa83439fd401b388d50f8315d775a514c893a182da1187e4205293728aecdb5f581fa9a83bf8f955bfd6937929957f2d556c3a8cc1b2cd3ef702da21269cded8b6648560a63ebb89125a980194408b338b65ea2aaef557e2dad320aaea5ad6a60b315dccc8a59ee93a739067f5abe5dc391af392452c179b3f994a5f491a999f65d2ff58b6cf8d6d06d79d67feb10ff0bca18aeeffa04b922cc6c6ce7a5c28414e0b188f51ae9b228e678d38e0e21a2f49551fedbb5bc094d65734221ed6db1eff5a5b98cb9b8fda393ec84b124ea7358a0c4b3f9a742457cd19d4b6702c852f0180751afe5b3e8f0bbc9b24e7a8d6e0496ae68c8912b13fa1e54afff900a061391931b2f42d4d4c032883b9285e660bae2f83f2c4e5650609e885afaf9029580d5a460a586b835790052ba668aed8b933cf2257196f9860690e20e9/184/1280x720_3329040/index.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdSj6OHTQv9_53OX9ZwSjCqOTkYj5dDUZUW0irJhXranWx7zI1YhEIwg&s=10", group:["cartoons & animations", "entertainment"], },
iQIYI: { name:"iQIYI", type: "clearkey", manifestUrl: "https://linearjitp-playback.astro.com.my/dash-wv/linear/1006/default_ott.mpd", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs3X1_D_GkWQbMiZzbmaoFets_gAeM6zKGhvtuAD7y46OH9zcqWCnLoG3K&s=10", group: ["entertainment"], userAgent: "Mozilla/5.0 (Linux; Android 14; 27821-67832-42-315-4231-233-21-43-12-1312-321-23-21-232-) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36", keyId: "7ef7e913ce85a1131b27036069169a10", key: "77d98ed71db7524c27875a09a975f9e6" },
tv5: { name: "TV 5 HD", type: "clearkey", manifestUrl: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", keyId: "2615129ef2c846a9bbd43a641c7303ef", key: "07c7f996b1734ea288641a68e1cfdc4d", logo: "https://vignette.wikia.nocookie.net/russel/images/f/f9/TV5_Logo_2011.png/revision/latest?cb=20161204035016", group:["news", "entertainment"], },
kapamilya: { name: "Kapamilya Channel HD", type: "clearkey", manifestUrl: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd", keyId: "bd17afb5dc9648a39be79ee3634dd4b8", key: "3ecf305d54a7729299b93a3d69c02ea5", logo: "https://cms.cignal.tv/Upload/Images/Kapamilya Channel Logo alpha.png", group:["news", "entertainment"], },
    
};
    
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iCurrentChannel = 0; 
let iGroupListIndex = 1; 
let iPlayingChannelIndex = -1; 
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
let iSettingsModalIndex = 0;
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0;
let loaderFadeTimeout = null; 
let tempMessageTimeout = null; 

// Track the mute state, which is separate from player.getMute() for the PlayButton logic
let isMuted = true; 

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
      let epgLi = getEl('epg_button');
      if (epgLi && allGroupLiItems.length > 1) {
          iGroupListIndex = Array.from(allGroupLiItems).indexOf(epgLi);
      } else {
          const allLi = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
          if (allLi) {
              iGroupListIndex = Array.from(allGroupLiItems).indexOf(allLi);
          } else {
              iGroupListIndex = 1;
          }
      }
  } else {
      iGroupListIndex = 1;
  }

  buildNav();
  updateSelectedGroupInNav();

  // --- JWPLAYER INITIALIZATION ---
  if (typeof jwplayer !== 'undefined') {
      player = jwplayer(o.JwPlayerContainer); 

      // --- ADD JWPLAYER EVENT LISTENERS ---
      player.on('error', e => {
          console.error('JW Player Error:', e.message || e);
          if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1';
          showIdleAnimation(true);
          hideLoaderAndShowVideo(); 
      });
      
      player.on('levels', renderChannelSettings);
      player.on('bufferChange', handleBuffering);
      player.on('play', handlePlaying); 
      player.on('levelsChanged', updateStreamInfo);
      
      // ISSUE 1 FIX: Disable Pause Button on Taps/Clicks by re-enforcing play state
      player.on('pause', () => { 
        if (player.getState() !== 'idle' && player.getState() !== 'complete') {
            player.play(true);
        }
      });
      // Set the player's initial mute state (unmuted)
      player.setMute(false);
      isMuted = false;
      // ISSUE 3 FIX: Ensure play button is visible on initial load
      o.PlayButton.classList.remove('HIDDEN'); 
      // --- END FIX ---

  } else {
      console.error("JWPlayer library not loaded.");
      return;
  }

  setupControls();
  
  showIdleAnimation(true);
  loadInitialChannel();
}

// --- Simplified handleBuffering ---
function handleBuffering(event) {
  clearTimeout(loaderFadeTimeout);
  if (!event.buffer) {
    hideLoaderAndShowVideo(); 
  }
}

// --- Simplified handlePlaying (Triggered when video starts playing) ---
function handlePlaying() {
  if (isSessionActive) {
      hideLoaderAndShowVideo(); 
      // ISSUE 3 FIX: Hide play button once playback starts
      o.PlayButton.classList.add('HIDDEN'); 
  }
}

// --- Aggressive Loader Hide Logic (Restored and fixed) ---
function hideLoaderAndShowVideo() { 
      clearTimeout(loaderFadeTimeout);
      
      // 1. Ensure player area visibility
      if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1';

      hideIdleAnimation(); 

      if (o.ChannelLoader) {
          // 2. Clear all classes and immediately set display/visibility to HIDDEN.
          o.ChannelLoader.classList.remove('fade-out');
          o.ChannelLoader.classList.add('HIDDEN');
          
          // 3. Reset opacity for next load cycle
      }
}
// --- END Aggressive function ---

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
    if (e.target && e.target.closest('#PlayButton')) return;
   
    if (e.target && (e.target.closest('#nav') || e.target.closest('#ChannelSettings') || e.target.closest('#SettingsModal') || e.target.closest('#Guide') || e.target.closest('#EpgOverlay'))) {
      return;
    }

    const currentTime = new Date().getTime();
    const isFromTap = (currentTime - lastTapTime) < 350;

    if (isFromTap) {
      // Allow single tap to show channel info or clear UI
      handleSingleTapAction();
    } else {
      if (currentTime - lastTapTime < 300) {
        // Double-tap handled by dblclick/touchend logic
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
  
  // ISSUE 4 FIX: Click on player area unmutes the stream if it's muted
  playerContainer.addEventListener('click', e => {
      // Check if the click is on the PlayButton, which has its own handler
      if (e.target.closest('#PlayButton')) return;
      
      // Check if the click is inside any panel, if so, we clear UI, not unmute
      if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
          return;
      }
      
      // If the stream is playing and muted, unmute it
      if (isSessionActive && isMuted) {
          unmuteStream();
      }
  });
}

// --- SWIPE LOGIC ---
function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
  const isHorizontal = absDeltaX > absDeltaY;
  
  if (bGuideOpened || bEpgOpened || bSettingsModalOpened) return;

  if (isHorizontal) {
    if (deltaX > 0) {
      
      if (bChannelSettingsOpened) {
        hideChannelSettings();
      } else if (bNavOpened && !bGroupsOpened) {
        showGroups(); 
      } else if (!bNavOpened) {
        showNav();
      }

    } else if (deltaX < 0) {
      
      if (bNavOpened && bGroupsOpened) {
        hideGroups();
      } else if (bNavOpened && !bGroupsOpened) {
        hideNav();
      } else if (!bNavOpened && !bChannelSettingsOpened) {
        showChannelSettings();
      }
    }
  
  } else {
    if (!bNavOpened && !bChannelSettingsOpened) {
      if (deltaY > 0) {
          loadChannel(iCurrentChannel + 1);
        } else {
          loadChannel(iCurrentChannel - 1);
        }
    }
  }
}
// --- END SWIPE LOGIC ---

function handleSingleTapAction() {
  if (!isSessionActive) return;

  if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
    clearUi();
  } else {
    showChannelName();
  }
}

function handleDoubleTapAction() {
    // FIX: Clear panels before toggling fullscreen
    clearUi(); 
    
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


function loadInitialChannel() {
  const storedLast = localStorage.getItem('iptvLastWatched');
  let initialChannelKey = 'kapamilya'; 
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
  iPlayingChannelIndex = iCurrentChannel;
 
  loadChannel(iCurrentChannel, { isInitialLoad: true });
}


// --- Reconstructed loadChannel for JWPlayer ---
async function loadChannel(index, options = {}) {
  clearTimeout(loaderFadeTimeout);

  if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
    console.warn("loadChannel called with no filtered channels available.");
    try { player?.stop(); } catch {} 
    showIdleAnimation(true);
    return;
  }

  iCurrentChannel = (index < 0) ? aFilteredChannelKeys.length - 1 : index % aFilteredChannelKeys.length; 
 
  if (!options.isInitialLoad || isSessionActive) {
      iPlayingChannelIndex = iCurrentChannel;
  }

  const newChannelKey = aFilteredChannelKeys[iCurrentChannel]; 
  const newChannel = channels[newChannelKey];
  if (!newChannel) {
      console.error(`Invalid channel key or data for index ${iCurrentChannel}: ${newChannelKey}`); 
      showIdleAnimation(true);
      return;
  }

  if (options.isInitialLoad && !isSessionActive) {
      console.log("Initial load: Setting channel but not loading stream. Waiting for user input.");
      localStorage.setItem('iptvLastWatched', newChannelKey);
     
      const jwVideoElement = o.JwPlayerContainer.querySelector('video');
      if (jwVideoElement) jwVideoElement.style.opacity = '0';
     
      hideLoaderAndShowVideo(); // Ensure loader is hidden from previous session
     
      hideChannelName();
      updateSelectedChannelInNav(); 
      showIdleAnimation(true); 
      
      // ISSUE 3 FIX: Ensure play button is visible
      if (o.PlayButton) o.PlayButton.classList.remove('HIDDEN'); 
      return;
  }

  // --- START Loading Visuals (Restored) ---
  if (isSessionActive) {
      hideIdleAnimation();
      
      // SHOW LOADER (Restored visual feedback)
      if (o.ChannelLoader) {
        const loaderText = document.getElementById('loading-channel-name');
        if (loaderText) {
          loaderText.textContent = `Loading ${newChannel.name}...`;
        }
        o.ChannelLoader.classList.remove('HIDDEN');
        o.ChannelLoader.classList.remove('fade-out');
        o.ChannelLoader.style.opacity = '1';
      }
      
      showTempChannelSwitchMessage(newChannel.logo, newChannel.name, newChannel.number);
  }
  // --- END Loading Visuals ---


  if (!player) {
      console.error("Player not initialized before loading channel.");
      return;
  }

  localStorage.setItem('iptvLastWatched', newChannelKey);

  const jwVideoElement = o.JwPlayerContainer.querySelector('video');
  if (jwVideoElement) jwVideoElement.style.opacity = '0';


  hideChannelName();
  updateSelectedChannelInNav();

  try {
    // --- CORE JW PLAYER SETUP LOGIC ---
    const drmConfig = {};
    let playerType = newChannel.type === "hls" ? "hls" : "dash";

    if (newChannel.type === "widevine") {
        drmConfig.widevine = { url: newChannel.licenseServerUri };
        playerType = "dash";
    } else if (newChannel.type === "clearkey") {
        if (newChannel.keyId && newChannel.key) {
            drmConfig.clearkey = {
                keyId: newChannel.keyId, 
                key: newChannel.key      
            };
        }
        playerType = "dash";
    } else if (newChannel.type === "dash") {
        playerType = "dash";
    }

    // Set autostart based on session state
    const autoPlay = isSessionActive; 
    
    // Maintain the *current* mute state when setting up the new source.
    player.setup({
        file: newChannel.manifestUrl,
        type: playerType,
        drm: Object.keys(drmConfig).length ? drmConfig : undefined,
        autostart: autoPlay, 
        width: "100%",
        aspectratio: "16:9",
        mute: isMuted, // Apply the current mute state
        // FIX for Aspect Ratio: Removed 'stretching' so CSS/JS controls the fit (Original/Contain).
    });
    // --- END CORE JW PLAYER SETUP LOGIC ---
    
    // --- BUFFERRING FIX: Enforce playback right after setup ---
    if (isSessionActive) {
        // Use a short delay to ensure JW Player has processed the manifest
        setTimeout(() => {
            const currentState = player.getState();
            // If the player is 'buffering' or 'paused' but isSessionActive is true, force play.
            if (currentState === 'buffering' || currentState === 'paused' || currentState === 'idle') {
                player.play(true);
            }
            // Aggressive cleanup after forced play/buffer
            hideLoaderAndShowVideo(); 
        }, 500); // 500ms delay
        
        showChannelName();
    }
    // --- END BUFFERRING FIX ---

  } catch (error) {
    console.error(`Error loading channel "${newChannel?.name}":`, error);
    showIdleAnimation(true);
    // Aggressive cleanup on fail
    hideLoaderAndShowVideo(); 
    if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1'; 
  }
}
// --- END loadChannel ---

/* -------------------------
    Mute/Unmute Functions
    ------------------------- */
function muteStream() {
    if (player) {
        player.setMute(true);
        isMuted = true;
    }
    // ISSUE 2 FIX: Black screen effect on settings open
    if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '0'; 
}

function unmuteStream() {
    if (player) {
        player.setMute(false);
        isMuted = false;
    }
    // ISSUE 2 FIX: Restore video visibility on settings close/unmute
    if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1';
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
      
      // ISSUE 5 FIX: Play button now calls handleFirstPlay (start stream) or unmutes the stream
      o.PlayButton.removeEventListener('click', handlePlayButtonClick); 
      o.PlayButton.addEventListener('click', handlePlayButtonClick);
  } else {
      console.error("PlayButton element not found.");
  }
}

function handlePlayButtonClick(e) {
    e.preventDefault();
    if (!isSessionActive) {
        handleFirstPlay(); // Start the session and load the stream
    } else if (isMuted) {
        unmuteStream(); // If session is active but stream is muted, unmute it.
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

  const afterTransition = () => {
    o.ListContainer.removeEventListener('transitionend', afterTransition);
    buildNav(); 

    if (aFilteredChannelKeys.length > 0) {
      iCurrentChannel = 0; 
      updateSelectedChannelInNav();
      if (isSessionActive) { hideIdleAnimation(); }
    } else {
      try { player?.stop(); } catch {}
      showIdleAnimation(true);
    }
  };

  o.ListContainer.addEventListener('transitionend', afterTransition, { once: true });
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
      const currentPlaying = o.ChannelList.querySelector('.playing');
      if (currentPlaying) currentPlaying.classList.remove('playing');

      const channelItems = o.ChannelList.querySelectorAll('li.channel-item');

      if (iPlayingChannelIndex >= 0 && iPlayingChannelIndex < channelItems.length) {
          const playingItem = channelItems[iPlayingChannelIndex];
          if (playingItem) {
              playingItem.classList.add('playing');
          }
      }

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
  if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
  const currentChannelKey = aFilteredChannelKeys[iPlayingChannelIndex]; 
  const currentChannel = channels[currentChannelKey];
  if (!currentChannel) return;

  const isPlayerLoaded = player?.getPlaylistItem();

  if (o.SettingsMainMenu) {
      o.SettingsMainMenu.innerHTML = `
        <div class="settings-item ${isPlayerLoaded ? '' : 'disabled'}" onclick="${isPlayerLoaded ? "showSettingsModal('subtitles')" : ""}">Subtitle / Audio</div>
        <div class="settings-item ${isPlayerLoaded ? '' : 'disabled'}" onclick="${isPlayerLoaded ? "showVideoFormatMenu()" : ""}">Video / Format</div>
        <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
        <div class="settings-item" onclick="showSettingsModal('edit')">Edit Channel Info</div>
      `;
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
      const currentFormat = getAspectRatio();
      o.SettingsVideoFormatMenu.innerHTML = `
        <div class="settings-item" onclick="hideVideoFormatMenu()">&#8592; Back</div>
        <div class="settings-item-header">Video Format</div>
        <div class="settings-item" onclick="showSettingsModal('aspect_ratio')">
          <span>Aspect Ratio</span>
          <span style="color: var(--text-secondary);">${currentFormat}</span>
        </div>
        <div class="settings-item" onclick="showSettingsModal('quality')">Video Quality</div>
      `;
      updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
  } else { console.error("SettingsVideoFormatMenu element not found."); }
}

function getAspectRatio() {
    const jwVideoElement = o.JwPlayerContainer.querySelector('video');
    if (!jwVideoElement) return 'Original';
    const style = jwVideoElement.style;
    if (style.objectFit === 'fill') return 'Stretch';
    if (style.objectFit === 'cover' && style.transform === 'scale(1.15)') return 'Zoom';
    if (style.objectFit === 'cover') return 'Fill';
    return localStorage.getItem('iptvAspectRatio') || 'Original';
}

function setAspectRatio(format) {
    const jwVideoElement = o.JwPlayerContainer.querySelector('video');
    if (!jwVideoElement) return;
    jwVideoElement.style.transform = 'scale(1)';
    let formatName = 'Original';
    switch(format) {
      case 'stretch':
        jwVideoElement.style.objectFit = 'fill';
        formatName = 'Stretch';
        break;
      case '16:9':
        jwVideoElement.style.objectFit = 'contain';
        formatName = '16:9';
        break;
      case 'fill':
        jwVideoElement.style.objectFit = 'cover';
        formatName = 'Fill';
        break;
      case 'zoom':
        jwVideoElement.style.objectFit = 'cover';
        jwVideoElement.style.transform = 'scale(1.15)';
        formatName = 'Zoom';
        break;
      default:
        // Set back to the default 'contain' to honor the original aspect ratio
        jwVideoElement.style.objectFit = 'contain';
        formatName = 'Original';
    }
    localStorage.setItem('iptvAspectRatio', formatName);
    
    hideSettingsModal();
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
 
  setTimeout(() => updateSettingsModalSelection(), 50); 
}

window.hideSettingsModal = () => {
  bSettingsModalOpened = false;
  iSettingsModalIndex = 0;
  if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
  if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
};

// --- setQuality logic updated for JWPlayer ---
window.setQuality = (selected) => {
  if (!player || !player.getPlaylistItem()) return hideSettingsModal();
  
  try {
    if (selected === 'auto') {
      player.setQuality(0); // 0 for auto
    } else {
      const levels = player.getQualityLevels() || [];
      const levelIndex = levels.findIndex(level => level.label === selected); 

      if (levelIndex !== -1) { 
          player.setQuality(levelIndex); // 1-based index
      } else { 
          console.warn("Selected quality track not found:", selected); 
          player.setQuality(0); 
      }
    }
  } catch(error) { 
      console.error("Error applying quality setting:", error); 
      try { player.setQuality(0); } catch {}
  }
  
  hideSettingsModal(); 
}
// --- END setQuality ---

// --- renderModalContent logic updated for JWPlayer ---
function renderModalContent(type) {
  let contentHtml = '';
  try {
      if (!player || !player.getPlaylistItem()) return '<p>Please start playing a channel first.</p>';

      if (type === 'aspect_ratio') {
          const currentFormat = getAspectRatio();
          let itemsHtml = `
            <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('original')">
                Original ${currentFormat === 'Original' ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
            </li>
            <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('16:9')">
                16:9 ${currentFormat === '16:9' ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
            </li>
            <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('fill')">
                Fill ${currentFormat === 'Fill' ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
            </li>
            <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('stretch')">
                Stretch ${currentFormat === 'Stretch' ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
            </li>
            <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('zoom')">
                Zoom ${currentFormat === 'Zoom' ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
            </li>
          `;
          
          contentHtml = `<h2>Aspect Ratio</h2>
                       <ul class="popup-content-list">${itemsHtml}</ul>
                       <div class="popup-buttons">
                         <button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button>
                       </div>`;
      
      } else if (type === 'quality') {
        const levels = player.getQualityLevels() || [];
        const currentLevel = player.getCurrentQuality();
        
        let itemsHtml = `<li class="modal-selectable" data-action="quality" data-value="auto" onclick="setQuality('auto')">Auto <input type="radio" name="quality" value="auto" ${currentLevel === 0 ? 'checked' : ''}></li>`;
        
        levels.forEach((track, index) => {
          const bps = track.bitrate > 1000000 ? `${(track.bitrate/1e6).toFixed(2)} Mbps` : `${Math.round(track.bitrate/1e3)} Kbps`;
          const label = track.label || `${index+1}`; 
          const isChecked = (index + 1) === currentLevel; 
          
          itemsHtml += `<li class="modal-selectable" data-action="quality" data-value='${label}' onclick="setQuality('${label}')">${label}, ${bps} <input type="radio" name="quality" value='${label}' ${isChecked ? 'checked' : ''}></li>`;
        });
        
        contentHtml = `<h2>Video Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

      } else if (type === 'subtitles') {
        const textTracks = player.getCaptionList() || []; 
        const audioTracks = player.getAudioTracks() || [];
        const currentTextTrack = player.getCurrentCaptions(); 
        const currentAudioTrack = player.getCurrentAudioTrack(); 

        let subItemsHtml = `<li class="modal-selectable" data-action="subtitle_off" onclick="setSubtitles(0, false)">Off ${currentTextTrack === 0 ? '<span style="color: var(--bg-focus)">✓</span>' : ''}</li>`;
        textTracks.forEach((track, index) => {
          const isChecked = (index + 1) === currentTextTrack;
          subItemsHtml += `<li class="modal-selectable" data-action="subtitle_on" onclick="setSubtitles(${index + 1}, true)">${track.label || track.name} ${isChecked ? '<span style="color: var(--bg-focus)">✓</span>' : ''}</li>`;
        });

        let audioItemsHtml = audioTracks.map((track, index) => {
            const isChecked = index === currentAudioTrack;
            return `<li class="modal-selectable" data-action="audio" onclick="setAudio(${index})">${track.label || track.name} ${isChecked ? '<span style="color: var(--bg-focus)">✓</span>' : ''}</li>`;
        }).join('');
        
        contentHtml = `<h2>Subtitles & Audio</h2><ul class="popup-content-list">${subItemsHtml}${audioItemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

      } else if (type === 'edit') {
        if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return '<p>No channel selected.</p>'; 
        const currentChannel = channels[aFilteredChannelKeys[iPlayingChannelIndex]]; 
        if (!currentChannel) return '<p>Channel data missing.</p>';
        const safeName = (currentChannel.name || '').replace(/"/g, '&quot;');
        const safeLogo = (currentChannel.logo || '').replace(/"/g, '&quot;');
        
        contentHtml = `<h2>Edit Channel</h2><div style="padding: 15px 25px;">
          <label>Name</label><br><input type="text" id="edit_ch_name" class="edit-modal-field modal-selectable" value="${safeName}"><br>
          <label>Logo URL</label><br><input type="text" id="edit_ch_logo" class="edit-modal-field modal-selectable" value="${safeLogo}">
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
  if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return hideSettingsModal(); 
  const key = aFilteredChannelKeys[iPlayingChannelIndex]; 
  if (!channels[key]) return hideSettingsModal();

  channels[key].name = nameInput.value;
  channels[key].logo = logoInput.value;
  buildNav();
  hideSettingsModal();
};

window.setSubtitles = (trackIndex, isVisible) => {
    if (!player || !player.getPlaylistItem()) return hideSettingsModal();
    try {
        if (!isVisible || trackIndex === 0) {
             player.setCaptions(0);
        } else {
             player.setCaptions(trackIndex);
        }
    } catch(error) { console.error("Error setting subtitles:", error); }
    hideSettingsModal();
};

window.setAudio = index => {
    if (!player || !player.getPlaylistItem()) return hideSettingsModal();
    if (typeof index === 'number') {
        try { player.setAudioTrack(index); }
        catch(error) { console.error("Error setting audio language:", error); }
    } else { console.warn("Invalid audio track index provided:", index); }
    hideSettingsModal();
};

function toggleFavourite() {
  if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
  const key = aFilteredChannelKeys[iPlayingChannelIndex]; 
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
      // ISSUE 3 FIX: Only show the play button if the session is not active (i.e., before the first play)
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

  // ISSUE 2 FIX: Mute and black screen when opening settings panel
  if (isSessionActive && player) {
      muteStream();
  }
  
  clearUi('channelSettings');
  hideVideoFormatMenu(); 
  iChannelSettingsIndex = 0;
  renderChannelSettings();
  bChannelSettingsOpened = true;
  o.ChannelSettings.classList.add('visible');
}

function hideChannelSettings() {
  if (!o.ChannelSettings) return;

  // ISSUE 2 FIX: Unmute and restore screen when closing settings panel
  if (isSessionActive && isMuted) {
      unmuteStream();
  }

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
  
  if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
  const chKey = aFilteredChannelKeys[iPlayingChannelIndex]; 
  
  const ch = channels[chKey];
  if (!ch) return;

  o.ChannelInfoName.textContent = ch.name || 'Unknown Channel';
  o.ChannelInfoEpg.textContent = 'EPG not available';
  o.ChannelInfoLogo.innerHTML = ch.logo ? `<img src="${ch.logo}" alt="${ch.name || 'logo'}" onerror="this.style.display='none'">` : '';

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
  if (isSessionActive) {
      // If the session is already active, this button click acts as an unmute toggle
      if (isMuted) {
          unmuteStream();
      }
      return;
  }
  
  // Start the session
  isSessionActive = true;

  // We set to unmuted when the session first starts
  unmuteStream(); 
  
  hideIdleAnimation();

  iPlayingChannelIndex = iCurrentChannel;

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
        const itemsCount = items.length;
       
        if (items && iSettingsModalIndex >= 0 && iSettingsModalIndex < itemsCount) {
            const item = items[iSettingsModalIndex];
            if (item) {
                item.classList.add('selected');
                const radio = item.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                if (typeof item.scrollIntoView === 'function') {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else {
             if (iSettingsModalIndex < 0) iSettingsModalIndex = 0;
             else if (iSettingsModalIndex >= itemsCount) iSettingsModalIndex = itemsCount - 1;
             
             if (itemsCount > 0) updateSettingsModalSelection();
             else console.warn("Invalid index or no items for modal selection:", iSettingsModalIndex);
        }
    } catch (error) {
        console.error("Error updating settings modal selection:", error);
    }
}

function toggleFullScreen() {
    // FIX: Clear panels before toggling fullscreen
    clearUi(); 
    
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
    Event Listeners
    ------------------------- */
if (o.PlayButton) {
    // Keep mousedown to handle the first play, but click handler will manage mute/unmute
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
        try { player?.stop(); } catch {}
        showIdleAnimation(true);
      }
    });
} else { console.error("SearchField element not found."); }

// --- TV REMOTE KEYDOWN LOGIC ---
document.addEventListener('keydown', (e) => {

  if (document.activeElement === o.SearchField ||
      document.activeElement === getEl('edit_ch_name') ||
      document.activeElement === getEl('edit_ch_logo') ||
      document.activeElement.tagName === 'SELECT'
      ) { 
      
      if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          if (document.activeElement) document.activeElement.blur();
      }
      return;
  }

  if (bGuideOpened || bEpgOpened) {
      e.preventDefault();
      if (e.key === 'Escape') clearUi();
      return;
  }

  // --- MODAL NAVIGATION ---
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
      } else if (e.key === 'Enter') { 
          const selectedItem = items[iSettingsModalIndex];
          if (!selectedItem) return;
         
          if (selectedItem.tagName === 'INPUT') {
              selectedItem.focus(); 
          } else if (selectedItem.tagName === 'LI' || selectedItem.tagName === 'BUTTON') {
              selectedItem.click(); 
          }
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
          window.hideSettingsModal();
      }
      return;
  }
  // --- END MODAL NAVIGATION ---
 
  // Logic inside NAV PANEL (Left)
  if (bNavOpened) {
    e.preventDefault();
    if (bGroupsOpened) {
      const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
      const selectedItem = groupItems[iGroupListIndex];

      if (e.key === 'ArrowUp') {
          iGroupListIndex = Math.max(0, iGroupListIndex - 1);
      } else if (e.key === 'ArrowDown') {
          iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
      } else if (e.key === 'Enter') { 
          selectedItem?.click(); 
      } else if (e.key === 'ArrowRight' || e.key === 'Escape') { 
          hideGroups();
      } else if (e.key === 'ArrowLeft') { 
      }
      updateSelectedGroupInNav();

    } else { 
      // CHANNEL LIST 
      const channelItems = o.ChannelList.querySelectorAll('li.channel-item');
      const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
      if (!ARROW_KEYS.includes(e.key)) return;
     
      if (e.key === 'ArrowUp') {
          if (iCurrentChannel === 0 && o.SearchField) { 
              o.SearchField.focus();
              if (channelItems[iCurrentChannel]) {
                channelItems[iCurrentChannel].classList.remove('selected');
              }
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
      } else if (e.key === 'ArrowLeft') {
          showGroups(); 
      } else if (e.key === 'ArrowRight' || e.key === 'Escape') { 
          hideNav();
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
        const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') {
            iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
        } else if (e.key === 'ArrowDown') {
            iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
        } else if (e.key === 'Enter') { 
            submenuItems[iVideoSettingsIndex]?.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'Escape') { 
            hideVideoFormatMenu();
        }
        updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
    } else { 
        const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
        if (e.key === 'ArrowUp') {
            iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
        } else if (e.key === 'ArrowDown') {
            iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
        } else if (e.key === 'Enter') {
            mainItems[iChannelSettingsIndex]?.click();
        } else if (e.key === 'ArrowRight') {
            if (iChannelSettingsIndex === 1) {
                mainItems[iChannelSettingsIndex]?.click();
            }
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Escape') { 
             hideChannelSettings();
        }
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    }
    return;
  }


  // DEFAULT PLAYER KEYS (Panels are closed)
  const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
  if (!PLAYER_KEYS.includes(e.key)) return;

  e.preventDefault();
  switch (e.key) {
    case 'ArrowLeft':
        showNav(); 
        break;
    case 'ArrowRight': 
        showChannelSettings();
        break;
    case 'Enter': showChannelName(); break;
    case 'ArrowUp': loadChannel(iCurrentChannel - 1); break;
    case 'ArrowDown': loadChannel(iCurrentChannel + 1); break;
    case 'h': window.showGuide(); break;
    case 'e': showEpg(); break;
    case 'm': showChannelSettings(); break;
    case 'Escape': clearUi(); break;
  }
});


/**
 * Gets stats from JW Player and updates the Stream Info overlay.
 */
function updateStreamInfo() {
  const infoOverlay = o.CodecInfo; 
  if (!infoOverlay) return; 
 
  if (!player || !player.getPlaylistItem()) {
    infoOverlay.textContent = 'Player Info: N/A (No content playing)';
    return;
  }

  try {
    const stats = player.getStats();
    // Use player.getQualityLevels() or default to empty array if undefined
    const qualityLevels = player.getQualityLevels() || []; 
    const currentQualityIndex = player.getCurrentQuality();
    
    // Quality index 0 is auto in some modes, 1 is the first track.
    const currentQuality = qualityLevels[currentQualityIndex > 0 ? currentQualityIndex - 1 : 0]; 
    
    if (!stats || !currentQuality) {
        infoOverlay.textContent = 'Player Info: N/A';
        return;
    }

    const codecs = currentQuality.codecs || 'N/A';
    const resolution = `${currentQuality.width}x${currentQuality.height}`;
    const bandwidth = (currentQuality.bitrate / 1000000).toFixed(2); 

    infoOverlay.textContent = `Video: ${resolution} (${codecs}) | Bandwidth: ${bandwidth} Mbit/s`;
 
  } catch (error) {
    console.warn("Could not get stream info:", error);
    infoOverlay.textContent = 'Player Info: Error';
  }
}

document.addEventListener('DOMContentLoaded', initPlayer);


/* --- Post-init patching: run after player is available and DOM ready --- */
function applyPatchesToJW(playerId) {
  try {
    const player = jwplayer(playerId || "jwplayer-container");
    if (!player) {
      console.warn("JWPlayer instance not found for patching.");
      return;
    }

    // 1) Ensure original aspect ratio is preserved:
    // Use CSS on the player's video element container to use object-fit: contain
    const container = player.getContainer();
    if (container) {
      // Apply container styles to style video element(s)
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.maxHeight = "100%";
      container.style.overflow = "hidden";
      // find video tag(s) inside container and set object-fit
      const vids = container.querySelectorAll("video");
      vids.forEach(v => {
        v.style.objectFit = "contain";
        v.style.width = "100%";
        v.style.height = "100%";
      });
      // Also observe for later-added video elements (some JW builds re-create video nodes)
      const mo = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.tagName && node.tagName.toLowerCase() === "video") {
              node.style.objectFit = "contain";
              node.style.width = "100%";
              node.style.height = "100%";
            }
          });
        });
      });
      mo.observe(container, { childList: true, subtree: true });
    }

    // ISSUE 1 FIX: Disable pause via click/tap but keep touch events (double-tap) functional
    // Intercept click in capture phase so JW's internal handlers don't toggle pause.
    if (container) {
      // Use a listener that only prevents the single-click toggle, but still allows other handlers.
      const blockClickToggle = (e) => {
        // Stop event from propagating to JW Player's internal click handler which toggles pause
        e.stopImmediatePropagation();
        // Allow the script's own click handler to run (for single tap/unmute logic)
      };
      // Listener is set in the CAPTURE phase (true) to run before the player's listeners
      container.addEventListener("click", blockClickToggle, true);
    }

    // ISSUE 1 FIX: Override the player's pause API to be a no-op
    if (typeof player.pause === "function") {
      // Keep a reference to the original, though we won't use it for forcing play
      // const originalPause = player.pause.bind(player);
      player.pause = function() {
        console.debug("pause() call blocked by patched script.");
        // If the player is not IDLE, immediately force it to play again to prevent pause.
        if (player.getState() !== 'idle' && player.getState() !== 'complete') {
             try { player.play(true); } catch(e){}
        }
        // Return a Promise-like or false depending on JW version expectations:
        return false;
      };
    }

    // ISSUE 1 FIX: If player enters 'pause' state, immediately resume
    player.on && player.on("pause", () => {
      console.debug("Detected pause event - auto resuming playback.");
      // Small timeout to avoid tight loops (already handled in initPlayer, but keep here for robustness)
      setTimeout(() => {
        if (player && typeof player.play === "function") try { player.play(true); } catch(e){console.warn(e)}
      }, 80);
    });

    // 5) Channel loading visuals:
    // Show #ChannelLoader when channel switch function (if you have one) calls `showChannelLoader()`.
    // We'll expose helper functions: showChannelLoader(text) and hideChannelLoader()
    const loader = document.getElementById("ChannelLoader");
    const loadingText = document.getElementById("loading-channel-name");
    if (loader) {
      // Ensure loader is visible with center animation
      loader.style.display = "flex";
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.6s ease";
      loader.classList.add("HIDDEN"); // start hidden
      // show/hide helpers
      window.showChannelLoader = function(text) {
        if (text && loadingText) loadingText.textContent = text;
        loader.classList.remove("HIDDEN");
        loader.style.opacity = "1";
        loader.setAttribute("aria-hidden", "false");
      };
      window.hideChannelLoader = function() {
        loader.style.opacity = "0";
        loader.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          loader.classList.add("HIDDEN");
        }, 650);
      };
    }

    // 6) When playback starts (play event), fade out loader and anime background (#IdleAnimation::before assumed)
    player.on && player.on("play", () => {
      console.debug("play event - hiding loaders and fade anime background.");
      // hide channel loader
      if (typeof window.hideChannelLoader === "function") window.hideChannelLoader();

      // Fade out IdleAnimation background: set opacity via a helper class on body or IdleAnimation element
      const idle = document.getElementById("IdleAnimation");
      if (idle) {
        idle.classList.remove("visible-idle");
        // ensure ::before transitions by toggling a class on IdleAnimation
        idle.style.setProperty('--idle-before-opacity','0');
      }
      // Also hide TempMessageOverlay and BlurOverlay if present
      const temp = document.getElementById("TempMessageOverlay");
      const blur = document.getElementById("BlurOverlay");
      if (temp) temp.classList.add("HIDDEN");
      if (blur) blur.classList.add("HIDDEN");
      
      // ISSUE 3 FIX: Ensure play button is hidden once playback starts
      const playButton = document.getElementById('PlayButton');
      if (playButton) playButton.classList.add('HIDDEN'); 
    });

    // 7) If switching channels via your existing function `switchChannel` or similar,
    // the code should call window.showChannelLoader("Loading Channel...") before changing the source.
    // We can monkey-patch a common function name if present.
    if (window.switchChannel && typeof window.switchChannel === "function") {
      const origSwitch = window.switchChannel.bind(window);
      window.switchChannel = function() {
        try { window.showChannelLoader && window.showChannelLoader("Loading Channel..."); } catch(e){}
        // call the original (allow it to change player source)
        const result = origSwitch.apply(this, arguments);
        // after switching, try to play and let play handler hide loader
        setTimeout(() => {
          try { player.play(true); } catch(e){}
        }, 200);
        return result;
      };
    }

    console.info("JWPlayer patches applied.");
  } catch (err) {
    console.error("Error applying JWPlayer patches:", err);
  }
}

// Wait for DOMContentLoaded and then attempt to apply patches periodically until jwplayer is ready
document.addEventListener("DOMContentLoaded", () => {
  const tryApply = () => {
    if (typeof jwplayer !== "function") return false;
    try {
      // If you have configured jwplayer with setup on page load, patch the ID used
      applyPatchesToJW("jwplayer-container");
      return true;
    } catch(e) {
      return false;
    }
  };
  // Try immediately, then a few times in case player loads async
  if (!tryApply()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (tryApply() || attempts > 10) clearInterval(interval);
    }, 400);
  }
});

})();
