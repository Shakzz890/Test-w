/**
 * Shakzz TV Player v2 - Converted to JWPlayer
 *
 * This script manages the application state, UI navigation, and all
 * player controls for the JWPlayer instance.
 */

// -------------------------
//  CHANNEL DATA
// -------------------------
// --- FIX: Updated broken stream URLs with working test streams ---
let channels = {
    discoveryscience: { name: "Discovery Science", type: "clearkey", manifestUri: "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Discoveryscience2/default/manifest.mpd", keyId: "5458f45efedb4d6f8aa6ac76c85b621b", key: "dbf8a0a306a64525ba3012fd225370c0", logo: "  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkA_8vr9UZUhtkaFi6AshM83zQwhPWBGWX-Q&s", group: ["documentary"], },
    KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"], },
    // --- FIX: Replaced broken .PNG URL with a working HLS test stream ---
    StrawberryShortcake: { name: "Strawberry Shortcake (Test Stream 1)", type: "hls", manifestUri: "https://cph-p-2.ov.otto.de/master.m3u8", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"], },
    // --- FIX: Replaced protected/broken stream with a working DASH test stream ---
    SonictheHedgehog: { name: "Sonic the Hedgehog (Test Stream 2)", type: "dash", manifestUri: "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"], },
    SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"], },
    Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"], },
    // --- FIX: Corrected typo 'httpsM://' to 'https://' ---
    anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"], },
    jeepneytv: { name: "Jeepney TV", type: "clearkey", manifestUri: "https://abslive.akamaized.net/dash/live/2028025/jeepneytv/manifest.mpd", keyId: "90ea4079e02f418db7b170e8763e65f0", key: "1bfe2d166e31d03eee86ee568bd6c272", logo: "https://upload.wikimedia.org/wikipedia/en/1/15/Jeepney_TV_Logo_2015.svg", group:["entertainment"], },
    aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"], },
    sinemanila: { name: "SineManila", type: "hls", manifestUri: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "", group:["movies", "entertainment"], },
};


// -------------------------
//  GLOBAL VARIABLES
// -------------------------

/** @type {jwplayer.Player} */
let jwInstance = null; // Holds the JWPlayer instance

// DOM element cache
const o = {
    PlayerContainer: document.getElementById('playerContainer'),
    // The <video> tag is gone, replaced by the JWPlayer container
    jwplayerContainer: document.getElementById('jwplayer-container'),
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
    // CodecInfo is not in the HTML, but the function exists
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
    TempMessageOverlay: document.getElementById('TempMessageOverlay')
};

// State variables
let aFilteredChannelKeys = [];
let sSelectedGroup = '__all';
let iCurrentChannel = 0;
let iGroupListIndex = 1; // Default to 'EPG' (index 1)
let iPlayingChannelIndex = -1;
let isSessionActive = false; // Prevents loading until user clicks play
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

// Touch & Gesture state
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
let lastTapTime = 0;

// Timers
let channelNameTimeout = null;
let loaderFadeTimeout = null;
let tempMessageTimeout = null;

// -------------------------
//  UTILITIES
// -------------------------

function getEl(id) { return document.getElementById(id); }

/**
 * Scrolls a list item into view within its scrolling parent.
 * @param {HTMLElement} oListItem The list item to scroll to.
 */
function scrollToListItem(oListItem) {
    const oParentBox = oListItem.closest('.custom-scrollbar');
    if (oParentBox) {
        oParentBox.scrollTop = oListItem.offsetTop - oParentBox.offsetHeight * 0.4;
    }
}

// -------------------------
//  CORE PLAYER FUNCTIONS
// -------------------------

/**
 * Initializes the application, channel data, and the JWPlayer instance.
 */
