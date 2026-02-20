// 定义缓存名称，如果修改了代码想要用户端更新，需要修改这个版本号 (比如改为 v2)
const CACHE_NAME = 'english-helper-v2';
// 需要缓存的文件列表
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // 如果您添加了本地图标文件，记得在这里加上，例如: './icon.png'
];

// 1. 安装事件：此时进行文件缓存
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // 立即接管页面
    return self.clients.claim();
});

// 3. 请求拦截：优先使用缓存 (Cache First 策略)
// 这样离线时也能直接从缓存读取页面
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // 如果缓存里有，就直接返回缓存的内容
            if (response) {
                return response;
            }
            // 如果缓存没有，就去网络请求
            return fetch(event.request);
        })
    );
});
