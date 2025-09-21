const CACHE_NAME = 'auravein-v1'
const urlsToCache = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/IMG_7127.JPG',
  '/IMG_7222.JPG',
  '/IMG_7223.JPG',
  '/IMG_7218.JPG',
  '/IMG_7224.JPG',
  '/auraveinsoc.jpg'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})