async function initPlayer() {
    // 1. Process Channel Data
    Object.keys(channels).forEach((key, i) => {
        channels[key].number = i + 1;
        channels[key].key = key;
    });

    // 2. Setup UI and State
    loadFavoritesFromStorage();
    setupMainMenuControls();
    buildDynamicGroupNav();
    sSelectedGroup = '__all';

    // Default to EPG (index 1) or 'ALL CHANNELS' (index 3) if EPG isn't found
    if (o.GroupList) {
        const allGroupLiItems = o.GroupList.querySelectorAll('li');
        let epgLi = getEl('epg_button');
        if (epgLi && allGroupLiItems.length > 1) {
            iGroupListIndex = Array.from(allGroupLiItems).indexOf(epgLi);
        } else {
            const allLi = Array.from(allGroupLiItems).find(li => li.dataset.group === '__all');
            iGroupListIndex = allLi ? Array.from(allGroupLiItems).indexOf(allLi) : 1;
        }
    } else {
        iGroupListIndex = 1;
    }

    buildNav();
    updateSelectedGroupInNav();

    // 3. Initialize JWPlayer
    // All Shaka polyfills, checks, and setup are removed.
    try {
        jwInstance = jwplayer("jwplayer-container").setup({
            // Key is in the HTML <head>
            width: "100%",
            height: "100%",
            autostart: false, // We control playback with isSessionActive
            mute: true,     // Start muted for autoplay policies
            controls: false,    // Hide all default JWPlayer UI
            displaytitle: false,
            displaydescription: false,
            stretching: "uniform", // Default, maps to 'contain'
            renderCaptionsNatively: true, // Use browser captions
        });

        // 4. Setup JWPlayer Event Listeners
        jwInstance.on('error', e => {
            console.error('JWPlayer Error:', e);
            if (o.ChannelLoader) {
                clearTimeout(loaderFadeTimeout);
                o.ChannelLoader.classList.add('HIDDEN');
                o.ChannelLoader.style.opacity = '1';
                o.ChannelLoader.classList.remove('fade-out');
            }
            if (!isSessionActive) {
                showIdleAnimation(true);
            }
        });

        // 'playing' is the most reliable event for when content is visible
        jwInstance.on('playing', handlePlaying);

        // Update settings menu when tracks are available
        jwInstance.on('audioTracks', renderChannelSettings);
        jwInstance.on('subtitleTracks', renderChannelSettings);

        // Update stream info overlay on quality change
        jwInstance.on('visualQuality', updateStreamInfo);

    } catch (error) {
        console.error("Failed to initialize JWPlayer:", error);
        return;
    }

    // 5. Setup Final UI Controls
    setupControls();
    showIdleAnimation(true);
    loadInitialChannel();
}

/**
 * JWPlayer 'playing' event handler. Hides the loader.
 */
function handlePlaying() {
    hideLoaderAndShowVideo();
}

/**
 * Fades out the loading overlay.
 */
