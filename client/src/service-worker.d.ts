export {};

declare global {
  interface FetchEvent extends Event {
    readonly request: Request;
    respondWith(response: Response | Promise<Response>): void;
  }

  interface ServiceWorkerGlobalScope {
    skipWaiting(): void;
    clients: Clients;
  }

  var self: ServiceWorkerGlobalScope;
}
