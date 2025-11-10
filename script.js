let player = null; // This will now hold the JWPlayer instance
    let ui = null; // No longer used for JWPlayer, but kept for minimal disruption
    const o = {
      PlayerContainer: document.getElementById('playerContainer'),
      // --- CHANGE: Renamed AvPlayer to JwPlayer for clarity ---
      JwPlayerContainer: document.getElementById('video'), // Assuming the container is ID="video"
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
      ChannelInfoLogo: document.getElementById('ch_logo'),
      // --- PATCH: Added TempMessageOverlay from your usage ---
      TempMessageOverlay: document.getElementById('TempMessageOverlay') || document.createElement('div')
    };
    if (!document.getElementById('TempMessageOverlay')) {
        o.TempMessageOverlay.id = 'TempMessageOverlay';
        document.body.appendChild(o.TempMessageOverlay);
        // Add basic styles to keep it hidden initially
        Object.assign(o.TempMessageOverlay.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: '1000', padding: '20px 40px', background: 'rgba(0,0,0,0.7)',
            color: 'white', borderRadius: '10px', transition: 'opacity 0.3s',
            opacity: '0', pointerEvents: 'none', display: 'none'
        });
        o.TempMessageOverlay.classList.add('HIDDEN');
    }
    // --- END PATCH ---

    // --- FIX: Updated broken stream URLs with working test streams (copied from your input) ---
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
kapamilya: { name: "Kapamilya Channel HD", type: "clearkey", manifestUrl: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd", keyId: "bd17afb5dc9648a39be79ee3634dd4b8", key: "3ecf305d54a7729299b93a3a69c02ea5", logo: "https://cms.cignal.tv/Upload/Images/Kapamilya Channel Logo alpha.png", group:["news", "entertainment"], },
    
    };
    
    let aFilteredChannelKeys = [];
    let sSelectedGroup = '__all';
    let iCurrentChannel = 0; 
    let iGroupListIndex = 1; // Default to 'EPG' (index 1)
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
          let epgLi = getEl('epg_button');
          if (epgLi && allGroupLiItems.length > 1) {
              iGroupListIndex = Array.from(allGroupLiItems).indexOf(epgLi);
          } else {
              const allLi = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
              if (allLi) {
                  iGroupListIndex = Array.from(allGroupLiItems).indexOf(allLi);
              } else {
                  iGroupListIndex = 1; // Fallback
              }
          }
      } else {
          iGroupListIndex = 1;
      }

      buildNav();
      updateSelectedGroupInNav();

      // --- CHANGE: JWPLAYER INITIALIZATION ---
      // We don't need to check support or call shaka.polyfill.installAll()
      // We initialize an empty JW Player instance, which will be configured on loadChannel.
      // We assume the player div has the ID 'video' (standard JW setup)
      if (typeof jwplayer !== 'undefined') {
          player = jwplayer('video'); 
          // You can apply global settings here if needed, but not required for function.

          // --- ADD JWPLAYER EVENT LISTENERS ---
          player.on('error', e => {
              console.error('JW Player Error:', e.message || e);
              if (o.ChannelLoader) {
                  clearTimeout(loaderFadeTimeout);
                  o.ChannelLoader.classList.add('HIDDEN');
                  o.ChannelLoader.style.opacity = '1';
                  o.ChannelLoader.classList.remove('fade-out');
              }
              if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1';
              showIdleAnimation(true);
          });
          
          player.on('ready', () => {
              // JW Player UI is ready to use
          });

          player.on('levels', renderChannelSettings); // Used for quality/tracks change
          player.on('bufferChange', handleBuffering);
          player.on('play', handlePlaying); // Fires when playback starts
          player.on('levelsChanged', updateStreamInfo); // Fired when quality changes
          // --- END JWPLAYER EVENT LISTENERS ---

      } else {
          console.error("JWPlayer library not loaded.");
          return;
      }
      // --- END CHANGE ---

      setupControls();
      
      showIdleAnimation(true);
      loadInitialChannel();
    }
    
    // --- CHANGE: Updated for JWPlayer buffering event ---
    function handleBuffering(event) {
      clearTimeout(loaderFadeTimeout);
      // For JW Player, 'bufferChange' event parameter is true/false
      if (!event.buffer) {
        hideLoaderAndShowVideo();
      }
    }
    // --- END CHANGE ---
    
    // --- CHANGE: Updated for JWPlayer play event ---
    function handlePlaying() {
      // The JWPlayer 'play' event fires when playback starts after a buffer/ready state
      hideLoaderAndShowVideo();
    }
    // --- END CHANGE ---