function hideLoaderAndShowVideo() {
    clearTimeout(loaderFadeTimeout);
    // No longer need to set o.AvPlayer.style.opacity
    hideIdleAnimation(); // Hide idle background when video starts

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

/**
 * Sets up all touch and click listeners on the player container.
 */
function setupControls() {
    const playerContainer = o.PlayerContainer;

    // --- Touch Listeners ---
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

    // --- Click Listeners ---
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

/**
 * Handles logic for swipe gestures.
 */
function handleSwipeGesture(deltaX, deltaY, absDeltaX, absDeltaY) {
    const isHorizontal = absDeltaX > absDeltaY;
    if (bGuideOpened || bEpgOpened || bSettingsModalOpened) return;

    if (isHorizontal) {
        if (deltaX > 0) { // --- Swipe Left-to-Right ---
            if (bChannelSettingsOpened) {
                hideChannelSettings();
            } else if (bNavOpened && !bGroupsOpened) {
                showGroups();
            } else if (!bNavOpened) {
                showNav();
            }
        } else if (deltaX < 0) { // --- Swipe Right-to-Left ---
            if (bNavOpened && bGroupsOpened) {
                hideGroups();
            } else if (bNavOpened && !bGroupsOpened) {
                hideNav();
            } else if (!bNavOpened && !bChannelSettingsOpened) {
                showChannelSettings();
            }
        }
    } else { // Vertical Swipe
        if (!bNavOpened && !bChannelSettingsOpened) {
            if (deltaY > 0) {
                loadChannel(iCurrentChannel + 1); // Swipe Down
            } else {
                loadChannel(iCurrentChannel - 1); // Swipe Up
            }
        }
    }
}

/**
 * Handles a single tap action on the player.
 */
function handleSingleTapAction() {
    if (!isSessionActive) return;

    if (bNavOpened || bChannelSettingsOpened || bGuideOpened || bEpgOpened || bSettingsModalOpened) {
        clearUi();
    } else {
        showChannelName();
    }
}

/**
 * Handles a double tap action on the player.
 */
function handleDoubleTapAction() {
    toggleFullScreen();
}


/**
 * Loads the initial channel (from storage or default) on app start.
 * This will NOT load the stream, just set the UI, until handleFirstPlay is called.
 */
function loadInitialChannel() {
    const storedLast = localStorage.getItem('iptvLastWatched');
    let initialChannelKey = 'KidoodleTV'; // Default channel
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
    } else if (!aFilteredChannelKeys.includes(initialChannelKey)) {
        initialChannelKey = aFilteredChannelKeys[0];
    }

    if (!initialChannelKey || !aFilteredChannelKeys.includes(initialChannelKey)) {
        console.error("Could not determine a valid initial channel from filtered list.");
        return;
    }

    const initialIndex = aFilteredChannelKeys.indexOf(initialChannelKey);
    iCurrentChannel = (initialIndex >= 0 ? initialIndex : 0);
    iPlayingChannelIndex = iCurrentChannel; // Set playing index
    
    // Call loadChannel, which will NOT load the stream because isSessionActive is false.
    loadChannel(iCurrentChannel, { isInitialLoad: true });
}


/**
 * Loads a new channel into the JWPlayer instance.
 * @param {number} index - The index of the channel to load from `aFilteredChannelKeys`.
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.isInitialLoad=false] - True if this is the first load.
 */
async function loadChannel(index, options = {}) {
    clearTimeout(loaderFadeTimeout);

    if (!aFilteredChannelKeys || aFilteredChannelKeys.length === 0) {
        console.warn("loadChannel called with no filtered channels available.");
        jwInstance?.stop();
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

    // --- Load-on-Click Logic ---
    // If this is the initial load AND the user hasn't clicked "Play" yet,
    // just set the UI and show the play button, but DO NOT load the stream.
    if (options.isInitialLoad && !isSessionActive) {
        console.log("Initial load: Setting channel but not loading stream.");
        localStorage.setItem('iptvLastWatched', newChannelKey);
        
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

    if (isSessionActive) {
        hideIdleAnimation();
    }

    if (!jwInstance) {
        console.error("JWPlayer not initialized before loading channel.");
        return;
    }

    localStorage.setItem('iptvLastWatched', newChannelKey);
    showTempChannelSwitchMessage(newChannel.logo, newChannel.name, newChannel.number);

    // Show loader
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
        // Build the JWPlayer playlist item
        let playlistItem = {
            file: newChannel.manifestUri
        };

        // Add ClearKey DRM info if present
        if (newChannel.type === 'clearkey' && newChannel.keyId && newChannel.key) {
            playlistItem.drm = {
                clearkey: {
                    keyId: newChannel.keyId,
                    key: newChannel.key
                }
            };
        }
        
        // Note: The 'userAgent' feature from Shaka is not supported by
        // JWPlayer's .load() method. This feature is omitted.

        // Load the new content
        jwInstance.load(playlistItem);

        if (isSessionActive) {
            jwInstance.setMute(false);
            jwInstance.play().catch(e => console.warn("Autoplay after load prevented.", e));
            showChannelName();
        }
    } catch (error) {
        console.error(`Error loading channel "${newChannel?.name}":`, error);
        
        // --- FIX: Only show idle animation if the session hasn't started ---
        if (!isSessionActive) {
            showIdleAnimation(true);
        }
        // --- END FIX ---

        if (o.ChannelLoader) {
            clearTimeout(loaderFadeTimeout);
            o.ChannelLoader.classList.add('HIDDEN');
            o.ChannelLoader.style.opacity = '1';
            o.ChannelLoader.classList.remove('fade-out');
        }
    }
}

// -------------------------
//  UI & NAVIGATION
// -------------------------

/**
 * Sets up click handlers for main menu items (Guide, EPG, Play).
 */
function setupMainMenuControls() {
    const guideBtn = getEl('guide_button');
    const epgBtn = getEl('epg_button');
    const listHeadline = document.querySelector('.list_headline');

    if (guideBtn) guideBtn.onclick = window.showGuide;
    if (epgBtn) epgBtn.onclick = showEpg;
    if (listHeadline) listHeadline.onclick = showGroups;

    if (o.PlayButton) {
        o.PlayButton.removeEventListener('mousedown', handleFirstPlay);
        o.PlayButton.addEventListener('mousedown', handleFirstPlay);
    } else {
        console.error("PlayButton element not found.");
    }
}

/**
 * Builds the dynamic list of channel groups.
 */
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
        } else if (li.id === 'guide_button') {
            li.onclick = window.showGuide;
        } else if (li.id === 'epg_button') {
            li.onclick = showEpg;
        }
    });
}

