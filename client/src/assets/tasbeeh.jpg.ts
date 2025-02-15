// Using a base64 encoded gradient as a placeholder
export const bgImageBase64 = `data:image/svg+xml;base64,${btoa(`
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="url(#paint0_linear)"/>
  <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="1920" y2="1080" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f8f9fa"/>
      <stop offset="1" stop-color="#e9ecef"/>
    </linearGradient>
  </defs>
</svg>
`)}`;

export default bgImageBase64;
