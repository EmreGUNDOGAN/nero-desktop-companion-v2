'use strict';
(function(root){const brands=[
  {
    "id": "netflix",
    "name": "Netflix",
    "color": "#E50914",
    "aliases": [
      "netflix"
    ],
    "source": "https://brand.netflix.com/en/assets/logos",
    "pack": "16.34.0"
  },
  {
    "id": "youtube",
    "name": "YouTube",
    "color": "#FF0000",
    "aliases": [
      "youtube premium",
      "youtube geliri"
    ],
    "source": "https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors",
    "pack": "16.34.0"
  },
  {
    "id": "openai",
    "name": "ChatGPT / OpenAI",
    "color": "#412991",
    "aliases": [
      "chatgpt",
      "chat gpt",
      "open ai"
    ],
    "source": "https://openai.com",
    "pack": "11.15.0"
  },
  {
    "id": "spotify",
    "name": "Spotify",
    "color": "#1ED760",
    "aliases": [],
    "source": "https://developer.spotify.com/documentation/general/design-and-branding/#using-our-logo",
    "pack": "16.34.0"
  },
  {
    "id": "amazonprime",
    "name": "Amazon Prime",
    "color": "#00A8E1",
    "aliases": [
      "prime video",
      "amazon prime"
    ],
    "source": "https://www.amazon.com/b?node=17277626011",
    "pack": "11.15.0"
  },
  {
    "id": "amazon",
    "name": "Amazon",
    "color": "#FF9900",
    "aliases": [],
    "source": "https://www.amazon.com",
    "pack": "11.15.0"
  },
  {
    "id": "appletv",
    "name": "Apple TV",
    "color": "#000000",
    "aliases": [],
    "source": "https://en.wikipedia.org/wiki/File:Apple_TV_(logo).svg",
    "pack": "16.34.0"
  },
  {
    "id": "apple",
    "name": "Apple",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.apple.com",
    "pack": "16.34.0"
  },
  {
    "id": "applemusic",
    "name": "Apple Music",
    "color": "#FA243C",
    "aliases": [],
    "source": "https://www.apple.com/itunes/marketing-on-music/identity-guidelines.html#apple-music-icon",
    "pack": "16.34.0"
  },
  {
    "id": "google",
    "name": "Google",
    "color": "#4285F4",
    "aliases": [
      "google one"
    ],
    "source": "https://partnermarketinghub.withgoogle.com",
    "pack": "16.34.0"
  },
  {
    "id": "googledrive",
    "name": "Google Drive",
    "color": "#4285F4",
    "aliases": [],
    "source": "https://developers.google.com/drive/web/branding",
    "pack": "16.34.0"
  },
  {
    "id": "googlephotos",
    "name": "Google Photos",
    "color": "#4285F4",
    "aliases": [],
    "source": "https://partnermarketinghub.withgoogle.com/brands/google-photos/visual-identity/visual-identity/icon/",
    "pack": "16.34.0"
  },
  {
    "id": "googleplay",
    "name": "Google Play",
    "color": "#414141",
    "aliases": [],
    "source": "https://partnermarketinghub.withgoogle.com/brands/google-play/visual-identity/primary-logos/",
    "pack": "16.34.0"
  },
  {
    "id": "youtubemusic",
    "name": "YouTube Music",
    "color": "#FF0000",
    "aliases": [],
    "source": "https://partnermarketinghub.withgoogle.com/#/brands",
    "pack": "16.34.0"
  },
  {
    "id": "twitch",
    "name": "Twitch",
    "color": "#9146FF",
    "aliases": [],
    "source": "https://brand.twitch.tv",
    "pack": "16.34.0"
  },
  {
    "id": "discord",
    "name": "Discord",
    "color": "#5865F2",
    "aliases": [],
    "source": "https://discord.com/branding",
    "pack": "16.34.0"
  },
  {
    "id": "telegram",
    "name": "Telegram",
    "color": "#26A5E4",
    "aliases": [],
    "source": "https://telegram.org/tour/screenshots",
    "pack": "16.34.0"
  },
  {
    "id": "whatsapp",
    "name": "WhatsApp",
    "color": "#25D366",
    "aliases": [],
    "source": "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand",
    "pack": "16.34.0"
  },
  {
    "id": "instagram",
    "name": "Instagram",
    "color": "#FF0069",
    "aliases": [],
    "source": "https://about.meta.com/brand/resources/instagram",
    "pack": "16.34.0"
  },
  {
    "id": "facebook",
    "name": "Facebook",
    "color": "#0866FF",
    "aliases": [],
    "source": "https://about.meta.com/brand/resources/facebook/logo",
    "pack": "16.34.0"
  },
  {
    "id": "tiktok",
    "name": "TikTok",
    "color": "#000000",
    "aliases": [],
    "source": "https://tiktok.com",
    "pack": "16.34.0"
  },
  {
    "id": "x",
    "name": "X",
    "color": "#000000",
    "aliases": [],
    "source": "https://x.com",
    "pack": "16.34.0"
  },
  {
    "id": "snapchat",
    "name": "Snapchat",
    "color": "#FFFC00",
    "aliases": [],
    "source": "https://www.snapchat.com/brand-guidelines",
    "pack": "16.34.0"
  },
  {
    "id": "pinterest",
    "name": "Pinterest",
    "color": "#BD081C",
    "aliases": [],
    "source": "https://business.pinterest.com/en/brand-guidelines",
    "pack": "16.34.0"
  },
  {
    "id": "reddit",
    "name": "Reddit",
    "color": "#FF4500",
    "aliases": [],
    "source": "https://www.redditinc.com/brand",
    "pack": "16.34.0"
  },
  {
    "id": "linkedin",
    "name": "LinkedIn",
    "color": "#0A66C2",
    "aliases": [],
    "source": "https://brand.linkedin.com",
    "pack": "11.15.0"
  },
  {
    "id": "steam",
    "name": "Steam",
    "color": "#000000",
    "aliases": [
      "steam oyun"
    ],
    "source": "https://partner.steamgames.com/doc/marketing/branding",
    "pack": "16.34.0"
  },
  {
    "id": "epicgames",
    "name": "Epic Games",
    "color": "#313131",
    "aliases": [],
    "source": "https://dev.epicgames.com/docs/services/en-US/EpicAccountServices/DesignGuidelines/index.html#epicgamesbrandguidelines",
    "pack": "16.34.0"
  },
  {
    "id": "playstation",
    "name": "PlayStation",
    "color": "#0070D1",
    "aliases": [],
    "source": "https://www.playstation.com/en-us/",
    "pack": "16.34.0"
  },
  {
    "id": "xbox",
    "name": "Xbox",
    "color": "#107C10",
    "aliases": [],
    "source": "https://www.xbox.com/en-US/consoles",
    "pack": "11.15.0"
  },
  {
    "id": "nintendo",
    "name": "Nintendo",
    "color": "#E60012",
    "aliases": [],
    "source": "https://www.nintendo.com",
    "pack": "11.15.0"
  },
  {
    "id": "ea",
    "name": "EA",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.ea.com",
    "pack": "16.34.0"
  },
  {
    "id": "riotgames",
    "name": "Riot Games",
    "color": "#EB0029",
    "aliases": [],
    "source": "https://www.riotgames.com/en/press",
    "pack": "16.34.0"
  },
  {
    "id": "roblox",
    "name": "Roblox",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.roblox.com",
    "pack": "16.34.0"
  },
  {
    "id": "patreon",
    "name": "Patreon",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.patreon.com/brand",
    "pack": "16.34.0"
  },
  {
    "id": "kick",
    "name": "Kick",
    "color": "#53FC19",
    "aliases": [],
    "source": "https://kick.com",
    "pack": "16.34.0"
  },
  {
    "id": "substack",
    "name": "Substack",
    "color": "#FF6719",
    "aliases": [],
    "source": "https://on.substack.com",
    "pack": "16.34.0"
  },
  {
    "id": "medium",
    "name": "Medium",
    "color": "#000000",
    "aliases": [],
    "source": "https://medium.design/logos-and-brand-guidelines-f1a01a733592",
    "pack": "16.34.0"
  },
  {
    "id": "adobe",
    "name": "Adobe",
    "color": "#FF0000",
    "aliases": [],
    "source": "https://www.adobe.com",
    "pack": "11.15.0"
  },
  {
    "id": "adobephotoshop",
    "name": "Adobe Photoshop",
    "color": "#31A8FF",
    "aliases": [],
    "source": "https://www.adobe.com/creativecloud.html",
    "pack": "11.15.0"
  },
  {
    "id": "adobeillustrator",
    "name": "Adobe Illustrator",
    "color": "#FF9A00",
    "aliases": [],
    "source": "https://www.adobe.com/creativecloud.html",
    "pack": "11.15.0"
  },
  {
    "id": "adobecreativecloud",
    "name": "Adobe Creative Cloud",
    "color": "#DA1F26",
    "aliases": [],
    "source": "https://www.adobe.com/creativecloud.html",
    "pack": "11.15.0"
  },
  {
    "id": "canva",
    "name": "Canva",
    "color": "#00C4CC",
    "aliases": [],
    "source": "https://www.canva.com",
    "pack": "11.15.0"
  },
  {
    "id": "figma",
    "name": "Figma",
    "color": "#F24E1E",
    "aliases": [],
    "source": "https://www.figma.com/using-the-figma-brand/",
    "pack": "16.34.0"
  },
  {
    "id": "notion",
    "name": "Notion",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.notion.so",
    "pack": "16.34.0"
  },
  {
    "id": "dropbox",
    "name": "Dropbox",
    "color": "#0061FF",
    "aliases": [],
    "source": "https://www.dropbox.com/branding",
    "pack": "16.34.0"
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "color": "#5E5E5E",
    "aliases": [],
    "source": "https://developer.microsoft.com",
    "pack": "11.15.0"
  },
  {
    "id": "microsoftonedrive",
    "name": "Microsoft OneDrive",
    "color": "#0078D4",
    "aliases": [],
    "source": "https://developer.microsoft.com/en-us/fluentui#/styles/web/colors/products",
    "pack": "11.15.0"
  },
  {
    "id": "zoom",
    "name": "Zoom",
    "color": "#0B5CFF",
    "aliases": [],
    "source": "https://brand.zoom.us/media-library/",
    "pack": "16.34.0"
  },
  {
    "id": "skype",
    "name": "Skype",
    "color": "#00AFF0",
    "aliases": [],
    "source": "https://blogs.skype.com/?attachment_id=56273",
    "pack": "11.15.0"
  },
  {
    "id": "slack",
    "name": "Slack",
    "color": "#4A154B",
    "aliases": [],
    "source": "https://slack.com/brand-guidelines",
    "pack": "11.15.0"
  },
  {
    "id": "github",
    "name": "GitHub",
    "color": "#181717",
    "aliases": [],
    "source": "https://github.com/logos",
    "pack": "16.34.0"
  },
  {
    "id": "digitalocean",
    "name": "DigitalOcean",
    "color": "#0080FF",
    "aliases": [],
    "source": "https://www.digitalocean.com/press/",
    "pack": "16.34.0"
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare",
    "color": "#F38020",
    "aliases": [],
    "source": "https://www.cloudflare.com/logo/",
    "pack": "16.34.0"
  },
  {
    "id": "hostinger",
    "name": "Hostinger",
    "color": "#673DE6",
    "aliases": [],
    "source": "https://www.hostinger.com/newsroom",
    "pack": "16.34.0"
  },
  {
    "id": "wordpress",
    "name": "WordPress",
    "color": "#21759B",
    "aliases": [],
    "source": "https://wordpress.org/about/logos",
    "pack": "16.34.0"
  },
  {
    "id": "wix",
    "name": "Wix",
    "color": "#0C6EFC",
    "aliases": [],
    "source": "https://www.wix.com/about/design-assets",
    "pack": "16.34.0"
  },
  {
    "id": "squarespace",
    "name": "Squarespace",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.squarespace.com/logo-guidelines",
    "pack": "16.34.0"
  },
  {
    "id": "shopify",
    "name": "Shopify",
    "color": "#7AB55C",
    "aliases": [],
    "source": "https://www.shopify.com/brand-assets",
    "pack": "16.34.0"
  },
  {
    "id": "ebay",
    "name": "eBay",
    "color": "#E53238",
    "aliases": [],
    "source": "https://go.developer.ebay.com/logos",
    "pack": "16.34.0"
  },
  {
    "id": "etsy",
    "name": "Etsy",
    "color": "#F16521",
    "aliases": [],
    "source": "https://www.etsy.com/uk/press",
    "pack": "16.34.0"
  },
  {
    "id": "aliexpress",
    "name": "AliExpress",
    "color": "#FF4747",
    "aliases": [],
    "source": "https://www.alibabagroup.com/en/ir/reports",
    "pack": "16.34.0"
  },
  {
    "id": "nike",
    "name": "Nike",
    "color": "#111111",
    "aliases": [],
    "source": "https://www.nike.com",
    "pack": "16.34.0"
  },
  {
    "id": "adidas",
    "name": "Adidas",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.adidas.com",
    "pack": "16.34.0"
  },
  {
    "id": "puma",
    "name": "Puma",
    "color": "#242B2F",
    "aliases": [],
    "source": "https://us.puma.com",
    "pack": "16.34.0"
  },
  {
    "id": "ikea",
    "name": "IKEA",
    "color": "#0058A3",
    "aliases": [],
    "source": "https://www.ikea.com",
    "pack": "16.34.0"
  },
  {
    "id": "zara",
    "name": "Zara",
    "color": "#000000",
    "aliases": [],
    "source": "https://www.zara.com",
    "pack": "16.34.0"
  },
  {
    "id": "starbucks",
    "name": "Starbucks",
    "color": "#006241",
    "aliases": [],
    "source": "https://starbucks.com",
    "pack": "16.34.0"
  },
  {
    "id": "mcdonalds",
    "name": "McDonald's",
    "color": "#FBC817",
    "aliases": [],
    "source": "https://www.mcdonalds.com/gb/en-gb/newsroom.html",
    "pack": "16.34.0"
  },
  {
    "id": "burgerking",
    "name": "Burger King",
    "color": "#D62300",
    "aliases": [],
    "source": "https://www.bk.com",
    "pack": "16.34.0"
  },
  {
    "id": "kfc",
    "name": "KFC",
    "color": "#F40027",
    "aliases": [],
    "source": "https://global.kfc.com/asset-library/",
    "pack": "16.34.0"
  },
  {
    "id": "uber",
    "name": "Uber",
    "color": "#000000",
    "aliases": [],
    "source": "https://assets.uber.com/d/k4nuxdZ8MC7E/logos/collection/151",
    "pack": "16.34.0"
  },
  {
    "id": "ubereats",
    "name": "Uber Eats",
    "color": "#06C167",
    "aliases": [],
    "source": "https://assets.uber.com/d/k4nuxdZ8MC7E/logos/collection/150",
    "pack": "16.34.0"
  },
  {
    "id": "airbnb",
    "name": "Airbnb",
    "color": "#FF5A5F",
    "aliases": [],
    "source": "https://www.airbnb.com",
    "pack": "16.34.0"
  },
  {
    "id": "bookingdotcom",
    "name": "Booking.com",
    "color": "#003A9A",
    "aliases": [],
    "source": "https://www.bookingholdings.com/media-room",
    "pack": "16.34.0"
  },
  {
    "id": "tripadvisor",
    "name": "Tripadvisor",
    "color": "#34E0A1",
    "aliases": [],
    "source": "https://tripadvisor.mediaroom.com/logo-guidelines",
    "pack": "16.34.0"
  },
  {
    "id": "turkishairlines",
    "name": "Turkish Airlines",
    "color": "#C70A0C",
    "aliases": [],
    "source": "https://www.turkishairlines.com/en-int/press-room/logo-archive/index.html",
    "pack": "16.34.0"
  },
  {
    "id": "ryanair",
    "name": "Ryanair",
    "color": "#073590",
    "aliases": [],
    "source": "https://corporate.ryanair.com/media-centre/stock-images-gallery/#album-container-3",
    "pack": "16.34.0"
  },
  {
    "id": "duolingo",
    "name": "Duolingo",
    "color": "#58CC02",
    "aliases": [],
    "source": "https://design.duolingo.com",
    "pack": "16.34.0"
  },
  {
    "id": "coursera",
    "name": "Coursera",
    "color": "#0056D2",
    "aliases": [],
    "source": "https://about.coursera.org/press",
    "pack": "16.34.0"
  },
  {
    "id": "udemy",
    "name": "Udemy",
    "color": "#A435F0",
    "aliases": [],
    "source": "https://udemy.com",
    "pack": "16.34.0"
  },
  {
    "id": "skillshare",
    "name": "Skillshare",
    "color": "#00FF84",
    "aliases": [],
    "source": "https://www.skillshare.com",
    "pack": "16.34.0"
  },
  {
    "id": "grammarly",
    "name": "Grammarly",
    "color": "#027E6F",
    "aliases": [],
    "source": "https://www.grammarly.com/media-assets",
    "pack": "16.34.0"
  },
  {
    "id": "deepl",
    "name": "DeepL",
    "color": "#0F2B46",
    "aliases": [],
    "source": "https://www.deepl.com/press.html",
    "pack": "16.34.0"
  },
  {
    "id": "proton",
    "name": "Proton",
    "color": "#6D4AFF",
    "aliases": [],
    "source": "https://proton.me/media/kit",
    "pack": "16.34.0"
  },
  {
    "id": "protonmail",
    "name": "Proton Mail",
    "color": "#6D4AFF",
    "aliases": [],
    "source": "https://proton.me/media/kit",
    "pack": "16.34.0"
  },
  {
    "id": "nordvpn",
    "name": "NordVPN",
    "color": "#4687FF",
    "aliases": [],
    "source": "https://nordvpn.com/press-area/",
    "pack": "16.34.0"
  },
  {
    "id": "expressvpn",
    "name": "ExpressVPN",
    "color": "#DA3940",
    "aliases": [],
    "source": "https://www.expressvpn.com/press",
    "pack": "16.34.0"
  },
  {
    "id": "surfshark",
    "name": "Surfshark",
    "color": "#1EBFBF",
    "aliases": [],
    "source": "https://surfshark.com/press/assets",
    "pack": "16.34.0"
  },
  {
    "id": "bitwarden",
    "name": "Bitwarden",
    "color": "#175DDC",
    "aliases": [],
    "source": "https://bitwarden.com/brand",
    "pack": "16.34.0"
  },
  {
    "id": "1password",
    "name": "1Password",
    "color": "#145FE4",
    "aliases": [],
    "source": "https://1password.com/press",
    "pack": "16.34.0"
  },
  {
    "id": "lastpass",
    "name": "LastPass",
    "color": "#D32D27",
    "aliases": [],
    "source": "https://lastpass.com/press-room/",
    "pack": "16.34.0"
  },
  {
    "id": "trello",
    "name": "Trello",
    "color": "#0052CC",
    "aliases": [],
    "source": "https://atlassian.design/resources/logo-library",
    "pack": "16.34.0"
  },
  {
    "id": "asana",
    "name": "Asana",
    "color": "#F06A6A",
    "aliases": [],
    "source": "https://asana.com/brand",
    "pack": "16.34.0"
  },
  {
    "id": "todoist",
    "name": "Todoist",
    "color": "#E44332",
    "aliases": [],
    "source": "https://doist.com/press",
    "pack": "16.34.0"
  },
  {
    "id": "evernote",
    "name": "Evernote",
    "color": "#00A82D",
    "aliases": [],
    "source": "https://evernote.com/about-us",
    "pack": "16.34.0"
  },
  {
    "id": "ticktick",
    "name": "TickTick",
    "color": "#4772FA",
    "aliases": [],
    "source": "https://ticktick.com",
    "pack": "16.34.0"
  },
  {
    "id": "samsung",
    "name": "Samsung",
    "color": "#1428A0",
    "aliases": [],
    "source": "https://www.samsung.com/us/about-us/brand-identity/logo/",
    "pack": "16.34.0"
  },
  {
    "id": "huawei",
    "name": "Huawei",
    "color": "#FF0000",
    "aliases": [],
    "source": "https://e.huawei.com/ph/material/partner/0a72728b864949c48b22106454352483",
    "pack": "16.34.0"
  },
  {
    "id": "xiaomi",
    "name": "Xiaomi",
    "color": "#FF6900",
    "aliases": [],
    "source": "https://www.mi.com/global",
    "pack": "16.34.0"
  }
];const normalize=s=>String(s||'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]/g,'');const detect=s=>{const n=normalize(s);return brands.slice().sort((a,b)=>b.name.length-a.name.length).find(b=>[b.id,b.name,...b.aliases].some(a=>{const v=normalize(a);return v.length>=3&&n.includes(v);}));};const api={brands,detect};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NeroBrands=api;})(typeof window!=='undefined'?window:globalThis);