/**
 * Handles selection of a channel group.
 * @param {number} index - The index of the group item that was clicked.
 */
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
        buildNav(); // Rebuild the channel list

        if (aFilteredChannelKeys.length > 0) {
            iCurrentChannel = 0;
            updateSelectedChannelInNav();
            if (isSessionActive) { hideIdleAnimation(); }
        } else {
            jwInstance?.stop();
            showIdleAnimation(true);
        }
    };

    o.ListContainer.addEventListener('transitionend', afterTransition, { once: true });
    hideGroups(); // Slide back to channel list
}

/**
 * Builds the main channel navigation list based on the selected group and search term.
 */
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


/**
 * Updates the 'selected' and 'playing' classes in the channel list.
 */
function updateSelectedChannelInNav() {
    if (!o.ChannelList) return;
    try {
        const currentSelected = o.ChannelList.querySelector('.selected');
        if (currentSelected) currentSelected.classList.remove('selected');
        const currentPlaying = o.ChannelList.querySelector('.playing');
        if (currentPlaying) currentPlaying.classList.remove('playing');

        const channelItems = o.ChannelList.querySelectorAll('li.channel-item');

        // Add .playing class
        if (iPlayingChannelIndex >= 0 && iPlayingChannelIndex < channelItems.length) {
            const playingItem = channelItems[iPlayingChannelIndex];
            if (playingItem) {
                playingItem.classList.add('playing');
            }
        }

        // Add .selected class (for focus)
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

/**
 * Updates the 'selected' class in the group list.
 */
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

// -------------------------
//  SETTINGS & MODALS
// -------------------------

/**
 * Renders the main settings menu content.
 */
function renderChannelSettings() {
    if (!jwInstance) return; // Wait for player

    if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return;
    const currentChannelKey = aFilteredChannelKeys[iPlayingChannelIndex];
    const currentChannel = channels[currentChannelKey];
    if (!currentChannel) return;

    if (o.SettingsMainMenu) {
        o.SettingsMainMenu.innerHTML = `
            <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
            <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
            <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
            <div class="settings-item" onclick="showSettingsModal('edit')">Edit Channel Info</div>
        `;
        updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
    } else { console.error("SettingsMainMenu element not found"); }
}

/**
 * Shows the video format submenu.
 */
function showVideoFormatMenu() {
    if (o.SettingsContainer) {
        o.SettingsContainer.classList.add('submenu-visible');
        iVideoSettingsIndex = 0;
        renderVideoFormatMenu();
    } else { console.error("SettingsContainer element not found."); }
}

/**
 * Hides the video format submenu.
 */
function hideVideoFormatMenu() {
    if (o.SettingsContainer) {
        o.SettingsContainer.classList.remove('submenu-visible');
        iChannelSettingsIndex = 1; // Focus 'Video / Format' (index 1)
        if (o.SettingsMainMenu) {
            updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
        } else { console.error("SettingsMainMenu element not found for focus update."); }
    } else { console.error("SettingsContainer element not found."); }
}

/**
 * Renders the video format submenu content.
 */
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

/**
 * Gets the current aspect ratio setting.
 * @returns {string} The name of the current aspect ratio.
 */
function getAspectRatio() {
    if (!jwInstance) return 'Original';
    const stretch = jwInstance.getConfig()?.stretching;
    switch (stretch) {
        case 'exactfit': return 'Stretch';
        case 'fill': return 'Fill'; // JWPlayer "fill" is "cover"
        // 'zoom' is not directly supported, maps to Fill
        case 'uniform':
        default:
            return localStorage.getItem('iptvAspectRatio') || 'Original';
    }
}

/**
 * Sets the aspect ratio (stretching) on the player.
 * @param {string} format - The format to set ('original', 'stretch', 'fill', 'zoom', '16:9').
 */
function setAspectRatio(format) {
    if (!jwInstance) return;
    let formatName = 'Original';
    let stretchMode = 'uniform'; // 'contain'

    switch (format) {
        case 'stretch':
            stretchMode = 'exactfit'; // 'fill'
            formatName = 'Stretch';
            break;
        case 'fill':
            stretchMode = 'fill'; // 'cover'
            formatName = 'Fill';
            break;
        case 'zoom':
            stretchMode = 'fill'; // 'cover' - No zoom support
            formatName = 'Zoom';
            break;
        case '16:9':
        case 'original':
        default:
            stretchMode = 'uniform'; // 'contain'
            formatName = 'Original';
            break;
    }
    
    jwInstance.setStretching(stretchMode);
    localStorage.setItem('iptvAspectRatio', formatName);

    hideSettingsModal();
    renderVideoFormatMenu(); // Re-render submenu to show new value
}

/**
 * Shows a settings modal dialog.
 * @param {string} type - The type of modal to show ('subtitles', 'quality', 'edit', 'aspect_ratio').
 */
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

/**
 * Hides the currently open settings modal.
 */
window.hideSettingsModal = () => {
    bSettingsModalOpened = false;
    iSettingsModalIndex = 0;
    if (o.SettingsModal) o.SettingsModal.classList.add('HIDDEN');
    if (o.BlurOverlay) o.BlurOverlay.classList.remove('visible');
};

/**
 * Applies a selected quality level to the player.
 * @param {number|string} selected - The quality level index or 'auto'.
 */
function setQuality(selected) {
    if (!jwInstance) return hideSettingsModal();
    
    try {
        if (selected === 'auto') {
            // Find the 'auto' level (usually index 0)
            const qualityLevels = jwInstance.getQualityLevels();
            const autoIndex = qualityLevels.findIndex(level => level.label.toLowerCase() === 'auto');
            jwInstance.setCurrentQuality(autoIndex >= 0 ? autoIndex : 0);
        } else {
            // 'selected' is the index
            jwInstance.setCurrentQuality(selected);
        }
    } catch (error) {
        console.error("Error applying quality setting:", error);
    }
    
    hideSettingsModal(); // Close modal immediately
}

/**
 * Generates the HTML content for a settings modal.
 * @param {string} type - The type of modal to render.
 * @returns {string} The HTML string for the modal content.
 */
function renderModalContent(type) {
    let contentHtml = '';
    if (!jwInstance) return '<p>Player not initialized.</p>';

    try {
        if (type === 'aspect_ratio') {
            const currentFormat = getAspectRatio();
            let itemsHtml = [
                { key: 'original', name: 'Original' },
                { key: '16:9', name: '16:9' },
                { key: 'fill', name: 'Fill' },
                { key: 'stretch', name: 'Stretch' },
                { key: 'zoom', name: 'Zoom' }
            ].map(item => `
                <li class="modal-selectable" data-action="aspect" onclick="setAspectRatio('${item.key}')">
                    ${item.name} ${currentFormat === item.name ? '<span style="color: var(--bg-focus)">✓</span>' : ''}
                </li>
            `).join('');
            
            contentHtml = `<h2>Aspect Ratio</h2>
                           <ul class="popup-content-list">${itemsHtml}</ul>
                           <div class="popup-buttons">
                             <button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button>
                           </div>`;

        } else if (type === 'quality') {
            const qualityLevels = jwInstance.getQualityLevels(); // [{label, bitrate, height}]
            const currentQuality = jwInstance.getCurrentQuality(); // index
            
            let itemsHtml = '';
            qualityLevels.forEach((level, index) => {
                const isChecked = (index === currentQuality);
                const bps = level.bitrate > 1000000 ? `${(level.bitrate / 1e6).toFixed(2)} Mbps` : `${Math.round(level.bitrate / 1e3)} Kbps`;
                let label = level.label;
                if(label.toLowerCase() !== 'auto' && level.height) {
                    label = `${level.height}p, ${bps}`;
                }
                const action = (level.label.toLowerCase() === 'auto') ? "'auto'" : index;
                
                itemsHtml += `<li class="modal-selectable" data-action="quality" data-value='${index}' onclick="setQuality(${action})">
                                ${label} <input type="radio" name="quality" value='${index}' ${isChecked ? 'checked' : ''}>
                              </li>`;
            });
            
            contentHtml = `<h2>Video Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

        } else if (type === 'subtitles') {
            const audioTracks = jwInstance.getAudioTracks() || [];
            const textTracks = jwInstance.getSubtitleTracks() || [];
            const currentAudio = jwInstance.getCurrentAudioTrack(); // index
            const currentSubs = jwInstance.getCurrentSubtitle(); // index

            let subItemsHtml = `<li class="modal-selectable" data-action="subtitle_off" onclick="setSubtitles(0)">Off <input type="radio" name="subs" value="0" ${currentSubs === 0 ? 'checked' : ''}></li>`;
            textTracks.forEach((track, index) => {
                // JWPlayer index 0 is 'Off', so real tracks start at 1
                const trackIndex = index + 1;
                if (track.id === 'default') return; // Skip default/off
                const isChecked = (trackIndex === currentSubs);
                subItemsHtml += `<li class="modal-selectable" data-action="subtitle_on" onclick="setSubtitles(${trackIndex})">
                                   ${track.label || track.language || `Track ${trackIndex}`} <input type="radio" name="subs" value="${trackIndex}" ${isChecked ? 'checked' : ''}>
                                 </li>`;
            });

            let audioItemsHtml = '';
            audioTracks.forEach((track, index) => {
                const isChecked = (index === currentAudio);
                audioItemsHtml += `<li class="modal-selectable" data-action="audio" onclick="setAudio(${index})">
                                    ${track.label || track.language || `Audio ${index}`} (Audio) <input type="radio" name="audio" value="${index}" ${isChecked ? 'checked' : ''}>
                                   </li>`;
            });

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

/**
 * Applies edits made in the 'Edit Channel' modal.
 */
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

/**
 * Sets the active subtitle track.
 * @param {number} trackIndex - The index of the subtitle track (0 is 'Off').
 */
window.setSubtitles = (trackIndex) => {
    if (!jwInstance) return hideSettingsModal();
    try {
        jwInstance.setCurrentSubtitle(trackIndex);
    } catch (error) { console.error("Error setting subtitles:", error); }
    hideSettingsModal();
};

/**
 * Sets the active audio track.
 * @param {number} trackIndex - The index of the audio track.
 */
window.setAudio = trackIndex => {
    if (!jwInstance) return hideSettingsModal();
    try {
        jwInstance.setCurrentAudioTrack(trackIndex);
    } catch (error) { console.error("Error setting audio language:", error); }
    hideSettingsModal();
};

/**
 * Toggles the 'favorite' status of the currently playing channel.
 */
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


// -------------------------
//  UI STATE & HELPERS
// -------------------------

/**
 * Shows a temporary message overlay when switching channels.
 */
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

/**
 * Shows a generic temporary message.
 * @param {string} message - The text message to display.
 */
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

/**
 * Shows the idle/home screen animation.
 * @param {boolean} [showPlayButton=false] - Whether to show the big play button.
 */
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

/**
 * Hides the idle/home screen animation.
 */
function hideIdleAnimation() {
    if (o.IdleAnimation) o.IdleAnimation.classList.add('HIDDEN');
}


/**
 * Closes all open UI panels and modals.
 * @param {string} [exclude] - A panel ID to exclude from closing.
 */
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

// --- Left Panel - Main Channel List ---
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

// --- Left Panel - Drill Down to Groups ---
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

// --- Right Panel - Channel Settings ---
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

// --- Guide Modal ---
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


// -------------------------
//  EPG
// -------------------------

function showEpg() {
    if (!o.EpgOverlay || !o.EpgChannels || !o.EpgTimeline) return;
    clearUi('epg');

    let aEpgFilteredChannelKeys = Object.keys(channels)
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

    renderEpg(aEpgFilteredChannelKeys);
    bEpgOpened = true;
    o.EpgOverlay.classList.remove('HIDDEN');
}

function hideEpg() {
    bEpgOpened = false;
    if (o.EpgOverlay) o.EpgOverlay.classList.add('HIDDEN');
}

function renderEpg(aEpgFilteredChannelKeys) {
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


// -------------------------
//  CHANNEL INFO DISPLAY
// -------------------------

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


// -------------------------
//  FAVORITES STORAGE
// -------------------------

function loadFavoritesFromStorage() {
    try {
        const favs = JSON.parse(localStorage.getItem("iptvFavoriteChannels") || "[]");
        if (Array.isArray(favs)) {
            Object.keys(channels).forEach(key => {
                if (channels[key]) { channels[key].favorite = favs.includes(key); }
            });
        } else { console.warn("Favorites data from localStorage is not an array."); }
    } catch (e) { console.error("Error loading favorites:", e); }
}

function saveFavoritesToStorage() {
    try {
        const favs = Object.entries(channels)
            .filter(([, ch]) => ch && ch.favorite)
            .map(([key]) => key);
        localStorage.setItem("iptvFavoriteChannels", JSON.stringify(favs));
    } catch (e) { console.error("Error saving favorites:", e); }
}


// -------------------------
//  FIRST PLAY HANDLING
// -------------------------

/**
 * Handles the first click on the play button, starting the session.
 */
function handleFirstPlay() {
    if (isSessionActive) return;
    isSessionActive = true;

    hideIdleAnimation();
    iPlayingChannelIndex = iCurrentChannel;

    if (aFilteredChannelKeys.length > 0 && iCurrentChannel >= 0 && iCurrentChannel < aFilteredChannelKeys.length) {
        // Now this will load the stream
        loadChannel(iCurrentChannel);
    } else {
        console.error("No valid channel selected on first play.");
        showIdleAnimation(true);
        isSessionActive = false;
        return;
    }
}


// -------------------------
//  SETTINGS SELECTION HELPERS
// -------------------------

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

/**
 * Toggles fullscreen mode for the entire page.
 */
function toggleFullScreen() {
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


// -------------------------
//  GLOBAL EVENT LISTENERS
// -------------------------

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
            jwInstance?.stop();
            showIdleAnimation(true);
        }
    });
} else { console.error("SearchField element not found."); }

// --- TV REMOTE KEYDOWN LOGIC ---
document.addEventListener('keydown', (e) => {
    // Ignore keys if typing in an input
    if (document.activeElement === o.SearchField ||
        document.activeElement === getEl('edit_ch_name') ||
        document.activeElement === getEl('edit_ch_logo') ||
        document.activeElement.tagName === 'SELECT'
    ) {
        if (e.key === 'Escape' || e.key === 'Enter') {
            e.preventDefault();
            if (document.activeElement) document.activeElement.blur();
        }
        return; // Allow typing
    }

    // Check for Modals/Overlays FIRST
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
            } else if (selectedItem.tagName === 'LI') {
                selectedItem.click();
            } else if (selectedItem.tagName === 'BUTTON') {
                selectedItem.click();
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
            window.hideSettingsModal();
        }
        return;
    }
    
    // --- Logic inside NAV PANEL (Left) ---
    if (bNavOpened) {
        e.preventDefault();
        if (bGroupsOpened) {
            // GROUP LIST
            const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
            const selectedItem = groupItems[iGroupListIndex];

            if (e.key === 'ArrowUp') {
                iGroupListIndex = Math.max(0, iGroupListIndex - 1);
            } else if (e.key === 'ArrowDown') {
                iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
            } else if (e.key === 'Enter') {
                selectedItem?.click();
            } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // 'Right' is GO BACK
                hideGroups(); // Groups -> Channels
            }
            // 'ArrowLeft' does nothing
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
            } else if (e.key === 'ArrowLeft') { // 'Left' is DRILL DOWN
                showGroups(); // Channel List -> Groups
            } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // 'Right' is GO BACK
                hideNav(); // Close the entire panel
            }
            updateSelectedChannelInNav();
        }
        return;
    }
    
    // --- Logic inside CHANNEL SETTINGS PANEL (Right) ---
    if (bChannelSettingsOpened) {
        e.preventDefault();
        const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
        const ARROW_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
        if (!ARROW_KEYS.includes(e.key)) return;

        if (isSubmenu) {
            // SUBMENU (Video Format)
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
            // MAIN SETTINGS MENU
            const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
            if (e.key === 'ArrowUp') {
                iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
            } else if (e.key === 'ArrowDown') {
                iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
            } else if (e.key === 'Enter') {
                mainItems[iChannelSettingsIndex]?.click();
            } else if (e.key === 'ArrowRight') { // 'Right' is DRILL DOWN
                if (iChannelSettingsIndex === 1) { // Only for 'Video / Format'
                    mainItems[iChannelSettingsIndex]?.click();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // 'Left' is GO BACK
                hideChannelSettings();
            }
            updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
        }
        return;
    }

    // --- DEFAULT PLAYER KEYS (Panels are closed) ---
    const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
    if (!PLAYER_KEYS.includes(e.key)) return;

    e.preventDefault();
    switch (e.key) {
        case 'ArrowLeft': showNav(); break;
        case 'ArrowRight': showChannelSettings(); break;
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
 * Gets stats from JWPlayer and updates the Stream Info overlay.
 */
function updateStreamInfo() {
    const infoOverlay = o.CodecInfo;
    if (!infoOverlay) return;
    if (!jwInstance) {
        infoOverlay.textContent = 'Player Info: N/A';
        return;
    }

    try {
        const quality = jwInstance.getVisualQuality(); // { level: { height, width, bitrate, label }, reason }
        const stats = jwInstance.getQualityLevels()[jwInstance.getCurrentQuality()]; // {label, bitrate, height, width}

        if (!quality || !quality.level || !stats) {
            infoOverlay.textContent = 'Player Info: N/A';
            return;
        }

        const resolution = `${stats.width || quality.level.width}x${stats.height || quality.level.height}`;
        const bandwidth = (stats.bitrate / 1000000).toFixed(2);
        const reason = quality.reason;

        infoOverlay.textContent = `Video: ${resolution} (${reason}) | Bandwidth: ${bandwidth} Mbit/s`;
    
    } catch (error) {
        console.warn("Could not get stream info:", error);
        infoOverlay.textContent = 'Player Info: Error';
    }
}

// Start the application after the DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);

// --- All Shaka-specific event listeners ('shaka-ui-loaded', etc.) have been removed. ---