function hideLoaderAndShowVideo() {
      clearTimeout(loaderFadeTimeout);
      // --- CHANGE: Use JwPlayerContainer ---
      if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1';
      // --- END CHANGE ---

      hideIdleAnimation(); 

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
        if (e.changedTouches.length !== 1) return;

        // --- CHANGE: Use JwPlayerContainer's DOM element for hit testing ---
        const playerDOMElement = o.JwPlayerContainer ? o.JwPlayerContainer.parentElement : null;
        if (playerDOMElement) {
            // Re-map the click event to the actual JW Player video element
            const jwPlayerVideo = playerDOMElement.querySelector('video');
            if (jwPlayerVideo) {
                // JWPlayer handles video element clicks, we only care about UI panels
                // We let JW Player handle video clicks for play/pause/fullscreen
            }
        }
        // --- END CHANGE ---

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
        if (deltaX > 0) { // --- Swipe Left-to-Right ---
          
          if (bChannelSettingsOpened) {
            // 1. If Right panel is open, L-R closes it.
            hideChannelSettings();
          } else if (bNavOpened && !bGroupsOpened) {
            // 2. If Channel List is open, L-R drills IN to Groups. (This is the fix)
            showGroups(); 
          } else if (!bNavOpened) {
            // 3. If all panels are closed, L-R opens the Channel List.
            showNav();
          }
          // 4. (Implicit) If Group List is open, L-R does nothing (at deepest level).

        } else if (deltaX < 0) { // --- Swipe Right-to-Left ---
          
          if (bNavOpened && bGroupsOpened) {
            // 1. If Group List is open, R-L goes BACK to Channel List.
            hideGroups();
          } else if (bNavOpened && !bGroupsOpened) {
            // 2. If Channel List is open, R-L CLOSES it.
            hideNav();
          } else if (!bNavOpened && !bChannelSettingsOpened) {
            // 3. If all panels are closed, R-L opens the Right (Settings) panel.
            showChannelSettings();
          }
          // 4. (Implicit) If Right (Settings) panel is open, R-L does nothing (at deepest level).
        }
      
      } else { // Vertical Swipe (Unchanged)
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
      let initialChannelKey = 'kapamilya'; // Changed default to one of your working channels
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


    // --- CHANGE: Rewritten loadChannel for JWPlayer ---
    async function loadChannel(index, options = {}) {
      clearTimeout(loaderFadeTimeout);

      if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
        console.warn("loadChannel called with no filtered channels available.");
        try { player?.stop(); } catch {} // Use JW Player stop
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
          console.log("Initial load: Setting channel but not loading stream.");
          localStorage.setItem('iptvLastWatched', newChannelKey);
         
          // --- CHANGE: Check for the video tag generated by JW Player ---
          const jwVideoElement = o.JwPlayerContainer.querySelector('video');
          if (jwVideoElement) jwVideoElement.style.opacity = '0';
          // --- END CHANGE ---
         
          if (o.ChannelLoader) { 
              clearTimeout(loaderFadeTimeout);
              o.ChannelLoader.classList.add('HIDDEN');
              o.ChannelLoader.style.opacity = '1';
              o.ChannelLoader.classList.remove('fade-out');
          }
         
          hideChannelName();
          updateSelectedChannelInNav(); 
          showIdleAnimation(true); 
          return;
      }

      if (isSessionActive) {
          hideIdleAnimation();
      }

      if (!player) {
          console.error("Player not initialized before loading channel.");
          return;
      }

      localStorage.setItem('iptvLastWatched', newChannelKey);

      showTempChannelSwitchMessage(newChannel.logo, newChannel.name, newChannel.number);

      // --- CHANGE: Check for the video tag generated by JW Player ---
      const jwVideoElement = o.JwPlayerContainer.querySelector('video');
      if (jwVideoElement) jwVideoElement.style.opacity = '0';
      // --- END CHANGE ---


      if (o.ChannelLoader) {
        const loaderText = document.getElementById('loading-channel-name');
        if (loaderText) {
          loaderText.textContent = `Loading ${newChannel.name}...`;
        }
        o.ChannelLoader.classList.remove('fade-out');
        o.ChannelLoader.style.opacity = '1';
        o.ChannelLoader.classList.remove('HIDDEN');
      }

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

        // Apply User-Agent via the setup call's 'headers' option if needed (JWPlayer supports this)
        const headers = newChannel.userAgent ? { 'User-Agent': newChannel.userAgent } : {};

        player.setup({
            file: newChannel.manifestUrl,
            type: playerType,
            drm: Object.keys(drmConfig).length ? drmConfig : undefined,
            autostart: isSessionActive, // Autostart only if session is active
            width: "100%",
            aspectratio: "16:9",
            stretching: "exactfit",
            // For custom headers (User-Agent) in DASH/HLS requests
            // Note: This feature's implementation can vary or may require a custom provider in JWPlayer
            // We'll trust the manifest loads without this for simplicity in this port.
            // You may need to add a custom request filter if User-Agent is critical.
            // headers: headers, // Disabled due to complexity/version-dependency in JW.
        });
        // --- END CORE JW PLAYER SETUP LOGIC ---
        
        if (isSessionActive) {
          // Playback starts automatically if autostart: true
          showChannelName();
        }

      } catch (error) {
        console.error(`Error loading channel "${newChannel?.name}":`, error);
        showIdleAnimation(true);
        if (o.ChannelLoader) {
          clearTimeout(loaderFadeTimeout);
          o.ChannelLoader.classList.add('HIDDEN');
          o.ChannelLoader.style.opacity = '1';
          o.ChannelLoader.classList.remove('fade-out');
        }
        // --- CHANGE: Use JwPlayerContainer's DOM element ---
        if (o.JwPlayerContainer) o.JwPlayerContainer.style.opacity = '1'; 
        // --- END CHANGE ---
      }
    }
    // --- END CHANGE ---

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

    // (The rest of the UI/Nav functions like buildDynamicGroupNav, selectGroup, buildNav, 
    // updateSelectedChannelInNav, updateSelectedGroupInNav remain mostly the same and rely 
    // on DOM manipulation, not on the player instance.)


    /* -------------------------
        Settings & Modals
        ------------------------- */
    function renderChannelSettings() {
      if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
      const currentChannelKey = aFilteredChannelKeys[iPlayingChannelIndex]; 
      const currentChannel = channels[currentChannelKey];
      if (!currentChannel) return;

      // --- CHANGE: Added null check for player, since JWPlayer's getLevels() is only available after content is loaded ---
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
    // --- END CHANGE ---

    // ... (showVideoFormatMenu, hideVideoFormatMenu, renderVideoFormatMenu, getAspectRatio, 
    // setAspectRatio, togglePlaybackControls, showSettingsModal, hideSettingsModal remain the same) ...
    
    // --- CHANGE: setQuality logic updated for JWPlayer ---
    window.setQuality = (selected) => {
      if (!player) return hideSettingsModal();
      
      try {
        if (selected === 'auto') {
          player.setQuality(0); // JWPlayer uses 0 for auto
        } else {
          // Quality levels are 1-based index in JWPlayer
          const levels = player.getQualityLevels();
          const levelIndex = levels.findIndex(level => level.label === selected); // Match by label (e.g., "1080p")

          if (levelIndex !== -1) { 
              player.setQuality(levelIndex); 
          } else { 
              console.warn("Selected quality track not found:", selected); 
              player.setQuality(0); 
          }
        }
      } catch(error) { 
          console.error("Error applying quality setting:", error); 
          try { player.setQuality(0); } catch {} // Fallback to auto
      }
      
      hideSettingsModal(); 
    }
    // --- END CHANGE ---

    // --- CHANGE: renderModalContent logic updated for JWPlayer ---
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
            // JW Player returns levels in an array, use player.getCurrentQuality() for selected index (0 for auto)
            const levels = player.getQualityLevels() || [];
            const currentLevel = player.getCurrentQuality();
            
            let itemsHtml = `<li class="modal-selectable" data-action="quality" data-value="auto" onclick="setQuality('auto')">Auto <input type="radio" name="quality" value="auto" ${currentLevel === 0 ? 'checked' : ''}></li>`;
            
            levels.forEach((track, index) => {
              // JWPlayer levels are 1-based index (index+1) when selecting via setQuality(index)
              const bps = track.bitrate > 1000000 ? `${(track.bitrate/1e6).toFixed(2)} Mbps` : `${Math.round(track.bitrate/1e3)} Kbps`;
              const label = track.label || `${index+1}`; // Use label (e.g., "1080p")
              const isChecked = (index + 1) === currentLevel; // Check if it's the current selected quality index
              
              itemsHtml += `<li class="modal-selectable" data-action="quality" data-value='${label}' onclick="setQuality('${label}')">${label}, ${bps} <input type="radio" name="quality" value='${label}' ${isChecked ? 'checked' : ''}></li>`;
            });
            
            contentHtml = `<h2>Video Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

          } else if (type === 'subtitles') {
            const textTracks = player.getCaptionList() || []; // JWPlayer Caption list
            const audioTracks = player.getAudioTracks() || []; // JWPlayer Audio track list
            const currentTextTrack = player.getCurrentCaptions(); // 0 for off, >0 for track index
            const currentAudioTrack = player.getCurrentAudioTrack(); // index of current audio track

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
            // ... (Edit Channel logic remains the same) ...
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
    // --- END CHANGE ---

    // ... (applyChannelEdit remains the same) ...

    // --- CHANGE: setSubtitles logic updated for JWPlayer ---
    window.setSubtitles = (trackIndex, isVisible) => {
        if (!player) return hideSettingsModal();
        try {
            if (!isVisible || trackIndex === 0) {
                 player.setCaptions(0); // 0 for off
            } else {
                 player.setCaptions(trackIndex); // Use the 1-based index
            }
        } catch(error) { console.error("Error setting subtitles:", error); }
        hideSettingsModal();
    };
    // --- END CHANGE ---

    // --- CHANGE: setAudio logic updated for JWPlayer ---
    window.setAudio = index => {
        if (!player) return hideSettingsModal();
        if (typeof index === 'number') {
            try { player.setAudioTrack(index); } // Use the 0-based index
            catch(error) { console.error("Error setting audio language:", error); }
        } else { console.warn("Invalid audio track index provided:", index); }
        hideSettingsModal();
    };
    // --- END CHANGE ---

    // ... (toggleFavourite, showTempChannelSwitchMessage, showTempMessage, 
    // showIdleAnimation, hideIdleAnimation, clearUi, showNav, hideNav, showGroups, 
    // hideGroups, showChannelSettings, hideChannelSettings, showGuide, hideGuide, 
    // renderGuideContent, showEpg, hideEpg, renderEpg, generateDummyEpg, 
    // showChannelName, hideChannelName, loadFavoritesFromStorage, saveFavoritesToStorage, 
    // handleFirstPlay, updateSettingsSelection, updateSettingsModalSelection, 
    // toggleFullScreen, Event Listeners remain largely the same, except for the player-specific ones) ...


    /**
     * Gets stats from JW Player and updates the Stream Info overlay.
     */
    // --- CHANGE: Rewritten for JW Player stats ---
    function updateStreamInfo() {
      const infoOverlay = o.CodecInfo; 
      if (!infoOverlay) return; 
     
      if (!player || !player.getPlaylistItem()) {
        infoOverlay.textContent = 'Player Info: N/A (No content playing)';
        return;
      }

      try {
        const stats = player.getStats();
        const currentQuality = player.getQualityLevels()[player.getCurrentQuality() - 1]; // -1 because quality index is 1-based
        
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
    // --- END CHANGE ---

    document.addEventListener('DOMContentLoaded', initPlayer);

    // --- REMOVED: All Shaka-UI cleanup listeners are removed as JW Player handles its own UI. ---
