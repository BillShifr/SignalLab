const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/grafana',
        destination: 'http://grafana:3000/',
      },
      {
        source: '/grafana/:path*',
        destination: 'http://grafana:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
