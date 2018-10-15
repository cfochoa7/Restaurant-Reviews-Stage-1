/*The name of the cache storage is put in a variable of 'cacheName'*/
let cacheName = 'siteCacheV1';
/*All files that will be record and stored in the cache storage are pu in th 'urls' variables */
let urls = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',

  /*The .js & .css takes in the location markers' name from the mapAPI and will display unrenderd images when offline*/
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',

  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

/*The addEventListener will install cache storage with the selected files.
The function will wait until the caches open and will then pass the 'urls' in the the cache storage.
note--further research has suggested that the longer the list of files included in the 'urls' has a higher chance of failing to cache
No experience with this so far.
https://developers.google.com/web/fundamentals/primers/service-workers*/

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(cacheName).then(function(cache) {
  console.log('opened');
  return cache.addAll(urls);
  })
 );
});

/*The addEventListener will will return the specific cache request and display it on the web page.
The 'fetch' will look in the cache storage and will match the appropriate request.
This varies depending if the webpage was visited before any offline activity in order to record the cache.
https://developers.google.com/web/fundamentals/primers/service-workers*/

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
