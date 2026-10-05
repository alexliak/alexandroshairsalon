// Static site for GitHub Pages: `npm run build` writes every page as ready HTML into out/.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true
};

export default nextConfig;
