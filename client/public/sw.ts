// Ensure Service Worker Global Scope types are available for TypeScript
/// <reference lib="webworker" />

self.addEventListener("fetch", (event: any) => {
    console.log("Fetching:", event.request.url);
  });
  
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
  });
  
  self.addEventListener("fetch", (event) => {
    const fetchEvent = event as unknown as FetchEvent;
    console.log("Fetching:", fetchEvent.request.url);
  });
  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}
