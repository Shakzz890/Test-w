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

    // --- FIX: Updated broken stream URLs with working test streams ---
    let channels = {
discoveryscience: { name: "Discovery Science", type: "clearkey", manifestUri: "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Discoveryscience2/default/manifest.mpd", keyId: "5458f45efedb4d6f8aa6ac76c85b621b", key: "dbf8a0a306a64525ba3012fd225370c0", logo: "  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkA_8vr9UZUhtkaFi6AshM83zQwhPWBGWX-Q&s", group: ["documentary"], },
KidoodleTV: { name: "Kidoodle TV", type: "hls", manifestUri: "https://amg07653-apmc-amg07653c5-samsung-ph-8539.playouts.now.amagi.tv/playlist.m3u8", logo: "https://d1iiooxwdowqwr.cloudfront.net/pub/appsubmissions/20201230211817_FullLogoColor4x.png", group: ["cartoons & animations"], },
StrawberryShortcake: { name: "Strawberry Shortcake", type: "hls", manifestUri: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", logo: "https://upload.wikimedia.org/wikipedia/en/f/ff/Strawberry_Shortcake_2003_Logo.png", group: ["cartoons & animations"], },
SonictheHedgehog: { name: "Sonic the Hedgehog", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258004/hls/master.m3u8?ads.xumo_channelId=88258004", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sonic_The_Hedgehog.svg/1200px-Sonic_The_Hedgehog.svg.png", group: ["cartoons & animations"], },
SuperMario: { name: "Super Mario", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258005/hls/master.m3u8?ads.xumo_channelId=88258005", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMkkUmZBGslGWGZMN2er5emlnqGCCU49wg&s", group: ["cartoons & animations"], },
Teletubbies: { name: "Teletubbies", type: "hls", manifestUri: "https://d1si3n1st4nkgb.cloudfront.net/10000/88258003/hls/master.m3u8?ads.xumo_channelId=88258003", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Teletubbies_Logo.png/330px-Teletubbies_Logo.png", group: ["cartoons & animations"], },
anione: { name: "Ani One", type: "hls", manifestUri: "https://amg19223-amg19223c9-amgplt0019.playout.now3.amagi.tv/playlist/amg19223-amg19223c9-amgplt0019/playlist.m3u8", logo: "https://www.medialink.com.hk/img/ani-one-logo.jpg", group: ["cartoons & animations"], },
jeepneytv: { name: "Jeepney TV", type: "clearkey", manifestUri: "https://abslive.akamaized.net/dash/live/2028025/jeepneytv/manifest.mpd", keyId: "90ea4079e02f418db7b170e8763e65f0", key: "1bfe2d166e31d03eee86ee568bd6c272", logo: "https://upload.wikimedia.org/wikipedia/en/1/15/Jeepney_TV_Logo_2015.svg", group:["entertainment"], },
aniplus: { name: "Aniplus", type: "hls", manifestUri: "https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJj494OpI0bKrTrvcHqEkzMYzqtfLNdWjQrg&s", group: ["cartoons & animations"], },
sinemanila: { name: "SineManila", type: "hls", manifestUri: "https://live20.bozztv.com/giatv/giatv-sinemanila/sinemanila/chunks.m3u8", logo: "", group:["movies", "entertainment"], },
pbarush: { name: "PBA Rush", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_pbarush_hd1/default/index.mpd", keyId: "76dc29dd87a244aeab9e8b7c5da1e5f3", key: "95b2f2ffd4e14073620506213b62ac82", logo: "https://static.wikia.nocookie.net/russel/images/0/00/PBA_Rush_Logo_2016.png/revision/latest/scale-to-width-down/250?cb=20250217140355https://static.wikia.nocookie.net/russel/images/0/00/PBA_Rush_Logo_2016.png/revision/latest/scale-to-width-down/250?cb=20250217140355", group:["entertainment"], },
animalplanet: { name: "Animal Planet", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animal_planet_sd/default/index.mpd", keyId: "436b69f987924fcbbc06d40a69c2799a", key: "c63d5b0d7e52335b61aeba4f6537d54d", logo: "https://i.imgur.com/SkpFpW4.png", group:["documentary"], },
discoverychannel: { name: "Discovery Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/discovery/default/index.mpd", keyId: "d9ac48f5131641a789328257e778ad3a", key: "b6e67c37239901980c6e37e0607ceee6", logo: "https://i.imgur.com/XsvAk5H.png", group:["documentary"], },
nickelodeon: { name: "Nickelodeon", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickelodeon/default/index.mpd", keyId: "9ce58f37576b416381b6514a809bfd8b", key: "f0fbb758cdeeaddfa3eae538856b4d72", logo: "https://i.imgur.com/4o5dNZA.png", group:["cartoons & animations"], },
nickjr: { name: "Nick Jr", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_nickjr/default/index.mpd", keyId: "bab5c11178b646749fbae87962bf5113", key: "0ac679aad3b9d619ac39ad634ec76bc8", logo: "https://i.imgur.com/iIVYdZP.png", group:["cartoons & animations"], },
pbo: { name: "PBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "https://i.imgur.com/550RYpJ.png", group:["movies", "entertainment"], },
angrybirds: { name: "Angry Birds", type: "hls", manifestUri: "https://stream-us-east-1.getpublica.com/playlist.m3u8?network_id=547", logo: "https://www.pikpng.com/pngl/m/83-834869_angry-birds-theme-angry-birds-game-logo-png.png", group:["cartoons & animations"], },
zoomooasia: { name: "Zoo Moo Asia", type: "hls", manifestUri: "https://zoomoo-samsungau.amagi.tv/playlist.m3u8", logo: "https://ia803207.us.archive.org/32/items/zoo-moo-kids-2020_202006/ZooMoo-Kids-2020.png", group:["cartoons & animations", "entertainment"], },
mrbeanlive: { name: "MR Bean Live Action", type: "hls", manifestUri: "https://amg00627-amg00627c40-rakuten-uk-5725.playouts.now.amagi.tv/ts-eu-w1-n2/playlist/amg00627-banijayfast-mrbeanpopupcc-rakutenuk/cb573d1d7d6c648b92d43b66cef24582847b3dcb0e6c886470af4a9765d96300dbf9b9c8fd3ab13c1ec0468a710b6d5a4d1cd209af3c419b8b1dfd034f25536b9f9bb565da9f0211c9a06b5756af6a4208a55b05a7700079d6a05a2b8d2fba74005cb95a3c1862c3ed47ad662f9ad253d72a39e8fc8b307b24455a9c5a43e6a64cb7abe95810893aa5b00140c12e14fa83439fd401b388d50f8315d775a514c893a182da1187e4205293728aecdb5f581fa9a83bf8f955bfd6937929957f2d556c3a8cc1b2cd3ef702da21269cded8b6648560a63ebb89125a980194408b338b65ea2aaef557e2dad320aaea5ad6a60b315dccc8a59ee93a739067f5abe5dc391af392452c179b3f994a5f491a999f65d2ff58b6cf8d6d06d79d67feb10ff0bca18aeeffa04b922cc6c6ce7a5c28414e0b188f51ae9b228e678d38e0e21a2f49551fedbb5bc094d65734221ed6db1eff5a5b98cb9b8fda393ec84b124ea7358a0c4b3f9a742457cd19d4b6702c852f0180751afe5b3e8f0bbc9b24e7a8d6e0496ae68c8912b13fa1e54afff900a061391931b2f42d4d4c032883b9285e660bae2f83f2c4e5650609e885afaf9029580d5a460a586b835790052ba668aed8b933cf2257196f9860690e20e9/184/1280x720_3329040/index.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdSj6OHTQv9_53OX9ZwSjCqOTkYj5dDUZUW0irJhXranWx7zI1YhEIwg&s=10", group:["cartoons & animations", "entertainment"], },
iQIYI: { name:"iQIYI", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/1006/default_ott.mpd", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs3X1_D_GkWQbMiZzbmaoFets_gAeM6zKGhvtuAD7y46OH9zcqWCnLoG3K&s=10", group: ["entertainment"], userAgent: "Mozilla/5.0 (Linux; Android 14; 27821-67832-42-315-4231-233-21-43-12-1312-321-23-21-232-) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36", keyId: "7ef7e913ce85a1131b27036069169a10", key: "77d98ed71db7524c27875a09a975f9e6" },
tv5: { name: "TV 5 HD", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", keyId: "2615129ef2c846a9bbd43a641c7303ef", key: "07c7f996b1734ea288641a68e1cfdc4d", logo: "https://vignette.wikia.nocookie.net/russel/images/f/f9/TV5_Logo_2011.png/revision/latest?cb=20161204035016", group:["news", "entertainment"], },
kapamilya: { name: "Kapamilya Channel HD", type: "clearkey", manifestUri: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd", keyId: "bd17afb5dc9648a39be79ee3634dd4b8", key: "3ecf305d54a7729299b93a3d69c02ea5", logo: "https://cms.cignal.tv/Upload/Images/Kapamilya Channel Logo alpha.png", group:["news", "entertainment"], },
hbo: { name: "HBO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohd/default/index.mpd", keyId: "d47ebabf7a21430b83a8c4b82d9ef6b1", key: "54c213b2b5f885f1e0290ee4131d425b", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg", group:["movies"], },
hbofam: { name: "HBO Family", type: "clearkey", manifestUri:"https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbofam/default/index.mpd", keyId: "872910c843294319800d85f9a0940607", key: "f79fd895b79c590708cf5e8b5c6263be", logo: "https://www.pikpng.com/pngl/m/41-419283_hbo-family-logo-hbo-family-logo-png-clipart.png", group:["movies"], },
hbohits: { name: "HBO Hits", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohits/default1/index.mpd", keyId: "b04ae8017b5b4601a5a0c9060f6d5b7d", key: "a8795f3bdb8a4778b7e888ee484cc7a1", logo: "https://cms.cignal.tv/Upload/Images/HBO Hits-1.jpg", group:["movies"], },
hbosig: { name: "HBO Signature", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbosign/default/index.mpd", keyId: "a06ca6c275744151895762e0346380f5", key: "559da1b63eec77b5a942018f14d3f56f", logo: "https://www.nicepng.com/png/detail/233-2333069_hbo-signature-logo-png.png", group:["movies"], },
cinemax: { name: "Cinemax", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cinemax/default/index.mpd", keyId: "b207c44332844523a3a3b0469e5652d7", key: "fe71aea346db08f8c6fbf0592209f955", logo: "https://logodix.com/logo/2138572.png", group:["movies"], },
cinemaone: { name: "Cinema One", type: "clearkey", manifestUri: "https://d9rpesrrg1bdi.cloudfront.net/out/v1/93b9db7b231d45f28f64f29b86dc6c65/index.mpd", keyId: "58d0e56991194043b8fb82feb4db7276", key: "d68f41b59649676788889e19fb10d22c", logo: "https://download.logo.wine/logo/Cinema_One/Cinema_One-Logo.wine.png", group:["movies"], },
cartoonnetworkhd: { name: "Cartoon Network HD", type: "clearkey", manifestUri: "https://live-atv-cdn.izzigo.tv/4/out/u/dash/CARTOONNETWORKHD/default.mpd", keyId: "85d06ba283f3b18bb14f9f8d59b8fb82", key: "6659fed472544289adee986c1d33fa79", logo: "https://logos-world.net/wp-content/uploads/2021/08/Cartoon-Network-Logo-2010-present.png", group:["cartoons & animations"], },
cartoonnetwork: { name: "Cartoon Network", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cartoonnetworkhd/default/index.mpd", keyId: "a2d1f552ff9541558b3296b5a932136b", key: "cdd48fa884dc0c3a3f85aeebca13d444", logo: "https://logos-world.net/wp-content/uploads/2021/08/Cartoon-Network-Logo-2010-present.png", group:["cartoons & animations"], },
animax: { name: "Animax", type: "clearkey", manifestUri:"https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_animax_sd_new/default/index.mpd", keyId: "92032b0e41a543fb9830751273b8debd", key: "03f8b65e2af785b10d6634735dbe6c11", logo: "https://iconape.com/wp-content/files/px/285466/svg/animax-logo-logo-icon-png-svg.png", group:["cartoons & animations"], },
tapmovies: { name: "Tap Movies", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tapmovies_hd1/default/index.mpd", keyId: "71cbdf02b595468bb77398222e1ade09", key: "c3f2aa420b8908ab8761571c01899460", logo: "https://cms.cignal.tv/Upload/Images/Tap-movies.jpg", group:["movies"], },
tapactionflix: { name: "Tap Action Flix", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_tapactionflix_hd1/default/index.mpd", keyId: "bee1066160c0424696d9bf99ca0645e3", key: "f5b72bf3b89b9848de5616f37de040b7", logo: "https://github.com/tv-logo/tv-logos/blob/main/countries/philippines/tap-action-flix-ph.png?raw=true", group:["movies"], },
animexhidive: { name: "Anime X Hidive", type: "hls", manifestUri: "https://amc-anime-x-hidive-1-us.tablo.wurl.tv/playlist.m3u8", logo: "https://www.tablotv.com/wp-content/uploads/2023/12/AnimeXHIDIVE_official-768x499.png", group:["cartoons & animations"], },
disneychannel: { name: "Disney Channel", type: "clearkey", manifestUri: "https://uselector.cdn.intigral-ott.net/DIS/DIS.isml/manifest.mpd", keyId: "72800c62fcf2bfbedd9af27d79ed35d6", key: "b6ccb9facb2c1c81ebe4dfaab8a45195", logo: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/20768ccf-f5b0-4b5e-bd31-ad33d6cf6a35/dei91io-5b3a14cb-c0c8-4033-b487-3574252333bd.jpg/v1/fill/w_1191,h_671,q_70,strp/disney_channel_logo__blue__by_littlekj20_dei91io-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzMwIiwicGF0aCI6IlwvZlwvMjA3NjhjY2YtZjViMC00YjVlLWJkMzEtYWQzM2Q2Y2Y2YTM1XC9kZWk5MWlvLTViM2ExNGNiLWMwYzgtNDAzMy1iNDg3LTM1NzQyNTIzMzNiZC5qcGciLCJ3aWR0aCI6Ijw9MTI5NiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.CDhwbyrZ7hWQVXvarfBL8eDRzfm1mjqVps1IqVo2j3g", group:["cartoons & animations"], },
disneyxdd: { name: "Disney XD", type: "clearkey", manifestUri: "https://a53aivottepl-a.akamaihd.net/pdx-nitro/live/clients/dash/enc/jts4tzzv1k/out/v1/8a5b29f7068c415aa371ea95743382e6/cenc.mpd", keyId: "39cebece8b36640f9ba3f248ecfdf86a", key: "fad936249e036830aa5bef41bec05326", logo: "https://logos-world.net/wp-content/uploads/2023/06/Disney-XD-Logo-2009.png", group:["cartoons & animations"], },
disneyjr: { name: "Disney Jr.", type: "clearkey", manifestUri: "https://uselector.cdn.intigral-ott.net/DJR/DJR.isml/manifest.mpd", keyId: "f5df57914a0922d5d5ed6b0a4af6290a", key: "c62b10a180d1770a355b3c4cb6506ca0", logo: "https://www.pinpng.com/pngs/m/418-4182937_disney-junior-tv-logo-hd-png-download.png", group:["cartoons & animations"], },
tfcasia: { name: "TFC Asia", type: "clearkey", manifestUri: "https://d1facupi3cod3q.cloudfront.net/out/v1/e3633f8591e248b0af1af15a474bfa4a/index.mpd", keyId: "9568cc84e1d944f38eac304517eab6fd", key: "f12142af8f39b3bab79d3679d3665ebe", logo: "https://img.mytfc.com/cmsroot/abscms/media/mytfctv/channels/iwantoriginals/iwanttfc_channel_thumbnail-768x430.png?ext=.png", group:["entertainment"], },
cnn: { name: "CNN", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/2503/default_ott.mpd", keyId: "1b618a291cece44c9845dddfc4fd9b10", key: "bf7e1b97555c4acb7455f711b2a9ff16", logo: "https://laguia.tv/_nuxt/img/CNN_512.0e91aae.png", group:["news", "entertainment"], },
anc: { name: "ANC", type: "clearkey", manifestUri: "https://d3cjss68xc4sia.cloudfront.net/out/v1/89ea8db23cb24a91bfa5d0795f8d759e/index.mpd", keyId: "4bbdc78024a54662854b412d01fafa16", key: "6039ec9b213aca913821677a28bd78ae", logo: "httpshttps://data-corporate.abs-cbn.com/corp/medialibrary/dotcom/corp news sports 2020/anc station id/anc goes global_2.jpg", group:["news", "entertainment"], },
axn: { name: "AXN", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/2303/default_ott.mpd", keyId: "c24a7811d9ab46b48b746a0e7e269210", key: "c321afe1689b07d5b7e55bd025c483ce", logo: "https://icon2.cleanpng.com/20180702/pfc/kisspng-axn-television-channel-sony-channel-television-sho-axn-5b3a0ac39f5e85.1062681315305304996528.jpg", group:["news", "entertainment"], },
crave1: { name: "Crave 1", type: "clearkey", manifestUri:"https://live-crave.video.9c9media.com/137c6e2e72e1bf67b82614c7c9b216d6f3a8c8281748505659713/fe/f/crave/crave1/manifest.mpd", keyId: "4a107945066f45a9af2c32ea88be60f4", key: "df97e849d68479ec16e395feda7627d0", logo: "https://the-bithub.com/crave1", group:["movies"], },
crave2: { name: "Crave 2", type: "clearkey", manifestUri: "https://live-crave.video.9c9media.com/ab4332c60e19b6629129eeb38a2a6ac6db5df2571721750022187/fe/f/crave/crave2/manifest.mpd", keyId: "4ac6eaaf0e5e4f94987cbb5b243b54e8", key: "8bb3f2f421f6afd025fa46c784944ad6", logo: "https://the-bithub.com/crave", group:["movies"], },
cinemo: { name: "Cinemo", type: "clearkey", manifestUri: "https://d1bail49udbz1k.cloudfront.net/out/v1/3a895f368f4a467c9bca0962559efc19/index.mpd", keyId: "aa8aebe35ccc4541b7ce6292efcb1bfb", key: "daab1df109d22fc5d7e3ec121ddf24e5f", logo: "https://th.bing.com/th/id/OIP.YQlhh4Welb3cggK1H7oE3QHaEF?rs=1&pid=ImgDetMain", group:["movies"], },
amc: { name: "AMC+", type: "clearkey", manifestUri: "https://a148aivottlinear-a.akamaihd.net/OTTB/PDX/clients/dash/enc/0f5clvxn6o/out/v1/d5a953bb19734fa3baa1776266887fcb/cenc.mpd", keyId: "59a51164c2c915352f04066a06f6e807", key: "eba5cc362d1d63c0fe6460febca0fd11", logo: "https://shop.amc.com/cdn/shop/products/AMCP-LOGO-100011-FR-RO_1500x.png?v=1650990755", group:["movies"], },
amcthriller: { name: "AMC Thrillers", type: "hls", manifestUri: "https://436f59579436473e8168284cac5d725f.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/Plex_RushByAMC/playlist.m3u8", logo: "https://provider-static.plex.tv/6/epg/channels/logos/gracenote/6e7af423114c9f735d17e142783f233a.png", group:["movies"], },
paramount: { name: "Paramaount Movies", type: "hls", manifestUri: "https://stitcher.pluto.tv/stitch/hls/channel/5cb0cae7a461406ffe3f5213/master.m3u8?deviceType=web&servertSideAds=false&deviceMake=safari&deviceVersion=1&deviceId=spencer&appVersion=1&deviceDNT=0&deviceModel=web&sid=4a87ffde-1b23-11f0-bc66-96648866fcff", logo: "https://logodownload.org/wp-content/uploads/2014/07/paramount-logo-1.png", group:["movies"], },
gmapinoytv: { name: "GMA Pinoy TV", type: "dash", manifestUri: "https://amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono-dzsx9.amagi.tv/index.mpd", logo: "https://aphrodite.gmanetwork.com/entertainment/articles/900_675_Main_Image22_1109_-20221109181156.jpg", group: ["news", "entertainment"], },
tvnprem: { name: "TVN Premium", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnpre/default/index.mpd", keyId: "e1bde543e8a140b38d3f84ace746553e", key: "b712c4ec307300043333a6899a402c10", logo: "https://blog.kakaocdn.net/dn/SNPof/btqwO6OKJbH/kGkD29gebJ6bUFjri4E6Ak/img.jpg", group:["movies"], },
tvnmovies: { name: "TVN Movies", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/2406/default_ott.mpd", keyId: "8e269c8aa32ad77eb83068312343d610", key: "d12ccebafbba2a535d88a3087f884252", logo: "https://yt3.ggpht.com/a/AATXAJy1C8c3pOmn9lAsPovaRcKqIvw2OAAfHK-HtA=s900-c-k-c0xffffffff-no-rj-mo", group:["movies"], },
tvnpinoy: { name: "TVN Movies Pinoy", type: "clearkey", manifestUri: "httpss://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnmovie/default/index.mpd", keyId: "2e53f8d8a5e94bca8f9a1e16ce67df33", key: "3471b2464b5c7b033a03bb8307d9fa35", logo: "https://th.bing.com/th/id/OIP.7i_NEUaiqj2UtFHiHjzzhgHaF0?r=0&rs=1&pid=ImgDetMain", group:["movies"], },
wwe: { name: "WWE", type: "clearkey", manifestUri: "https://fsly.stream.peacocktv.com/Content/CMAF_CTR-4s/Live/channel(vc106wh3yw)/master.mpd", keyId: "00208c93f4358213b52220898b962385", key: "8ae6063167228e350dd132d4a1573102", logo: "https://mcdn.wallpapersafari.com/medium/43/73/OC5BrI.png", group:["sports"], },
onesports: { name: "One Sports +", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesportsplus_hd1/default/index.mpd", keyId: "322d06e9326f4753a7ec0908030c13d8", key: "1e3e0ca32d421fbfec86feced0efefda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/OneSportsPlus_logo.svg/300px-OneSportsPlus_logo.svg.png", group:["sports", "entertainment"], },
onesportshd: { name: "One Sports HD", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesports_hd/default/index.mpd", keyId: "53c3bf2eba574f639aa21f2d4409ff11", key: "3de28411cf08a64ea935b9578f6d0edd", logo: "https://i.imgur.com/imI97L2.png", group:["sports", "entertainment"], },
nbaph: { name: "NBA TV PH", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd", keyId: "c5e51f41ceac48709d0bdcd9c13a4d88", key: "20b91609967e472c27040716ef6a8b9a", logo: "https://pngset.com/images/nba-tv-philippines-nba-tv-philippines-cignal-person-text-label-logo-transparent-png-2509143.png", group:["sports", "entertainment"], },
studiouniversal: { name: "Studio Universal", type: "clearkey", manifestUri: "https://fta1-cdn-flr.visionplus.id/out/v1/dc63bd198bc44193b570e0567ff5b22c/index.mpd", keyId: "b4a7b3289eff493d8700becf2e2a1157", key: "bfbcfcb8137dd565a7f4b5ce7800c1f0", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Logo_Studio_Universal.svg/1200px-Logo_Studio_Universal.svg.png", group:["movies"], },
filmrisehorror: { name: "Filmrise Horror", type: "hls", manifestUri: "https://apollo.production-public.tubi.io/live/ac-filmrise-horror.m3u8", logo: "https://the-bithub.com/fhorror", group:["movies"], },
rakutenviki: { name: "Rakuten Viki", type: "hls", manifestUri: "https://fd18f1cadd404894a31a3362c5f319bd.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26fdca9d9841f37601f/RakutenTV-eu_RakutenViki-1/playlist.m3u8", logo: "https://img.icons8.com/color/452/rakuten-viki.png", group:["movies", "entertainment"], },
miramax: { name: "Miramax Movies", type: "hls", manifestUri: "httpss://raw.githubusercontent.com/mystery75/m3u8/main/MIRAMAX.m3u8", logo: "https://the-bithub.com/miramax", group:["movies"], },
ionplus: { name: "Ion Plus", type: "hls", manifestUri: "httpss://raw.githubusercontent.com/mystery75/m3u8/main/IONPLUS.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ION_Plus_logo.svg/1200px-ION_Plus_logo.svg.png", group:["news", "entertainment"], },
ionmystery: { name: "Ion Mystery", type: "hls", manifestUri: "httpss://raw.githubusercontent.com/mystery75/m3u8/main/IONMYSTERY.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/ION_Mystery_logo.svg/1200px-ION_Mystery_logo.svg.png", group:["movies", "entertainment"], },
dove: { name: "Dove Channel", type: "hls", manifestUri: "httpss://raw.githubusercontent.com/mystery75/m3u8/main/DOVE.m3u8", logo: "https://the-bithub.com/dove", group:["entertainment"], },
bbcearth: { name: "BBC Earth", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_bbcearth_hd1/default/index.mpd", keyId: "34ce95b60c424e169619816c5181aded", key: "0e2a2117d705613542618f58bf26fc8e", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/BBC_Earth.svg", group:["documentary"], },
rckentr: { name: "Rock Entertainment", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockentertainment/default/index.mpd", keyId: "e4ee0cf8ca9746f99af402ca6eed8dc7", key: "be2a096403346bc1d0bb0f812822bb62", logo: "https://assets-global.website-files.com/64e81e52acfdaa1696fd623f/652f763c600497122b122df0_logo_ent_red_web.png", group:["news", "entertainment"], },
amznmovie: { name: "Amazon Movies", type: "clearkey", manifestUri: "https://abbfefcaaaaaaaamd5xd44ij4vbyj.a17d0dfbc05b48999f461f3f6cff0eb6.emt.cf.ww.aiv-cdn.net/pdx-nitro/live/clients/dash/enc/oynu8tcxfa/out/v1/ab567b96658c4d84ae1fc6c67110987c/cenc.mpd", keyId: "3e429eb91a1791d55df2a554dc58dda7", key: "2f688f94ef580a61eada6932598137e4", logo: "https://the-bithub.com/amznmovies", group:["movies"], },
hitsnow: { name: "Hits HD", type: "clearkey", manifestUri: "https://linearjitp-playback.astro.com.my/dash-wv/linear/606/default_ott.mpd", keyId: "1fe92685a75844dc54c9dac124802510", key: "36cb2063bf5338d18d31657371b15817", logo: "https://medianet.mv/media/channel/229x0-icon.png", group:["movies"], },
kix: { name: "Kix HD", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/kix_hd1.mpd", keyId: "a8d5712967cd495ca80fdc425bc61d6b", key: "f248c29525ed4c40cc39baeee9634735", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/KIX_logo.svg/1200px-KIX_logo.svg.png", group:["entertainment"], },
history: { name: "History", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_historyhd/default/index.mpd", keyId: "a7724b7ca2604c33bb2e963a0319968a", key: "6f97e3e2eb2bade626e0281ec01d3675", logo: "https://logos-world.net/wp-content/uploads/2023/07/History-Logo.jpg", group:["documentary"], },
nbcsprts: { name: "NBC Sports", type: "clearkey", manifestUri: "https://fsly.stream.peacocktv.com/Content/CMAF_CTR-4s/Live/channel(vc122ycnuy)/master.mpd", keyId: "0020d88a6713159839743f655c5da7de", key: "ba9f34226301f69a4f0f13f65a1f92ec", logo: "https://i.ibb.co/PN0fjNF/90-removebg-preview.png", group:["sports"], },
warner: { name: "Warner TV", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_warnertvhd.mpd", keyId: "4503cf86bca3494ab95a77ed913619a0", key: "afc9c8f627fb3fb255dee8e3b0fe1d71", logo: "httpss://tse2.mm.bing.net/th/id/OIP.7d6tiaMYWpWIGI6iAN47zAHaG3?rs=1&pid=ImgDetMain&o=7&rm=3", group:["movies", "entertainment"], },
moviesnow: { name: "Movies Now", type: "clearkey", manifestUri: "https://times-ott-live.akamaized.net/moviesnow_wv_drm/index.mpd", keyId: "40f019b86241d23ef075633fd7f1e927", key: "058dec845bd340178a388edd104a015e", logo: "httpss://bestmediainfo.com/uploads/2017/08/MOVIES-NOW-LOGO_6.jpg", group:["movies"], },
myxglobal: { name: "MYX", type: "clearkey", manifestUri: "https://d24xfhmhdb6r0q.cloudfront.net/out/v1/e897a7b6414a46019818ee9f2c081c4f/index.mpd", keyId: "f40a52a3ac9b4702bdd5b735d910fd2f", key: "5ce1bc7f06b494c276252b4d13c90e51", logo: "httpss://seeklogo.com/images/M/myx-logo-8C7D28B9EF-seeklogo.com.png", group:["entertainment"], },
alja: { name: "Al jazeera", type: "clearkey", manifestUri: "httpss://linearjitp-playback.astro.com.my/dash-wv/linear/2110/default_ott.mpd", keyId: "b1fbd0874e7923f5b05929a042aa0610", key: "6c3c498113abffdf454dc935319a794d", logo: "https://www.liblogo.com/img-logo/al1049a118-al-jazeera-logo-al-jazeera-to-deliver-bloomberg-news-content-for-expanded-global.png", group:["news", "entertainment"], },
channelnwasia: { name: "Channel News Asia", type: "clearkey", manifestUri: "httpss://tglmp03.akamaized.net/out/v1/43856347987b4da3890360b0d18b5dc5/manifest.mpd", keyId: "4ee336861eed4840a555788dc54aea6e", key: "f1f53644d4941d4ed31b4bb2478f8cf4", logo: "httpss://logowik.com/content/uploads/images/cna-channel-news-asia9392.jpg", group:["news", "entertainment"], },
premleague: { name: "Premier League", type: "clearkey", manifestUri: "httpss://fsly.stream.peacocktv.com/Content/CMAF_CTR-4s/Live/channel(vc1021n07j)/master.mpd", keyId: "002046c9a49b9ab1cdb6616bec5d26c3", key: "d2f92f6b7edc9a1a05d393ba0c20ef9e", logo: "httpss://logos-world.net/wp-content/uploads/2023/02/Premier-League-Logo-2007.png", group:["sports"], },
mtvlive: { name: "MTV", type: "clearkey", manifestUri: "httpss://linearjitp-playback.astro.com.my/dash-wv/linear/5014/default_ott.mpd", keyId: "3ac2542a4f7be746633db07647451710", key: "22f964a6d6927ccdba482e775cdff190", logo: "httpss://tse3.mm.bing.net/th/id/OIP.lMLVpSGutDFitqvokkgp6AHaHT?w=774&h=764&rs=1&pid=ImgDetMain&o=7&rm=3", group:["entertainment"], },
one_ph: { name: "One PH", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/oneph_sd/default/index.mpd", keyId: "92834ab4a7e1499b90886c5d49220e46", key: "a7108d9a6cfcc1b7939eb111daf09ab3", logo: "https://i.imgur.com/gkluDe9.png", group:["news", "entertainment"], },
buko: { name: "BuKO", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_buko_sd/default/index.mpd", keyId: "d273c085f2ab4a248e7bfc375229007d", key: "7932354c3a84f7fc1b80efa6bcea0615", logo: "https://i.imgur.com/Wv0K5Yc.png", group:["news", "entertainment"], },
sari_sari: { name: "SARI‑SARI", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_sarisari/default/index.mpd", keyId: "0a7ab3612f434335aa6e895016d8cd2d", key: "b21654621230ae21714a5cab52daeb9d", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Sari-Sari_Channel_logo.svg/1200px-Sari-Sari_Channel_logo.svg.png", group:["news", "entertainment"], group:["news", "entertainment"], },
ptv4: { name: "PTV4", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_ptv4_sd/default/index.mpd", keyId: "71a130a851b9484bb47141c8966fb4a3", key: "ad1f003b4f0b31b75ea4593844435600", logo: "httpss://static.wikia.nocookie.net/russel/images/d/dc/PTV_4_Para_Sa_Bayan_Alternative_Logo_June_2017.png", group:["news", "entertainment"], },
one_sports: { name: "One Sports", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_onesports_hd.mpd", keyId: "53c3bf2eba574f639aa21f2d4409ff11", key: "3de28411cf08a64ea935b9578f6d0edd", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/One_Sports_logo.svg/2560px-One_Sports_logo.svg.png", group:["sports"], },
one_news: { name: "One News", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/onenews_hd1/default/index.mpd", keyId: "d39eb201ae494a0b98583df4d110e8dd", key: "6797066880d344422abd3f5eda41f45f", logo: "https://i.imgur.com/bpRiu54.png", group:["news", "entertainment"], },
rptv: { name: "RPTV", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cnn_rptv_prod_hd/default/index.mpd", keyId: "1917f4caf2364e6d9b1507326a85ead6", key: "a1340a251a5aa63a9b0ea5d9d7f67595", logo: "httpss://static.wikia.nocookie.net/russel/images/f/fb/RPTV_Alternative_Logo_2024.png", group:["news", "entertainment"], },
tv5: { name: "TV5", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd", keyId: "2615129ef2c846a9bbd43a641c7303ef", key: "07c7f996b1734ea288641a68e1cfdc4d", logo: "httpss://static.wikia.nocookie.net/russel/images/7/7a/TV5_HD_Logo_2024.png", },
a2z: { name: "A2Z", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_a2z/default/index.mpd", keyId: "f703e4c8ec9041eeb5028ab4248fa094", key: "c22f2162e176eee6273a5d0b68d19530", logo: "httpss://static.wikia.nocookie.net/russel/images/8/85/A2Z_Channel_11_without_Channel_11_3D_Logo_2020.png", },
bilyonaryo: { name: "Bilyonaryo Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bilyonaryoch/default1/index.mpd", keyId: "227ffaf09bec4a889e0e0988704d52a2", key: "b2d0dce5c486891997c1c92ddaca2cd2", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10", group:["news", "entertainment"], },
pbo: { name: "PBO Pinoy Box Office", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/pbo_sd/default/index.mpd", keyId: "dcbdaaa6662d4188bdf97f9f0ca5e830", key: "31e752b441bd2972f2b98a4b1bc1c7a1", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pinoy_Box_Office_logo.svg/1200px-Pinoy_Box_Office_logo.svg.png", group:["movies"], },
viva_cinema: { name: "Viva Cinema", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/viva_sd/default/index.mpd", keyId: "07aa813bf2c147748046edd930f7736e", key: "3bd6688b8b44e96201e753224adfc8fb", logo: "httpss://static.wikia.nocookie.net/russel/images/2/2f/Viva_Cinema_(2021-.n.v.).png", group:["movies"], },
tmc: { name: "TMC", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_tagalogmovie/default/index.mpd", keyId: "96701d297d1241e492d41c397631d857", key: "ca2931211c1a261f082a3a2c4fd9f91b", logo: "httpss://upload.wikimedia.org/wikipedia/en/2/27/Tmc2021logo.png", group:["movies"], },
disneyxdd: { name: "Disney XD", type: "clearkey", manifestUri: "httpss://a53aivottepl-a.akamaihd.net/pdx-nitro/live/clients/dash/enc/jts4tzzv1k/out/v1/8a5b29f7068c415aa371ea95743382e6/cenc.mpd", keyId: "39cebece8b36640f9ba3f248ecfdf86a", key: "fad936249e036830aa5bef41bec05326", logo: "https://logos-world.net/wp-content/uploads/2023/06/Disney-XD-Logo-2009.png", group:["cartoons & animations"], },
dreamworks_tagalized: { name: "DreamWorks (Tagalized)", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworktag/default/index.mpd", keyId: "564b3b1c781043c19242c66e348699c5", key: "d3ad27d7fe1f14fb1a2cd5688549fbab", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPoIb5G0splDYh5wCQY_vWyooZSSjfalhaQ&s", group:["cartoons & animations"], },
disneyjr: { name: "Disney Jr.", type: "clearkey", manifestUri: "httpss://uselector.cdn.intigral-ott.net/DJR/DJR.isml/manifest.mpd", keyId: "f5df57914a0922d5d5ed6b0a4af6290a", key: "c62b10a180d1770a355b3c4cb6506ca0", logo: "https://www.pinpng.com/pngs/m/418-4182937_disney-junior-tv-logo-hd-png-download.png", group:["cartoons & animations"], },
crave1: { name: "Crave 1", type: "clearkey", manifestUri: "httpss://live-crave.video.9c9media.com/137c6e2e72e1bf67b82614c7c9b216d6f3a8c8281748505659713/fe/f/crave/crave1/manifest.mpd", keyId: "4a107945066f45a9af2c32ea88be60f4", key: "df97e849d68479ec16e395feda7627d0", logo: "https://the-bithub.com/crave1", group:["movies"], },
crave2: { name: "Crave 2", type: "clearkey", manifestUri: "httpss://live-crave.video.9c9media.com/ab4332c60e19b6629129eeb38a2a6ac6db5df2571721750022187/fe/f/crave/crave2/manifest.mpd", keyId: "4ac6eaaf0e5e4f94987cbb5b243b54e8", key: "8bb3f2f421f6afd025fa46c784944ad6", logo: "https://the-bithub.com/crave", group:["movies"], },
tap_sports: { name: "Tap Sports", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_tapsports/default/index.mpd", keyId: "eabd2d95c89e42f2b0b0b40ce4179ea0", key: "0e7e35a07e2c12822316c0dc4873903f", logo: "https://i.imgur.com/ZsWDiRF.png", group:["sports"], },
tvup: { name: "TVUP!", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/tvup_prd/default/index.mpd", keyId: "83e813ccd4ca4837afd611037af02f63", key: "a97c515dbcb5dcbc432bbd09d15afd41", logo: "https://cms.cignal.tv/Upload/Images/TVUP Logo .png", group:["news", "entertainment"], },
rock_action: { name: "Rock Action", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockextreme/default/index.mpd", keyId: "0f852fb8412b11edb8780242ac120002", key: "4cbc004d8c444f9f996db42059ce8178", logo: "https://uploads-ssl.webflow.com/64e961c3862892bff815289d/64f57100366fe5c8cb6088a7_logo_ext_web.png", group:["movies"], },
tap_tv: { name: "Tap TV", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_taptv_sd/default/index.mpd", keyId: "f6804251e90b4966889b7df94fdc621e", key: "55c3c014f2bd12d6bd62349658f24566", logo: "https://i.imgur.com/KJaSftF.png", group:["news", "entertainment"], },
knowledge_channel: { name: "Knowledge Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/knowledge_channel/default/index.mpd", keyId: "0f856fa0412b11edb8780242ac120002", key: "783374273ef97ad3bc992c1d63e091e7", logo: "https://i.imgur.com/UIqEr2y.png", group:["entertainment"], },
deped_tv: { name: "DepEd TV", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/depedch_sd/default/index.mpd", keyId: "0f853706412b11edb8780242ac120002", key: "2157d6529d80a760f60a8b5350dbc4df", logo: "httpss://static.wikia.nocookie.net/russel/images/f/f3/DepEd_TV_Logo_2020.png", group:["news", "entertainment"], },
fashion_tv: { name: "Fashion TV", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/fashiontvhd/default/index.mpd", keyId: "971ebbe2d887476398e97c37e0c5c591", key: "472aa631b1e671070a4bf198f43da0c7", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Fashion_TV_logo_2017.svg/1200px-Fashion_TV_logo_2017.svg.png", group:["entertainment"], },
kix: { name: "KIX", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/kix_hd1.mpd", keyId: "a8d5712967cd495ca80fdc425bc61d6b", key: "f248c29525ed4c40cc39baeee9634735", logo: "https://i.imgur.com/B8Fmzer.png", group:["entertainment"], },
hits: { name: "HITS", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/hits_hd1/default/index.mpd", keyId: "dac605bc197e442c93f4f08595a95100", key: "975e27ffc1b7949721ee3ccb4b7fd3e5", logo: "https://i.imgur.com/YeqyD9W.png", group:["movies"], },
history: { name: "History", logo: "https://cantseeus.com/wp-content/uploads/2023/10/History_28201529.png", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_historyhd.mpd", keyId: "a7724b7ca2604c33bb2e963a0319968a", key: "6f97e3e2eb2bade626e0281ec01d3675", group:["documentary"], },
bbcearth: { name: "BBC Earth", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/BBC_Earth_2023.svg/1200px-BBC_Earth_2023.svg.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_bbcearth_hd1/default/index.mpd", keyId: "34ce95b60c424e169619816c5181aded", key: "0e2a2117d705613542618f58bf26fc8e", group:["documentary"], },
uaap: { name: "UAAP Varsity Channel", logo: "https://i.imgur.com/V0sxXci.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_uaap_cplay_sd/default/index.mpd", keyId: "95588338ee37423e99358a6d431324b9", key: "6e0f50a12f36599a55073868f814e81e", group:["sports"], },
truefm: { name: "TrueFM TV", logo: "https://upload.wikimedia.org/wikipedia/en/4/40/Radyo5truefmlogo.webp", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/truefm_tv/default/index.mpd", keyId: "0559c95496d44fadb94105b9176c3579", key: "40d8bb2a46ffd03540e0c6210ece57ce", group:["news", "entertainment"], },
tvMaria: { name: "TV Maria", logo: "https://upload.wikimedia.org/wikipedia/en/c/c1/TV_MARIA_logo.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/tvmaria_prd/default/index.mpd", keyId: "fa3998b9a4de40659725ebc5151250d6", key: "998f1294b122bbf1a96c1ddc0cbb229f", group:["news", "entertainment"], },
rockentertainment: { name: "Rock Entertainment", logo: "https://i.imgur.com/fx1Y2Eh.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_rockentertainment/default/index.mpd", keyId: "e4ee0cf8ca9746f99af402ca6eed8dc7", key: "be2a096403346bc1d0bb0f812822bb62", group:["entertainment"], },
spotv: { name: "SPOTV", logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/media-upload/1634257286_thumb-spotv.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_spotvhd/default/index.mpd", keyId: "ec7ee27d83764e4b845c48cca31c8eef", key: "9c0e4191203fccb0fde34ee29999129e", group:["entertainment"], },
spotv2: { name: "SPOTV2", logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/media-upload/1634257305_thumb-spotv-2.png", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_spotv2hd/default/index.mpd", keyId: "7eea72d6075245a99ee3255603d58853", key: "6848ef60575579bf4d415db1032153ed", group:["entertainment"], },
premierSports2: { name: "Premier Sports 2", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/premiersports2hd/default/index.mpd", keyId: "59454adb530b4e0784eae62735f9d850", key: "61100d0b8c4dd13e4eb8b4851ba192cc", logo: "https://ownassetsmysky.blob.core.windows.net/assetsmysky/production/plans-and-bundles/1641949301_premier-sports-2.png", group:["sports"], },
nbaTvPh: { name: "NBA TV Philippines", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd", keyId: "f36eed9e95f140fabbc88a08abbeafff", key: "0125600d0eb13359c28bdab4a2ebe75a", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/NBA_TV.svg/1200px-NBA_TV.svg.png", group:["sports"], },
cinemax: { name: "Cinemax", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cinemax/default/index.mpd", keyId: "b207c44332844523a3a3b0469e5652d7", key: "fe71aea346db08f8c6fbf0592209f955", logo: "httpss://divign0fdw3sv.cloudfront.net/Images/ChannelLogo/contenthub/337_144.png", group:["movies"], },
lifetime: { name: "Lifetime", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/dr_lifetime/default/index.mpd", keyId: "cf861d26e7834166807c324d57df5119", key: "64a81e30f6e5b7547e3516bbf8c647d0", logo: "httpss://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Lifetime_2020.svg/2560px-Logo_Lifetime_2020.svg.png", group:["entertainment"], },
foodNetwork: { name: "Food Network", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/asianfoodnetwork_sd/default/index.mpd", keyId: "b7299ea0af8945479cd2f287ee7d530e", key: "b8ae7679cf18e7261303313b18ba7a14", logo: "httpss://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png", group:["entertainment"], },
axn: { name: "AXN", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_axn_sd.mpd", keyId: "fd5d928f5d974ca4983f6e9295dfe410", key: "3aaa001ddc142fedbb9d5557be43792f", logo: "httpss://img.favpng.com/5/15/4/axn-high-definition-television-logo-sony-pictures-png-favpng-n8hVJ8SzbcUmyNWN9RzpJMhfg.jpg", group:["news", "entertainment"], },
abcAustralia: { name: "ABC Australia", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/abc_aus/default/index.mpd", keyId: "389497f9f8584a57b234e27e430e04b7", key: "3b85594c7f88604adf004e45c03511c0", logo: "httpss://i.pinimg.com/736x/5a/66/65/5a666508bc5851a6a9c1151e7eefff3d.jpg", group:["documentary"], },
travelChannel: { name: "Travel Channel", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/travel_channel_sd/default/index.mpd", keyId: "f3047fc13d454dacb6db4207ee79d3d3", key: "bdbd38748f51fc26932e96c9a2020839", logo: "https://i.imgur.com/ZCYeUV2.png", group:["documentary"], },
bloomberg: { name: "Bloomberg", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/bloomberg_sd/default/index.mpd", keyId: "ef7d9dcfb99b406cb79fb9f675cba426", key: "b24094f6ca136af25600e44df5987af4", logo: "httpss://thumbs.dreamstime.com/b/bloomberg-logo-editorial-illustrative-white-background-logo-icon-vector-logos-icons-set-social-media-flat-banner-vectors-svg-210442338.jpg", group:["news", "entertainment"], },
bbc_news: { name: "BBC News", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/bbcworld_news_sd/default/index.mpd", keyId: "f59650be475e4c34a844d4e2062f71f3", key: "119639e849ddee96c4cec2f2b6b09b40", logo: "httpss://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_(Alt).svg/1200px-BBC_News_2022_(Alt).svg.png", group:["news", "entertainment"], },
dreamworks: { name: "DreamWorks HD", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworks_hd1/default/index.mpd", keyId: "4ab9645a2a0a47edbd65e8479c2b9669", key: "8cb209f1828431ce9b50b593d1f44079", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPoIb5G0splDYh5wCQY_vWyooZSSjfalhaQ&s", group:["cartoons & animations"], },
moonbug_kids: { name: "Moonbug", type: "clearkey", manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_moonbug_kids_sd/default/index.mpd", keyId: "0bf00921bec94a65a124fba1ef52b1cd", key: "0f1488487cbe05e2badc3db53ae0f29f", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Moonbug2ndLogo.png", group:["cartoons & animations"], },
cnn_ph: { name: "CNN Philippines", type: "clearkey", manifestUri: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_cnnhd.mpd", keyId: "900c43f0e02742dd854148b7a75abbec", key: "da315cca7f2902b4de23199718ed7e90", logo: "https://laguia.tv/_nuxt/img/CNN_512.0e91aae.png", group:["news", "entertainment"], },
cartoonChannelPH: { name: "Cartoon Channel PH (10 - 8)", type: "hls", manifestUri:"https://live20.bozztv.com/giatv/giatv-cartoonchannelph/cartoonchannelph/playlist.m3u8", logo:"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b58bbc88-0030-4447-b99e-19e7dbc51b14/de71xo3-266469a4-3bd5-4bd7-890e-192c7798e0bb.png/v1/fill/w_1192,h_670/cartoon_channel_ph_logo__2020___present__by_kierariel_de71xo3-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvYjU4YmJjODgtMDAzMC00NDQ3LWI5OWUtMTllN2RiYzUxYjE0XC9kZTcxeG8zLTI2NjQ2OWE0LTNiZDUtNGJkNy04OTBlLTE5MmM3Nzk4ZTBiYi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ClickvInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.2FyUXQBaLF5j9GldZMJAM1ltGPFq7pMwwr6V7wyGpFs", group:["cartoons & animations"], },
mrbean: { name: "MR BEAN", type: "hls", manifestUri: "https://amg00627-amg00627c30-rakuten-es-3990.playouts.now.amagi.tv/playlist/amg00627-banijayfast-mrbeanescc-rakutenes/playlist.m3u8", logo: "https://i.imgur.com/zKGnFe4.png", group:["cartoons & animations"], },
supertoons: { name: "SuperToons TV", type: "hls", manifestUri: "https://jmp2.uk/sam-GBBD5100001HL.m3u8", logo: "https://tvpnlogopeu.samsungcloud.tv/platform/image/sourcelogo/vc/00/02/34/GBBD5100001HL_20241030T142601SQUARE.png", group:["cartoons & animations"], },
jungopinoytv: { name: "Jungo Pinoy TV", type: "hls", manifestUri: "https://jungotvstream.chanall.tv/jungotv/jungopinoytv/stream.m3u8", logo: "https://yt3.googleusercontent.com/oT4LFcdusmWboxy8ZC9c6NS0riqRi6_96U-gXLT7C-NarXKKFjLDbyko6iFJVfr743e4eTnv=s900-c-k-c0x00ffffff-no-rj", group:["movies", "entertainment"], },
hallypop: { name: "Hallypop", type: "hls", manifestUri: "https://jungotvstream.chanall.tv/jungotv/hallypop/stream.m3u8", logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/GMA_HALLYPOP_LOGO_2020.jpg", group:["movies", "entertainment"], },
screamflix: { name: "ScreamFlix", type: "hls", manifestUri: "https://jungotvstream.chanall.tv/jungotv/screamflix/stream.m3u8", logo: "https://static.wikia.nocookie.net/logopedia/images/f/fb/Scream_Flix_Logo_2022.png/revision/latest/scale-to-width-down/1200?cb=20250419020619", group:["movies", "entertainment"], },
frontrow: { name: "Front Row", type: "hls", manifestUri: "https://jungotvstream.chanall.tv/jungotv/frontrow/stream.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRneG2hIDzQS75A9KHg2FJTbE76qj9fX301dA&s", group:["news", "entertainment"], },
combatgo: { name: "Combat Go", type: "hls", manifestUri: "https://jungotvstream.chanall.tv/jungotv/combatgo/stream.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYm23zkJn2ZVrGTMUfLULxPtcAycgK-zb96A&s", group:["movies"], },
awsn: { name: "AWSN", type: "hls", manifestUri: "https://amg02188-amg02188c2-jungotv-northamerica-5717.playouts.now.amagi.tv/playlist.m3u8", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrgyuzyxnS4PB5zqcMI9MyZwjgxsEwr4lpg&s", group:["sports"], },

    };
    
    let aFilteredChannelKeys = [];
    let sSelectedGroup = '__all';
    let iCurrentChannel = 0; 
    let iGroupListIndex = 1; // Default to 'EPG' (index 1)
    let iPlayingChannelIndex = -1; // --- FIX: Added to track playing channel ---
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

      // Default to EPG (index 1) or 'ALL CHANNELS' (index 3) if EPG isn't found
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

      await shaka.polyfill.installAll();
      if (!shaka.Player.isBrowserSupported()) {
        console.error("Browser not supported");
        return;
      }

      player = new shaka.Player();
      // SHAKA UI CUSTOMIZATION (PIP ONLY)
      ui = new shaka.ui.Overlay(player, o.PlayerContainer, o.AvPlayer);
     
      // --- FINAL FIX: Added enableControlsFade: false ---
      ui.configure({
        // controlPanelElements: ['pip'], // User script hides this
        overflowMenuButtons: [], // Hide all overflow buttons
        addSeekBar: false,
        addBigPlayButton: false,
        showBuffering: true,
        clickToPlay: false,
        enableControlsFade: false // --- THIS IS THE FIX ---
      });
      // --- END FIX ---
     
      player.attach(o.AvPlayer);

      player.configure({
        abr: { defaultBandwidthEstimate: 3000000 }, 
        streaming: {
          rebufferingGoal: 5, 
          bufferingGoal: 10  
        }
      });

     player.addEventListener('error', e => {
        console.error('Shaka Error:', e.detail);
        const isNetworkOrMediaError =
          e.detail.category === shaka.util.Error.Category.NETWORK ||
          e.detail.category === shaka.util.Error.Category.MEDIA ||
          e.detail.category === shaka.util.Error.Category.STREAMING;

        // --- FIX: Added !isSessionActive check ---
        if (!isNetworkOrMediaError && !isSessionActive) {
          showIdleAnimation(true);
        }
        // --- END FIX ---
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

      // --- FIX: The 4 lines that showed the loader here were a bug and have been removed ---
      
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
      // --- FIX: Changed default channel to a more stable one ---
      let initialChannelKey = 'KidoodleTV'; 
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
      // --- FIX: Set playing index on initial load ---
      iPlayingChannelIndex = iCurrentChannel;
     
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
     
      // --- FIX: Set playing index ONLY if it's not an initial (pre)load ---
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

      // --- NEW: Load-on-Click Logic ---
      // If this is the initial load, AND the user hasn't clicked "Play" yet,
      // just set the UI and show the play button, but DO NOT load the stream.
      if (options.isInitialLoad && !isSessionActive) {
          console.log("Initial load: Setting channel but not loading stream.");
          localStorage.setItem('iptvLastWatched', newChannelKey);
         
          if (o.AvPlayer) o.AvPlayer.style.opacity = '0';
         
          // --- FIX: This is the correct logic ---
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

      // --- FIX: Hide idle animation when a channel load starts ---
      if (isSessionActive) {
          hideIdleAnimation();
      }

      if (!player) {
          console.error("Player not initialized before loading channel.");
          return;
      }

      localStorage.setItem('iptvLastWatched', newChannelKey);

      showTempChannelSwitchMessage(newChannel.logo, newChannel.name, newChannel.number);

      if (o.AvPlayer) o.AvPlayer.style.opacity = '0';

      if (o.ChannelLoader) {
        // --- FIX: Update loading text ---
        const loaderText = document.getElementById('loading-channel-name');
        if (loaderText) {
          loaderText.textContent = `Loading ${newChannel.name}...`;
        }
        // --- END FIX ---
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
          // --- FIX: Clear both selected and playing classes ---
          const currentSelected = o.ChannelList.querySelector('.selected');
          if (currentSelected) currentSelected.classList.remove('selected');
          const currentPlaying = o.ChannelList.querySelector('.playing');
          if (currentPlaying) currentPlaying.classList.remove('playing');
          // --- END FIX ---

          const channelItems = o.ChannelList.querySelectorAll('li.channel-item');

          // --- ADD THIS BLOCK: Add .playing class ---
          if (iPlayingChannelIndex >= 0 && iPlayingChannelIndex < channelItems.length) {
              const playingItem = channelItems[iPlayingChannelIndex];
              if (playingItem) {
                  playingItem.classList.add('playing');
              }
          }
          // --- END ADD ---

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
      // --- FIX: Show settings for PLAYING channel ---
      if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
      const currentChannelKey = aFilteredChannelKeys[iPlayingChannelIndex]; 
      const currentChannel = channels[currentChannelKey];
      if (!currentChannel) return;

      if (o.SettingsMainMenu) {
          // --- FIX: Restored onclick to showVideoFormatMenu() ---
          o.SettingsMainMenu.innerHTML = `
            <div class="settings-item" onclick="showSettingsModal('subtitles')">Subtitle / Audio</div>
            <div class="settings-item" onclick="showVideoFormatMenu()">Video / Format</div>
            <div class="settings-item" onclick="toggleFavourite()">${currentChannel.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</div>
            <div class="settings-item" onclick="showSettingsModal('edit')">Edit Channel Info</div>
          `;
          updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
      } else { console.error("SettingsMainMenu element not found"); }
    }

    // --- FIX: Restored showVideoFormatMenu() ---
    function showVideoFormatMenu() {
      if (o.SettingsContainer) {
        o.SettingsContainer.classList.add('submenu-visible');
        iVideoSettingsIndex = 0;
        renderVideoFormatMenu();
      } else { console.error("SettingsContainer element not found."); }
    }

    // --- FIX: Restored hideVideoFormatMenu() ---
    function hideVideoFormatMenu() {
      if (o.SettingsContainer) {
          o.SettingsContainer.classList.remove('submenu-visible');
          iChannelSettingsIndex = 1; // Focus 'Video / Format' (index 1)
          if (o.SettingsMainMenu) {
              updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
          } else { console.error("SettingsMainMenu element not found for focus update."); }
      } else { console.error("SettingsContainer element not found."); }
    }

    // --- FIX: Restored renderVideoFormatMenu() ---
    function renderVideoFormatMenu() {
      if (o.SettingsVideoFormatMenu) {
          // --- FIX: Changed <select> to a button div ---
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
      
      // --- FIX: Close modal and re-render submenu ---
      hideSettingsModal();
      renderVideoFormatMenu(); // Re-render submenu to show new value
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

    // --- PATCH: NEW function to apply quality and close modal ---
    function setQuality(selected) {
      if (!player) return hideSettingsModal();
      
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
      
      hideSettingsModal(); // Close modal immediately
    }
    // --- END PATCH ---

    function renderModalContent(type) {
      let contentHtml = '';
      try {
          if (!player) return '<p>Player not initialized.</p>';

          // --- ADD THIS NEW BLOCK ---
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
          
          } else 
          // --- END OF NEW BLOCK ---
          
          if (type === 'quality') {
            const tracks = [...new Map((player.getVariantTracks() || []).filter(t => t.height).map(t => [t.height, t])).values()].sort((a,b)=>b.height-a.height);
            
            let itemsHtml = `<li class="modal-selectable" data-action="quality" data-value="auto" onclick="setQuality('auto')">Auto <input type="radio" name="quality" value="auto" ${player.getConfiguration()?.abr?.enabled ? 'checked' : ''}></li>`;
            tracks.forEach(track => {
              const bps = track.bandwidth > 1000000 ? `${(track.bandwidth/1e6).toFixed(2)} Mbps` : `${Math.round(track.bandwidth/1e3)} Kbps`;
              const isChecked = track.active && !player.getConfiguration()?.abr?.enabled;
              itemsHtml += `<li class="modal-selectable" data-action="quality" data-value='${track.id}' onclick="setQuality('${track.id}')">${track.height}p, ${bps} <input type="radio" name="quality" value='${track.id}' ${isChecked ? 'checked' : ''}></li>`;
            });
            
            contentHtml = `<h2>Video Quality</h2><ul class="popup-content-list">${itemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

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
            contentHtml = `<h2>Subtitles & Audio</h2><ul class="popup-content-list">${subItemsHtml}${audioItemsHtml}</ul><div class="popup-buttons"><button class="modal-selectable" data-action="close" onclick="hideSettingsModal()">CLOSE</button></div>`;

          } else if (type === 'edit') {
            // --- FIX: Show info for PLAYING channel ---
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
      // --- FIX: Edit info for PLAYING channel ---
      if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return hideSettingsModal(); 
      const key = aFilteredChannelKeys[iPlayingChannelIndex]; 
      if (!channels[key]) return hideSettingsModal();

      channels[key].name = nameInput.value;
      channels[key].logo = logoInput.value;
      buildNav();
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
      // --- FIX: Toggle fav for PLAYING channel ---
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
      // --- FIX: Restored call to hideVideoFormatMenu ---
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
      
      // --- FIX: Use iPlayingChannelIndex ---
      if (!aFilteredChannelKeys || iPlayingChannelIndex >= aFilteredChannelKeys.length || iPlayingChannelIndex < 0) return; 
      const chKey = aFilteredChannelKeys[iPlayingChannelIndex]; 
      // --- END FIX ---
      
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
      if (isSessionActive) return;
      isSessionActive = true;

      hideIdleAnimation();

      // --- FIX: Set playing index on first play ---
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

            // Use a broader selector to include <li>, <input>, and <button>
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
            }
        } catch (error) {
            console.error("Error updating settings modal selection:", error);
        }
    }

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

      // --- PATCH: Added edit_ch_name and edit_ch_logo to the activeElement check ---
      if (document.activeElement === o.SearchField ||
          document.activeElement === getEl('edit_ch_name') ||
          document.activeElement === getEl('edit_ch_logo') ||
          document.activeElement.tagName === 'SELECT' // Ignore keys if dropdown is open
          ) { 
          
          if (e.key === 'Escape') {
              e.preventDefault();
              if (document.activeElement) document.activeElement.blur();
          } else if (e.key === 'Enter') {
              e.preventDefault();
              if (document.activeElement) document.activeElement.blur();
          }
          // Allow all other keys (like typing)
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
          } else if (e.key === 'Enter') { 
              const selectedItem = items[iSettingsModalIndex];
              if (!selectedItem) return;
             
              if (selectedItem.tagName === 'INPUT') {
                  selectedItem.focus(); // Focus the input field
              }
              // --- FIX: Handle clicks on LI elements (for subtitles, etc.) ---
              else if (selectedItem.tagName === 'LI') {
                  selectedItem.click(); // Trigger the onclick
              } else if (selectedItem.tagName === 'BUTTON') {
                  selectedItem.click(); // Trigger button action
              }
          } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
              window.hideSettingsModal();
          }
          // --- FIX: Left/Right arrows do nothing else in modals ---
          return;
      }
      // --- END MODAL NAVIGATION FIX ---
     
      // Logic inside NAV PANEL (Left)
      if (bNavOpened) {
        e.preventDefault();
        if (bGroupsOpened) {
          // --- PATCH START: Updated Group List keyboard logic ---
          const groupItems = o.GroupList?.querySelectorAll('li') ?? [];
          const selectedItem = groupItems[iGroupListIndex];

          if (e.key === 'ArrowUp') {
              iGroupListIndex = Math.max(0, iGroupListIndex - 1);
          } else if (e.key === 'ArrowDown') {
              iGroupListIndex = Math.min(groupItems.length - 1, iGroupListIndex + 1);
          } else if (e.key === 'Enter') { 
              // --- FIX: 'Enter' is the only key that selects ---
              selectedItem?.click(); 
          } else if (e.key === 'ArrowRight' || e.key === 'Escape') { // 'Right' is GO BACK
              hideGroups(); // Groups -> Channels
          } else if (e.key === 'ArrowLeft') { // 'Left' is DRILL DOWN
              // --- FIX: Does nothing, as requested ---
          }
          updateSelectedGroupInNav();
          // --- PATCH END ---

        } else { 
          // CHANNEL LIST (Currently visible)
          const channelItems = o.ChannelList.querySelectorAll('li.channel-item');
          const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight', 'Escape', 'ArrowLeft'];
          if (!ARROW_KEYS.includes(e.key)) return;
         
          if (e.key === 'ArrowUp') {
              if (iCurrentChannel === 0 && o.SearchField) { 
                  o.SearchField.focus();
                  if (channelItems[iCurrentChannel]) { // Add check
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
     
      // Logic inside CHANNEL SETTINGS PANEL (Right)
      if (bChannelSettingsOpened) {
        e.preventDefault();
        // --- FIX: Restored isSubmenu logic ---
        const isSubmenu = o.SettingsContainer?.classList.contains('submenu-visible');
        const ARROW_KEYS = ['Escape', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'ArrowRight'];
        
        if (!ARROW_KEYS.includes(e.key)) return;

        if (isSubmenu) {
            // --- PATCH START: Submenu logic fixed ---
            const submenuItems = o.SettingsVideoFormatMenu?.querySelectorAll('.settings-item') ?? [];
            if (e.key === 'ArrowUp') {
                iVideoSettingsIndex = Math.max(0, iVideoSettingsIndex - 1);
            } else if (e.key === 'ArrowDown') {
                iVideoSettingsIndex = Math.min(submenuItems.length - 1, iVideoSettingsIndex + 1);
            } else if (e.key === 'Enter') { // 'Enter' is for selection
                submenuItems[iVideoSettingsIndex]?.click();
            } else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // 'Left' is GO BACK
                hideVideoFormatMenu(); // Slide back to Main Settings Menu
            }
            // 'ArrowRight' does nothing here
            updateSettingsSelection(o.SettingsVideoFormatMenu, iVideoSettingsIndex);
            // --- PATCH END ---
        } else { 
            // --- PATCH START: Main Settings Menu logic fixed ---
            const mainItems = o.SettingsMainMenu?.querySelectorAll('.settings-item') ?? [];
            if (e.key === 'ArrowUp') {
                iChannelSettingsIndex = Math.max(0, iChannelSettingsIndex - 1);
            } else if (e.key === 'ArrowDown') {
                iChannelSettingsIndex = Math.min(mainItems.length - 1, iChannelSettingsIndex + 1);
            } else if (e.key === 'Enter') { // 'Enter' is for selection
                mainItems[iChannelSettingsIndex]?.click();
            } else if (e.key === 'ArrowRight') { // 'Right' is DRILL DOWN
                // Only drill down if it's the 'Video / Format' button (index 1)
                if (iChannelSettingsIndex === 1) {
                    mainItems[iChannelSettingsIndex]?.click(); // Clicks 'Video / Format'
                }
                // Otherwise, 'ArrowRight' does nothing
            }
            else if (e.key === 'ArrowLeft' || e.key === 'Escape') { // 'Left' is GO BACK
                 hideChannelSettings(); // Close the entire Settings panel
            }
            updateSettingsSelection(o.SettingsMainMenu, iChannelSettingsIndex);
            // --- PATCH END ---
        }
        return;
      }


      // DEFAULT PLAYER KEYS (Panels are closed)
      const PLAYER_KEYS = ['ArrowLeft', 'ArrowRight', 'Enter', 'ArrowUp', 'ArrowDown', 'h', 'e', 'Escape', 'm'];
      if (!PLAYER_KEYS.includes(e.key)) return;

      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
            showNav(); // Open Channel List (Drill Down to Panel)
            break;
        case 'ArrowRight': 
            showChannelSettings(); // Open Settings (Drill Down to Panel)
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

    // --- USER'S NEW SCRIPT BLOCK ---
    document.addEventListener('shaka-ui-loaded', () => {
      const video = document.getElementById('avplayer');
      // Check if ui is available on video object, otherwise use the global ui
      const uiInstance = video['ui'] || ui;
      if (!uiInstance) {
          console.error("Shaka UI not found on video element.");
          return;
      }
      const controls = uiInstance.getControls();
      if (!controls) {
          console.error("Shaka UI Controls not found.");
          return;
      }

      /* --- 1. REMOVE ALL SHAKA CONTROLS --- */
      const controlsContainer = document.querySelector('.shaka-controls-container');
      if (controlsContainer) {
        controlsContainer.style.display = 'none'; // hide all controls
        controlsContainer.style.pointerEvents = 'none';
      }

      // disable Shaka auto-hide (even though hidden)
      controls.setAutoHide(false);

      /* --- 2. DISABLE ALL FADE ANIMATIONS --- */
      const allUIElements = document.querySelectorAll('.shaka-controls-container *');
      allUIElements.forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
        el.style.opacity = '1';
      });

      /* --- 3. DISABLE PAUSE FUNCTION COMPLETELY --- */
      // force play if any pause event happens
      video.addEventListener('pause', (e) => {
        if (!video.ended) video.play();
      });

      // block all clicks and spacebar that might toggle pause
      video.addEventListener('click', (e) => e.preventDefault());
      window.addEventListener('keydown', (e) => {
        // --- FIX: Added check for SearchField focus ---
        if ((e.code === 'Space' || e.key === ' ') && document.activeElement !== o.SearchField) {
           e.preventDefault();
        }
      });

      // extra protection — remove play/pause button from DOM
      const pauseButton = document.querySelector('.shaka-play-button-container');
      if (pauseButton) pauseButton.remove();
    });
